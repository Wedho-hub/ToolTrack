const express = require('express');
const router = express.Router();
const {
  getTools,
  getTool,
  createTool,
  updateTool,
  deleteTool,
  assignTool,
  returnTool,
  getMyTools
} = require('../controllers/toolController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes (authenticated users)
router.get('/', protect, getTools);
router.get('/my-tools', protect, getMyTools);
router.get('/:id', protect, getTool);

// Admin only routes
router.post('/', protect, authorize('admin'), createTool);
router.put('/:id', protect, authorize('admin'), updateTool);
router.delete('/:id', protect, authorize('admin'), deleteTool);

// Assignment routes
router.post('/:id/assign', protect, authorize('admin'), assignTool);
router.post('/:id/return', protect, returnTool);

module.exports = router;
