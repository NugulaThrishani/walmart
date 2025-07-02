const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  greenPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  carbonSavings: {
    type: Number,
    default: 0,
    min: 0
  },
  orderHistory: [{
    orderId: {
      type: String,
      required: true
    },
    productName: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    },
    orderDate: Date,
    deliveryDate: Date,
    greenPoints: {
      type: Number,
      default: 0
    },
    carbonSaved: {
      type: Number,
      default: 0
    }
  }],
  achievements: [{
    name: String,
    description: String,
    dateEarned: Date,
    icon: String
  }],
  preferences: {
    sustainableProducts: {
      type: Boolean,
      default: false
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  loyaltyTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  }
}, {
  timestamps: true
});

// Indexes
customerSchema.index({ userId: 1 });
customerSchema.index({ greenPoints: -1 });
customerSchema.index({ loyaltyTier: 1 });

// Virtual for trees planted calculation
customerSchema.virtual('treesPlanted').get(function() {
  return Math.floor(this.carbonSavings / 15); // 15kg CO2 = 1 tree
});

module.exports = mongoose.model('Customer', customerSchema);