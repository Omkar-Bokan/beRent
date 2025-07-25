import express from 'express';
import { getAllLeads, createLead, getLeadById, updateLead, deleteLead, updateLeadStatus } from '../controllers/Leads';

const router = express.Router();

router.route('/')
    .get(getAllLeads) // GET /api/leads - Get all leads
    .post(createLead); // POST /api/leads - Create a new lead

router.route('/:id')
    .get(getLeadById) // GET /api/leads/:id - Get a single lead by ID
    .put(updateLead) // PUT /api/leads/:id - Update an existing lead (full replacement)
    .delete(deleteLead); // DELETE /api/leads/:id - Delete a lead by ID

router.patch('/:id/status', updateLeadStatus);

export default router;