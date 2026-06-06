import express from 'express';
const router = express.Router();
import toolController from '../controllers/toolController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Authenticated user routes
router.get('/', authMiddleware.protect, toolController.getTools);
router.get('/my-tools', authMiddleware.protect, toolController.getMyTools);
router.get('/:id', authMiddleware.protect, toolController.getTool);

// Admin-only CRUD
router.post('/', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.createTool);
router.put('/:id', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.updateTool);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.deleteTool);

// Assignment
router.post('/:id/assign', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.assignTool);

// Two-step return workflow
router.post('/:id/request-return', authMiddleware.protect, toolController.requestReturn);
router.post('/:id/confirm-return', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.confirmReturn);
router.post('/:id/reject-return', authMiddleware.protect, authMiddleware.authorize('admin'), toolController.rejectReturn);

export default router;
