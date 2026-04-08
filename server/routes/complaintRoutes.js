import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import {
    createComplaint,
    getAllComplaints,
    getMyComplaints,
    updateComplaintStatus
} from '../controllers/complaintController.js';

const router = express.Router();

// Submit a new complaint
router.post('/submit', protectRoute, createComplaint);

// Get all complaints (for admin/staff)
router.get('/all', protectRoute, getAllComplaints);

// Get complaints of the logged-in user
router.get('/my', protectRoute, getMyComplaints);

// Update complaint status by ID
router.patch('/:id/status', protectRoute, updateComplaintStatus);

export default router;