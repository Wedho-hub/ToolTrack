import Tool from '../models/Tool.js';
import User from '../models/User.js';

/**
 * @desc    Get all tools
 * @route   GET /api/tools
 * @access  Private
 */
const getTools = async (req, res) => {
  try {
    const tools = await Tool.find()
      .populate('assignedTo', 'name email')
      .populate('returnRequestedBy', 'name email');
    res.json({ success: true, tools });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tools' });
  }
};

/**
 * @desc    Get single tool by ID
 * @route   GET /api/tools/:id
 * @access  Private
 */
const getTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('returnRequestedBy', 'name email');
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    res.json({ success: true, tool });
  } catch (error) {
    console.error('Error fetching tool:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tool' });
  }
};

/**
 * @desc    Get tools assigned to current user
 * @route   GET /api/tools/my-tools
 * @access  Private
 */
const getMyTools = async (req, res) => {
  try {
    const tools = await Tool.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email');
    res.json({ success: true, tools });
  } catch (error) {
    console.error('Error fetching user tools:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch your tools' });
  }
};

/**
 * @desc    Create new tool
 * @route   POST /api/tools
 * @access  Private/Admin
 */
const createTool = async (req, res) => {
  try {
    const { name, description, category, quantity, location, condition, imageUrl } = req.body;
    const tool = new Tool({
      name,
      description,
      category,
      totalQuantity: quantity,
      availableQuantity: quantity,
      location,
      condition,
      imageUrl,
    });
    const savedTool = await tool.save();
    res.status(201).json({ success: true, tool: savedTool });
  } catch (error) {
    console.error('Error creating tool:', error);
    res.status(500).json({ success: false, message: 'Failed to create tool' });
  }
};

/**
 * @desc    Update tool
 * @route   PUT /api/tools/:id
 * @access  Private/Admin
 */
const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    res.json({ success: true, tool });
  } catch (error) {
    console.error('Error updating tool:', error);
    res.status(500).json({ success: false, message: 'Failed to update tool' });
  }
};

/**
 * @desc    Delete tool
 * @route   DELETE /api/tools/:id
 * @access  Private/Admin
 */
const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    res.json({ success: true, message: 'Tool removed successfully' });
  } catch (error) {
    console.error('Error deleting tool:', error);
    res.status(500).json({ success: false, message: 'Failed to delete tool' });
  }
};

/**
 * @desc    Assign tool to user
 * @route   POST /api/tools/:id/assign
 * @access  Private/Admin
 */
const assignTool = async (req, res) => {
  try {
    const { userId } = req.body;
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    if (tool.availableQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'No tools available for assignment' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    tool.assignedTo = userId;
    tool.availableQuantity -= 1;
    tool.status = 'in-use';
    // Clear any stale return request data
    tool.returnRequestedAt = null;
    tool.returnRequestedBy = null;

    const updatedTool = await tool.save();
    res.json({ success: true, tool: updatedTool, message: `Tool assigned to ${user.name}` });
  } catch (error) {
    console.error('Error assigning tool:', error);
    res.status(500).json({ success: false, message: 'Failed to assign tool' });
  }
};

/**
 * @desc    Worker requests a return — does NOT release the tool yet
 * @route   POST /api/tools/:id/request-return
 * @access  Private (assigned worker or admin)
 */
const requestReturn = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id).populate('assignedTo', 'name email');
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    if (!tool.assignedTo) {
      return res.status(400).json({ success: false, message: 'Tool is not currently assigned' });
    }
    if (tool.status === 'pending-return') {
      return res.status(400).json({ success: false, message: 'A return request is already pending for this tool' });
    }
    // Only the assigned worker or an admin can request a return
    const isAssignee = tool.assignedTo._id.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isAssignee && !isAdmin) {
      return res.status(403).json({ success: false, message: 'You can only request a return for tools assigned to you' });
    }

    tool.status = 'pending-return';
    tool.returnRequestedAt = new Date();
    tool.returnRequestedBy = req.user.id;

    const updatedTool = await tool.save();
    res.json({
      success: true,
      tool: updatedTool,
      message: 'Return request submitted. An admin will verify and confirm the return.',
    });
  } catch (error) {
    console.error('Error requesting return:', error);
    res.status(500).json({ success: false, message: 'Failed to submit return request' });
  }
};

/**
 * @desc    Admin confirms a return — releases the tool back to available
 * @route   POST /api/tools/:id/confirm-return
 * @access  Private/Admin
 */
const confirmReturn = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    if (tool.status !== 'pending-return') {
      return res.status(400).json({ success: false, message: 'No pending return request for this tool' });
    }

    tool.assignedTo = null;
    tool.availableQuantity = Math.min(tool.availableQuantity + 1, tool.totalQuantity);
    tool.status = 'available';
    tool.returnRequestedAt = null;
    tool.returnRequestedBy = null;

    const updatedTool = await tool.save();
    res.json({ success: true, tool: updatedTool, message: 'Return confirmed. Tool is now available.' });
  } catch (error) {
    console.error('Error confirming return:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm return' });
  }
};

/**
 * @desc    Admin rejects a return request — tool stays assigned to the worker
 * @route   POST /api/tools/:id/reject-return
 * @access  Private/Admin
 */
const rejectReturn = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id).populate('assignedTo', 'name email');
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    if (tool.status !== 'pending-return') {
      return res.status(400).json({ success: false, message: 'No pending return request for this tool' });
    }

    const { reason } = req.body;

    tool.status = 'in-use';
    tool.returnRequestedAt = null;
    tool.returnRequestedBy = null;

    const updatedTool = await tool.save();
    res.json({
      success: true,
      tool: updatedTool,
      message: `Return rejected${reason ? ': ' + reason : ''}. Tool remains assigned to ${tool.assignedTo?.name || 'worker'}.`,
    });
  } catch (error) {
    console.error('Error rejecting return:', error);
    res.status(500).json({ success: false, message: 'Failed to reject return' });
  }
};

export default {
  getTools,
  getTool,
  getMyTools,
  createTool,
  updateTool,
  deleteTool,
  assignTool,
  requestReturn,
  confirmReturn,
  rejectReturn,
};
