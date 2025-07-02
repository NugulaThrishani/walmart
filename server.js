const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'walmart_supply_chain_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/walmart_supply_chain';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import Models
const User = require('./models/User');
const Inventory = require('./models/Inventory');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
const Logistics = require('./models/Logistics');

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer'
    });

    await user.save();

    // Create customer profile if role is customer
    if (user.role === 'customer') {
      const customer = new Customer({
        userId: user._id,
        greenPoints: 0,
        carbonSavings: 0,
        orderHistory: []
      });
      await customer.save();
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Routes
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalUsers = await User.countDocuments();
    const totalInventory = await Inventory.countDocuments();
    const activeSuppliers = await Supplier.countDocuments({ status: 'active' });
    const lowStockItems = await Inventory.countDocuments({ quantity: { $lt: 10 } });

    res.json({
      totalUsers,
      totalInventory,
      activeSuppliers,
      lowStockItems,
      systemAlerts: lowStockItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/admin/alerts', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const lowStockItems = await Inventory.find({ quantity: { $lt: 10 } });
    const alerts = lowStockItems.map(item => ({
      type: 'Inventory Alert',
      message: `${item.productName} is running low (${item.quantity} units remaining)`,
      severity: item.quantity < 5 ? 'high' : 'medium',
      timestamp: new Date()
    }));

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Inventory Routes
app.get('/api/inventory', authenticateToken, async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/inventory', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Supplier Routes
app.get('/api/suppliers', authenticateToken, async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// AI Prediction Routes
app.get('/api/ai/predictions', authenticateToken, async (req, res) => {
  try {
    // Mock AI predictions - in production, this would call actual AI models
    const predictions = {
      demandForecast: 'Electronics demand expected to increase 15% next week based on historical data',
      riskScore: Math.floor(Math.random() * 10) + 1,
      alertType: 'Weather disruption may affect southern distribution centers',
      accuracy: 94.2,
      lastUpdated: new Date()
    };

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/ai/scenario', authenticateToken, async (req, res) => {
  try {
    const { scenario } = req.body;
    
    // Mock scenario planning response
    const response = {
      scenario,
      actionPlan: [
        'Activate backup suppliers in the region',
        'Reroute shipments through alternative distribution centers',
        'Increase safety stock for critical items',
        'Notify customers of potential delays'
      ],
      estimatedImpact: 'Minimal disruption expected with 2-day delay',
      confidence: 87.5
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Customer Routes
app.get('/api/customer/green-impact/:userId', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.params.userId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    res.json({
      greenPoints: customer.greenPoints,
      carbonSavings: customer.carbonSavings,
      treesPlanted: Math.floor(customer.carbonSavings / 15), // 15kg CO2 = 1 tree
      ecoAchievements: customer.achievements || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/customer/orders/:userId', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.params.userId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    res.json(customer.orderHistory || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// IoT and Logistics Routes
app.get('/api/logistics/iot-data', authenticateToken, async (req, res) => {
  try {
    const logistics = await Logistics.find().sort({ lastUpdate: -1 });
    res.json(logistics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Blockchain Routes
app.get('/api/blockchain/status', authenticateToken, async (req, res) => {
  try {
    // Mock blockchain data
    const blockchainData = {
      status: 'Active',
      lastBlock: '0x1a2b3c4d5e6f7890',
      transactionCount: 1247,
      networkHealth: 'Excellent',
      lastUpdate: new Date()
    };

    res.json(blockchainData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Federated Learning Routes
app.get('/api/federated/status', authenticateToken, async (req, res) => {
  try {
    // Mock federated learning data
    const federatedData = {
      globalModelAccuracy: 94.2,
      localModelAccuracy: 91.8,
      trainingRounds: 15,
      participants: 8,
      lastUpdate: new Date(),
      nextTrainingRound: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };

    res.json(federatedData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Voice Assistant Routes
app.post('/api/voice/query', authenticateToken, async (req, res) => {
  try {
    const { query, userRole } = req.body;
    const lowerQuery = query.toLowerCase();

    let response = '';

    if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      const lowStockCount = await Inventory.countDocuments({ quantity: { $lt: 10 } });
      response = `There are ${lowStockCount} items with low stock. Electronics section has good inventory levels.`;
    } else if (lowerQuery.includes('locate') || lowerQuery.includes('find')) {
      response = 'Item located in Section A1, Aisle 3. Follow the AR navigation path on your device.';
    } else if (lowerQuery.includes('maintenance')) {
      response = 'Next maintenance scheduled for Truck #1247 in 2 days. All other equipment operating normally.';
    } else if (lowerQuery.includes('green') || lowerQuery.includes('carbon')) {
      if (userRole === 'customer') {
        const customer = await Customer.findOne({ userId: req.user.id });
        const savings = customer ? customer.carbonSavings : 0;
        const points = customer ? customer.greenPoints : 0;
        response = `You have saved ${savings}kg of CO2 and earned ${points} green points this month.`;
      } else {
        response = 'Total customer carbon savings this month: 15,240kg CO2 equivalent to 1,016 trees planted.';
      }
    } else {
      response = 'I can help you with inventory checks, item locations, maintenance schedules, and green impact tracking. What would you like to know?';
    }

    res.json({ response, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize sample data
const initializeSampleData = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@walmart.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin User',
        email: 'admin@walmart.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Check if employee user exists
    const employeeExists = await User.findOne({ email: 'employee@walmart.com' });
    if (!employeeExists) {
      const hashedPassword = await bcrypt.hash('emp123', 10);
      const employee = new User({
        name: 'Employee User',
        email: 'employee@walmart.com',
        password: hashedPassword,
        role: 'employee'
      });
      await employee.save();
      console.log('✅ Employee user created');
    }

    // Check if customer user exists
    const customerExists = await User.findOne({ email: 'customer@walmart.com' });
    if (!customerExists) {
      const hashedPassword = await bcrypt.hash('cust123', 10);
      const customer = new User({
        name: 'Customer User',
        email: 'customer@walmart.com',
        password: hashedPassword,
        role: 'customer'
      });
      await customer.save();

      // Create customer profile
      const customerProfile = new Customer({
        userId: customer._id,
        greenPoints: 2340,
        carbonSavings: 125,
        orderHistory: [
          {
            orderId: 'ORD001',
            productName: 'Organic Banana Bundle',
            amount: 12.99,
            status: 'Delivered',
            orderDate: new Date('2024-01-15'),
            greenPoints: 25,
            carbonSaved: 2.3
          }
        ]
      });
      await customerProfile.save();
      console.log('✅ Customer user and profile created');
    }

    // Initialize sample inventory
    const inventoryCount = await Inventory.countDocuments();
    if (inventoryCount === 0) {
      const sampleInventory = [
        {
          sku: 'WM001',
          productName: 'iPhone 15',
          quantity: 45,
          location: 'A1',
          expiryDate: new Date('2025-12-31'),
          sensorStatus: 'active'
        },
        {
          sku: 'WM002',
          productName: 'Samsung TV',
          quantity: 3,
          location: 'B2',
          expiryDate: new Date('2025-12-31'),
          sensorStatus: 'active'
        }
      ];

      await Inventory.insertMany(sampleInventory);
      console.log('✅ Sample inventory created');
    }

  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  initializeSampleData();
});

module.exports = app;