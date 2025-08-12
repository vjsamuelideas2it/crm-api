import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    id: number;
    name: string;
    email: string;
    role: {
      id: number;
      name: string;
    };
    created_at: Date;
  };
  token: string;
}

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Generate JWT token
 */
const generateToken = (payload: { userId: string; email: string; role: string }): string => {
  const secret = JWT_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

/**
 * Get admin user ID for audit fields
 */
const getAdminUserId = async (): Promise<number> => {
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@system.com' }
  });
  return adminUser?.id || 1;
};

/**
 * Verify user exists by email
 */
const checkUserExists = async (email: string): Promise<boolean> => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  return !!existingUser;
};

/**
 * Validate role exists and is active
 */
const validateRole = async (roleId: number) => {
  const role = await prisma.role.findUnique({
    where: { id: roleId }
  });

  if (!role) {
    throw new Error('Invalid role ID');
  }

  if (!role.is_active) {
    throw new Error('Selected role is not active');
  }

  return role;
};

/**
 * Find user with role by email
 */
const findUserWithRole = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        select: {
          id: true,
          name: true,
          is_active: true
        }
      }
    }
  });
};

/**
 * Validate user credentials and status
 */
const validateUser = async (user: any, password: string) => {
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.is_active) {
    throw new Error('User account is not active');
  }

  if (!user.role.is_active) {
    throw new Error('User role is not active');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return true;
};

/**
 * Create new user in database
 */
const createUser = async (userData: SignupData, hashedPassword: string, adminUserId: number) => {
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role_id: userData.role_id,
      is_active: true,
      created_by: adminUserId,
      updated_by: adminUserId
    },
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

/**
 * Format user response
 */
const formatUserResponse = (user: any): AuthResult['user'] => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at
});

/**
 * Register a new user
 */
export const signup = async (data: SignupData): Promise<AuthResult> => {
  const { name, email, password, role_id } = data;

  // Check if user already exists
  const userExists = await checkUserExists(email);
  if (userExists) {
    const error = new Error('User with this email already exists');
    (error as any).statusCode = 409;
    throw error;
  }

  // Verify role exists and is active
  await validateRole(role_id);

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Get admin user for audit fields
  const adminUserId = await getAdminUserId();

  // Create user
  const user = await createUser(data, hashedPassword, adminUserId);

  // Generate JWT token
  const token = generateToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role.name
  });

  logger.info(`New user registered: ${user.email}`);

  return {
    user: formatUserResponse(user),
    token
  };
};

/**
 * Authenticate user login
 */
export const login = async (data: LoginData): Promise<AuthResult> => {
  const { email, password } = data;

  if (!email || !password) {
    const error = new Error('Email and password are required');
    (error as any).statusCode = 400;
    throw error;
  }

  // Find user with role
  const user = await findUserWithRole(email);

  // Validate user and credentials
  await validateUser(user, password);

  // Generate JWT token
  const token = generateToken({
    userId: user!.id.toString(),
    email: user!.email,
    role: user!.role.name
  });

  logger.info(`User logged in: ${user!.email}`);

  return {
    user: formatUserResponse(user),
    token
  };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
}; 