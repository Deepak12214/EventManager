// server/routes/eventRoutes.js

import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createEvent,
  getAllEvents,
  getEventById,
  registerForEvent,
  getRegisteredUsersForEvent,
  getUserRegistrations,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';

const router = express.Router();
router.post('/', protect, createEvent);
router.get('/', protect, getAllEvents);
router.get('/:id', protect, getEventById);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.get('/:id/users', protect, getRegisteredUsersForEvent);
router.get('/my/registrations', protect, getUserRegistrations);

export default router;
