import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { logger } from './logger';

const prisma = new PrismaClient();

async function columnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<{ exists: number }[]>`
      SELECT 1 as exists
      FROM information_schema.columns
      WHERE table_name = ${tableName} AND column_name = ${columnName}
      LIMIT 1
    `;
    return Array.isArray(rows) && rows.length > 0;
  } catch (e) {
    return false;
  }
}

async function safeTruncate() {
  // Soft reset content tables for repeatable seeds (does not drop tables)
  // Note: Using updateMany/deleteMany for idempotency and safety on managed DBs
  await prisma.communicationAttachment.deleteMany({});
  await prisma.communication.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.workItem.deleteMany({});
  await prisma.lead.deleteMany({});
}

export const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // 0) Optional soft reset (content tables only)
    await safeTruncate();

    // 1) Roles (robust upserts)
    logger.info('Creating initial roles...');
    const roleDefs = [
      { name: 'Admin', description: 'System Administrator with full access' },
      { name: 'User', description: 'Regular user with limited access' },
      { name: 'Sales', description: 'Sales representative with lead and customer access' },
      { name: 'Manager', description: 'Manager with team oversight capabilities' },
    ];
    for (const r of roleDefs) {
      await prisma.role.upsert({ where: { name: r.name }, update: { description: r.description, is_active: true }, create: { name: r.name, description: r.description, is_active: true } });
    }

    const adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
    if (!adminRole) throw new Error('Failed to create/find admin role');

    // 2) Admin user (upsert)
    logger.info('Creating admin user...');
    await prisma.user.upsert({
      where: { email: 'admin@system.com' },
      update: { password: hashedPassword, role_id: adminRole.id, is_active: true },
      create: { name: 'System Administrator', email: 'admin@system.com', password: hashedPassword, role_id: adminRole.id, is_active: true },
    });

    const adminUser = await prisma.user.findFirst({ where: { email: 'admin@system.com' } });
    if (!adminUser) throw new Error('Failed to create/find admin user');

    // 3) Lead statuses (upserts)
    logger.info('Creating lead statuses...');
    const statusDefs = [
      { name: 'NEW', description: 'Newly acquired lead' },
      { name: 'CONTACTED', description: 'Initial contact made' },
      { name: 'QUALIFIED', description: 'Lead has been qualified' },
      { name: 'PROPOSAL', description: 'Proposal sent to lead' },
      { name: 'WON', description: 'Lead converted to customer' },
      { name: 'LOST', description: 'Lead was lost' },
    ];
    for (const s of statusDefs) {
      await prisma.leadStatus.upsert({ where: { name: s.name }, update: { description: s.description, is_active: true }, create: { name: s.name, description: s.description, is_active: true } });
    }

    // 4) Sources (upserts)
    logger.info('Creating sources...');
    const sourceDefs = [
      { name: 'WEBSITE', description: 'Lead from company website' },
      { name: 'SOCIAL_MEDIA', description: 'Lead from social media platforms' },
      { name: 'EMAIL_CAMPAIGN', description: 'Lead from email marketing campaign' },
      { name: 'REFERRAL', description: 'Lead from customer referral' },
      { name: 'TRADE_SHOW', description: 'Lead from trade show or event' },
      { name: 'COLD_CALL', description: 'Lead from cold calling' },
    ];
    for (const s of sourceDefs) {
      await prisma.source.upsert({ where: { name: s.name }, update: { description: s.description, is_active: true }, create: { name: s.name, description: s.description, is_active: true } });
    }

    // 5) Work Statuses (upserts)
    logger.info('Creating work statuses...');
    const workStatusDefs = [
      { name: 'To Do', description: 'Not started' },
      { name: 'In Progress', description: 'Work in progress' },
      { name: 'In Review', description: 'Pending review' },
      { name: 'Closed', description: 'Completed' },
      { name: 'Cancelled', description: 'Stopped / cancelled' },
    ];
    for (const ws of workStatusDefs) {
      await prisma.workStatus.upsert({ where: { name: ws.name }, update: { description: ws.description, is_active: true }, create: { name: ws.name, description: ws.description, is_active: true } });
    }

    // 6) Sample Users
    logger.info('Generating sample users...');
    const userRole = await prisma.role.findFirst({ where: { name: 'User' } });
    const managerRole = await prisma.role.findFirst({ where: { name: 'Manager' } });
    const sampleUsersCount = 10;
    for (let i = 0; i < sampleUsersCount; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(-1)[0] }).toLowerCase();
      const role_id = i % 3 === 0 && managerRole ? managerRole.id : (userRole ? userRole.id : adminRole.id);
      await prisma.user.upsert({
        where: { email },
        update: { name, role_id, is_active: true },
        create: { name, email, password: hashedPassword, role_id, is_active: true },
      });
    }

    const users = await prisma.user.findMany({ where: { is_active: true } });
    const statuses = await prisma.leadStatus.findMany({ where: { is_active: true } });
    const sources = await prisma.source.findMany({ where: { is_active: true } });

    // 7) Sample Leads (including converted)
    logger.info('Generating sample leads/customers...');
    const leadCount = 50;
    for (let i = 0; i < leadCount; i++) {
      const name = faker.company.name();
      const email = faker.internet.email().toLowerCase();
      const phone = faker.phone.number('+1##########');
      const status = faker.helpers.arrayElement(statuses);
      const source = faker.helpers.arrayElement(sources);
      const assigned = faker.helpers.arrayElement(users);
      const is_converted = faker.datatype.boolean({ probability: 0.35 });

      await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          status_id: status.id,
          source_id: source.id,
          assigned_to: assigned?.id,
          notes: faker.lorem.sentence(),
          is_converted,
          is_active: true,
          created_by: adminUser.id,
          updated_by: adminUser.id,
        },
      });
    }

    const leads = await prisma.lead.findMany({});

    // 8) Sample Work Items and Tasks
    logger.info('Generating sample work items and tasks...');
    const workStatuses = await prisma.workStatus.findMany({ where: { is_active: true } });
    for (const lead of leads) {
      const itemPerLead = faker.number.int({ min: 0, max: 3 });
      for (let i = 0; i < itemPerLead; i++) {
        const status = faker.helpers.arrayElement(workStatuses);
        const assignee = faker.helpers.arrayElement(users);
        const wi = await prisma.workItem.create({
          data: {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            customer_id: lead.id,
            assigned_to: assignee?.id,
            status_id: status?.id,
            created_by: adminUser.id,
            updated_by: adminUser.id,
          },
        });
        const taskCount = faker.number.int({ min: 0, max: 4 });
        for (let t = 0; t < taskCount; t++) {
          const tStatus = faker.helpers.arrayElement(workStatuses);
          const tAssignee = faker.helpers.arrayElement(users);
          await prisma.task.create({
            data: {
              title: faker.hacker.verb() + ' ' + faker.hacker.noun(),
              description: faker.lorem.sentence(),
              work_item_id: wi.id,
              customer_id: lead.id,
              assigned_to: tAssignee?.id,
              status_id: tStatus?.id,
              created_by: adminUser.id,
              updated_by: adminUser.id,
            },
          });
        }
      }
    }

    // 9) Sample Communications
    logger.info('Generating sample client communications...');
    for (const lead of leads) {
      const commCount = faker.number.int({ min: 0, max: 5 });
      for (let c = 0; c < commCount; c++) {
        await prisma.communication.create({
          data: {
            lead_id: lead.id,
            message: faker.lorem.sentences({ min: 1, max: 2 }),
            created_by: adminUser.id,
            updated_by: adminUser.id,
          },
        });
      }
    }

    // 10) Conditionally backfill audit fields
    const hasRoleAudit = (await columnExists('roles', 'created_by')) && (await columnExists('roles', 'updated_by'));
    const hasUserAudit = (await columnExists('users', 'created_by')) && (await columnExists('users', 'updated_by'));
    const hasLeadStatusAudit = (await columnExists('lead_statuses', 'created_by')) && (await columnExists('lead_statuses', 'updated_by'));
    const hasSourceAudit = (await columnExists('sources', 'created_by')) && (await columnExists('sources', 'updated_by'));
    const hasWorkStatusAudit = (await columnExists('work_statuses', 'created_by')) && (await columnExists('work_statuses', 'updated_by'));

    if (hasRoleAudit) await prisma.role.updateMany({ data: { created_by: adminUser.id, updated_by: adminUser.id } });
    if (hasUserAudit) await prisma.user.updateMany({ where: { id: adminUser.id }, data: { created_by: adminUser.id, updated_by: adminUser.id } });
    if (hasLeadStatusAudit) await prisma.leadStatus.updateMany({ data: { created_by: adminUser.id, updated_by: adminUser.id } });
    if (hasSourceAudit) await prisma.source.updateMany({ data: { created_by: adminUser.id, updated_by: adminUser.id } });
    if (hasWorkStatusAudit) await prisma.workStatus.updateMany({ data: { created_by: adminUser.id, updated_by: adminUser.id } });

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}; 