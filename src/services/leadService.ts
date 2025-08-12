import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

export interface CreateLeadData {
  name: string;
  email?: string;
  phone?: string;
  status_id: number;
  source_id: number;
  assigned_to?: number;
  notes?: string;
  is_converted?: boolean;
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  phone?: string;
  status_id?: number;
  source_id?: number;
  assigned_to?: number;
  notes?: string;
  is_converted?: boolean;
}

export interface LeadResponse {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status_id: number;
  source_id: number;
  assigned_to?: number;
  notes?: string;
  is_converted: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  status?: any;
  source?: any;
  assigned_user?: any;
  created_user?: any;
  updated_user?: any;
}

/**
 * Validation helper functions
 */

/**
 * Check for duplicate email
 */
const checkDuplicateEmail = async (email: string, excludeLeadId?: number): Promise<boolean> => {
  if (!email) return false;
  
  const existingLead = await prisma.lead.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      id: excludeLeadId ? { not: excludeLeadId } : undefined
    }
  });
  
  return !!existingLead;
};

/**
 * Check for duplicate phone
 */
const checkDuplicatePhone = async (phone: string, excludeLeadId?: number): Promise<boolean> => {
  if (!phone) return false;
  
  // Normalize phone number by removing all non-numeric characters except +
  const normalizedPhone = phone.replace(/[^\d+]/g, '');
  
  // If phone is too short after normalization, skip check
  if (normalizedPhone.length < 7) return false;
  
  // Extract just the digits for comparison
  const digitsOnly = normalizedPhone.replace(/[^0-9]/g, '');
  
  const existingLead = await prisma.lead.findFirst({
    where: {
      AND: [
        {
          phone: {
            not: null
          }
        },
        {
          OR: [
            // Exact match with normalized phone
            { phone: normalizedPhone },
            // Match by digits only (handles different formatting)
            { phone: { contains: digitsOnly } }
          ]
        }
      ],
      id: excludeLeadId ? { not: excludeLeadId } : undefined
    }
  });
  
  return !!existingLead;
};

/**
 * Validate lead data for duplicates
 */
const validateLeadDuplicates = async (
  leadData: CreateLeadData | UpdateLeadData, 
  excludeLeadId?: number
): Promise<void> => {
  const errors: string[] = [];

  // Check for duplicate email
  if (leadData.email) {
    const emailExists = await checkDuplicateEmail(leadData.email, excludeLeadId);
    if (emailExists) {
      errors.push(`Email "${leadData.email}" is already associated with another lead`);
    }
  }

  // Check for duplicate phone
  if (leadData.phone) {
    const phoneExists = await checkDuplicatePhone(leadData.phone, excludeLeadId);
    if (phoneExists) {
      errors.push(`Phone number "${leadData.phone}" is already associated with another lead`);
    }
  }

  // Throw error if duplicates found
  if (errors.length > 0) {
    const error = new Error(errors.join('; '));
    (error as any).statusCode = 409; // Conflict
    throw error;
  }
};

/**
 * Include options for lead queries
 */
const getLeadIncludes = () => ({
  status: true,
  source: true,
  assigned_user: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  created_user: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  updated_user: {
    select: {
      id: true,
      name: true,
      email: true
    }
  }
});

/**
 * Format lead response
 */
const formatLeadResponse = (lead: any): LeadResponse => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  status_id: lead.status_id,
  source_id: lead.source_id,
  assigned_to: lead.assigned_to,
  notes: lead.notes,
  is_converted: lead.is_converted,
  is_active: lead.is_active,
  created_at: lead.created_at,
  updated_at: lead.updated_at,
  status: lead.status,
  source: lead.source,
  assigned_user: lead.assigned_user,
  created_user: lead.created_user,
  updated_user: lead.updated_user
});

/**
 * Get all leads (active by default)
 */
export const getAllLeads = async (filters?: { is_converted?: boolean }): Promise<LeadResponse[]> => {
  const where: any = { is_active: true };
  if (typeof filters?.is_converted === 'boolean') {
    where.is_converted = filters.is_converted;
  }
  const leads = await prisma.lead.findMany({
    where,
    include: getLeadIncludes(),
    orderBy: { created_at: 'desc' }
  });
  return leads.map(formatLeadResponse);
};

/**
 * Get lead by ID (only active)
 */
export const getLeadById = async (leadId: number): Promise<LeadResponse> => {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, is_active: true },
    include: getLeadIncludes()
  });
  if (!lead) {
    const error = new Error('Lead not found');
    (error as any).statusCode = 404;
    throw error;
  }
  return formatLeadResponse(lead);
};

/**
 * Create new lead
 */
export const createLead = async (
  leadData: CreateLeadData,
  createdByUserId: number
): Promise<LeadResponse> => {
  await validateLeadDuplicates(leadData);
  const lead = await prisma.lead.create({
    data: {
      ...leadData,
      created_by: createdByUserId,
      updated_by: createdByUserId
    },
    include: getLeadIncludes()
  });
  logger.info(`Lead created: ${lead.name} (${lead.email}) by user ${createdByUserId}`);
  return formatLeadResponse(lead);
};

/**
 * Update lead
 */
export const updateLead = async (
  leadId: number,
  updateData: UpdateLeadData,
  updatedByUserId: number
): Promise<LeadResponse> => {
  await validateLeadDuplicates(updateData, leadId);
  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: { ...updateData, updated_by: updatedByUserId },
    include: getLeadIncludes()
  });
  logger.info(`Lead updated: ${lead.name} (${lead.email}) by user ${updatedByUserId}`);
  return formatLeadResponse(lead);
};

/**
 * Soft delete lead (set is_active=false)
 */
export const deleteLead = async (
  leadId: number,
  deletedByUserId: number
): Promise<void> => {
  await prisma.lead.update({
    where: { id: leadId },
    data: { is_active: false, updated_by: deletedByUserId }
  });
  logger.info(`Lead soft-deleted: ${leadId} by user ${deletedByUserId}`);
};

/**
 * Get leads by status (active only)
 */
export const getLeadsByStatus = async (statusId: number): Promise<LeadResponse[]> => {
  const leads = await prisma.lead.findMany({
    where: { status_id: statusId, is_active: true },
    include: getLeadIncludes(),
    orderBy: { created_at: 'desc' }
  });
  return leads.map(formatLeadResponse);
};

/**
 * Convert lead (set is_converted=true)
 */
export const convertLead = async (
  leadId: number,
  userId: number
): Promise<void> => {
  const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { id: true, is_converted: true } });
  if (!lead) {
    const error = new Error('Lead not found');
    (error as any).statusCode = 404;
    throw error;
  }
  if (lead.is_converted) {
    const error = new Error('Lead is already converted');
    (error as any).statusCode = 400;
    throw error;
  }
  await prisma.lead.update({
    where: { id: leadId },
    data: { is_converted: true, updated_by: userId }
  });
  logger.info(`Lead ${leadId} marked as converted by user ${userId}`);
}; 