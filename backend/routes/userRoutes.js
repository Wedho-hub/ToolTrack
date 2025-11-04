import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Admin only routes
router.get('/', authMiddleware.protect, authMiddleware.authorize('admin'), userController.getUsers);
router.get('/:id', authMiddleware.protect, authMiddleware.authorize('admin'), userController.getUserById);
router.put('/:id', authMiddleware.protect, authMiddleware.authorize('admin'), userController.updateUser);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize('admin'), userController.deleteUser);

export default router;
