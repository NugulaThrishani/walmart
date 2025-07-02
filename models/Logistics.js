const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  deviceType: {
    type: String,
    enum: ['truck', 'forklift', 'conveyor', 'freezer', 'scanner'],
    required: true
  },
  deviceName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['operational', 'warning', 'critical', 'maintenance'],
    default: 'operational'
  },
  sensorData: {
    temperature: {
      type: Number,
      default: 20
    },
    humidity: {
      type: Number,
      default: 50
    },
    vibration: {
      type: Number,
      default: 0
    },
    fuelLevel: {
      type: Number,
      min: 0,
      max: 100
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  maintenanceSchedule: {
    lastMaintenance: Date,
    nextMaintenance: Date,
    maintenanceType: String
  },
  failureRisk: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  route: {
    startLocation: String,
    endLocation: String,
    currentLocation: String,
    estimatedArrival: Date
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
logisticsSchema.index({ deviceId: 1 });
logisticsSchema.index({ deviceType: 1 });
logisticsSchema.index({ status: 1 });
logisticsSchema.index({ failureRisk: -1 });

module.exports = mongoose.model('Logistics', logisticsSchema);