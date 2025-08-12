import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadsByStatus,
  convertLead
} from '../services/leadService';

export const leadController = {
  // Get all leads
  getAll: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const isConvertedParam = req.query.is_converted as string | undefined;
    const filters = typeof isConvertedParam !== 'undefined' ? { is_converted: isConvertedParam === 'true' } : undefined;
    const leads = await getAllLeads(filters as any);
    res.status(200).json({ success: true, data: leads, count: leads.length });
  }),

  // Get lead by ID
  getById: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const lead = await getLeadById(parseInt(id));

    res.status(200).json({
      success: true,
      data: lead
    });
  }),

  // Create lead
  create: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUser = req.user!;
    
    // Convert string fields to appropriate types
    const leadData = {
      ...req.body,
      status_id: req.body.status_id ? parseInt(req.body.status_id) : undefined,
      source_id: req.body.source_id ? parseInt(req.body.source_id) : undefined,
      assigned_to: req.body.assigned_to ? parseInt(req.body.assigned_to) : undefined,
    };

    const lead = await createLead(
      leadData,
      parseInt(currentUser.id)
    );

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully'
    });
  }),

  // Update lead
  update: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user!;

    // Convert string fields to appropriate types
    const updateData = {
      ...req.body,
      status_id: req.body.status_id ? parseInt(req.body.status_id) : undefined,
      source_id: req.body.source_id ? parseInt(req.body.source_id) : undefined,
      assigned_to: req.body.assigned_to ? parseInt(req.body.assigned_to) : undefined,
    };

    const lead = await updateLead(
      parseInt(id),
      updateData,
      parseInt(currentUser.id)
    );

    res.status(200).json({
      success: true,
      data: lead,
      message: 'Lead updated successfully'
    });
  }),

  // Delete lead (soft delete)
  delete: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user!;
    await deleteLead(parseInt(id), parseInt(currentUser.id));
    res.status(200).json({ success: true, message: 'Lead deleted successfully (soft delete)' });
  }),

  // Get leads by status
  getByStatus: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { statusId } = req.params;

    const leads = await getLeadsByStatus(parseInt(statusId));

    res.status(200).json({
      success: true,
      data: leads,
      count: leads.length
    });
  }),

  // Convert lead to customer
  convert: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user!;

    await convertLead(parseInt(id), parseInt(currentUser.id));

    res.status(200).json({
      success: true,
      message: 'Lead converted to customer successfully'
    });
  }),
}; 