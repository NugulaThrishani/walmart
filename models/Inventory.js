const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  sensorStatus: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  minStockLevel: {
    type: Number,
    default: 10
  },
  maxStockLevel: {
    type: Number,
    default: 1000
  },
  category: {
    type: String,
    trim: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
inventorySchema.index({ sku: 1 });
inventorySchema.index({ location: 1 });
inventorySchema.index({ quantity: 1 });
inventorySchema.index({ category: 1 });

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.quantity <= 0) return 'Out of Stock';
  if (this.quantity <= this.minStockLevel) return 'Low Stock';
  if (this.quantity >= this.maxStockLevel) return 'Overstock';
  return 'In Stock';
});

module.exports = mongoose.model('Inventory', inventorySchema);