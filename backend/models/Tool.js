const mongoose = require('mongoose')

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['Hand Tools', 'Power Tools', 'Measuring Tools', 'Safety Equipment', 'Other'], default: 'Other' },
  totalQuantity: { type: Number, default: 1 },
  availableQuantity: { type: Number, default: 1 },
  location: String,
  condition: { type: String, enum: ['new', 'good', 'fair', 'poor', 'damaged'], default: 'good' },
  imageUrl: String,
  status: { type: String, enum: ['available', 'in-use', 'damaged'], default: 'available' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true })

module.exports = mongoose.model('Tool', toolSchema)
