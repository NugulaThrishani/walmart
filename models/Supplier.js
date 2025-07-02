const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  blockchainTxId: {
    type: String,
    trim: true
  },
  orders: [{
    orderId: String,
    orderDate: Date,
    deliveryDate: Date,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    },
    amount: Number,
    items: [{
      sku: String,
      quantity: Number,
      unitPrice: Number
    }]
  }],
  performance: {
    onTimeDelivery: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    qualityRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5
    },
    totalOrders: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
supplierSchema.index({ supplierId: 1 });
supplierSchema.index({ status: 1 });
supplierSchema.index({ riskScore: 1 });

module.exports = mongoose.model('Supplier', supplierSchema);