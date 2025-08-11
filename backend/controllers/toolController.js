const Tool = require('../models/Tool');
const User = require('../models/User');

/**
 * @desc    Get all tools
 * @route   GET /api/tools
 * @access  Private
 */
const getTools = async (req, res) => {
  try {
    const tools = await Tool.find().populate('assignedTo', 'name email');
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
    const tool = await Tool.findById(req.params.id).populate('assignedTo', 'name email');
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
    const tools = await Tool.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email');
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
    
    // Create tool with specified quantity
    const toolData = {
      name,
      description,
      category,
      totalQuantity: quantity,
      availableQuantity: quantity,
      location,
      condition,
      imageUrl
    };
    
    const tool = new Tool(toolData);
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
    
    // Find the tool
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    
    // Check if tool is available
    if (tool.availableQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'No tools available for assignment' });
    }
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update tool assignment
    tool.assignedTo = userId;
    tool.availableQuantity -= 1;
    tool.status = 'in-use';
    
    const updatedTool = await tool.save();
    
    res.json({ 
      success: true, 
      tool: updatedTool, 
      message: `Tool assigned to ${user.name}` 
    });
  } catch (error) {
    console.error('Error assigning tool:', error);
    res.status(500).json({ success: false, message: 'Failed to assign tool' });
  }
};

/**
 * @desc    Return tool from user
 * @route   POST /api/tools/:id/return
 * @access  Private
 */
const returnTool = async (req, res) => {
  try {
    // Find the tool
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    
    // Check if tool is assigned
    if (!tool.assignedTo) {
      return res.status(400).json({ success: false, message: 'Tool is not assigned' });
    }
    
    // Update tool status
    tool.assignedTo = null;
    tool.availableQuantity += 1;
    tool.status = 'available';
    
    const updatedTool = await tool.save();
    
    res.json({ 
      success: true, 
      tool: updatedTool, 
      message: 'Tool returned successfully' 
    });
  } catch (error) {
    console.error('Error returning tool:', error);
    res.status(500).json({ success: false, message: 'Failed to return tool' });
  }
};

module.exports = {
  getTools,
  getTool,
  getMyTools,
  createTool,
  updateTool,
  deleteTool,
  assignTool,
  returnTool
};
