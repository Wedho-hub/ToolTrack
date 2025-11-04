import express from 'express';
const router = express.Router();
import toolController from '../controllers/toolController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Public routes (authenticated users)
router.get('/', authMiddleware.protect, toolController.getTools);
router.get('/my-tools', authMiddleware.protect, toolController.getMyTools);
router.get('/:id', authMiddleware.protect, toolController.getTool);

// Admin only routes
router.post('/', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.createTool);
router.put('/:id', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.updateTool);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.deleteTool);

// Assignment routes
router.post('/:id/assign', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.assignTool);
router.post('/:id/return', authMiddleware.protect, toolController.returnTool);

export default router;
