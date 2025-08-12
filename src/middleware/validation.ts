import { Request, Response, NextFunction } from 'express';
import { validateEmail, validateRequired, validateLength } from '../utils/validation';

export const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password, role_id } = req.body;

  if (!validateRequired(email) || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Valid email is required'
    });
  }

  if (!validateRequired(name)) {
    return res.status(400).json({
      success: false,
      error: 'Name is required'
    });
  }

  // For signup route, password is required
  if (req.path === '/signup' && (!validateRequired(password) || !validateLength(password, 6))) {
    return res.status(400).json({
      success: false,
      error: 'Password is required and must be at least 6 characters long'
    });
  }

  // For admin user creation (non-signup): allow plain password OR password_hash
  if (req.method === 'POST' && req.path !== '/signup') {
    const hasPassword = validateRequired(password) && validateLength(password, 6);
    const hasHash = validateRequired((req.body as any).password_hash);
    if (!hasPassword && !hasHash) {
      return res.status(400).json({
        success: false,
        error: 'Password is required and must be at least 6 characters long'
      });
    }
  }

  if (!validateRequired(role_id)) {
    return res.status(400).json({
      success: false,
      error: 'Role ID is required'
    });
  }

  next();
};

export const validateLeadInput = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, status_id, created_by } = req.body;

  if (!validateRequired(name)) {
    return res.status(400).json({
      success: false,
      error: 'Name is required'
    });
  }

  if (!validateRequired(email) || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Valid email is required'
    });
  }

  if (!validateRequired(status_id)) {
    return res.status(400).json({
      success: false,
      error: 'Status ID is required'
    });
  }

  if (req.method === 'POST' && !validateRequired(created_by)) {
    return res.status(400).json({
      success: false,
      error: 'Created by user ID is required'
    });
  }

  next();
};

export const validateCustomerInput = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, created_by } = req.body;

  if (!validateRequired(name)) {
    return res.status(400).json({
      success: false,
      error: 'Name is required'
    });
  }

  if (!validateRequired(email) || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Valid email is required'
    });
  }

  if (req.method === 'POST' && !validateRequired(created_by)) {
    return res.status(400).json({
      success: false,
      error: 'Created by user ID is required'
    });
  }

  next();
}; 