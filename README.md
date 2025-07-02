# Walmart Supply Chain Optimization Platform

A comprehensive full-stack application built with React, Node.js, Express, and MongoDB that implements advanced supply chain management features including AI predictions, AR simulation, IoT monitoring, blockchain tracking, and sustainability gamification.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with role-based access control
- Three user roles: Admin, Employee, Customer
- Secure password hashing with bcrypt

### Admin Dashboard
- System overview with real-time statistics
- User management and system alerts
- AI prediction monitoring
- Blockchain transaction tracking

### Employee Dashboard
- Inventory management with real-time updates
- IoT equipment monitoring
- Predictive maintenance alerts
- AR warehouse simulation access

### Customer Dashboard
- Green impact tracking with carbon savings
- Gamified sustainability points system
- Order history with environmental impact
- Achievement system for eco-friendly purchases

### Advanced Features
- **AI-Powered Predictions**: Demand forecasting and risk assessment
- **AR Warehouse Simulation**: Interactive 3D warehouse visualization
- **IoT Monitoring**: Real-time equipment status and predictive maintenance
- **Blockchain Integration**: Supplier tracking and transaction verification
- **Voice Assistant**: Web Speech API for hands-free queries
- **Federated Learning**: Distributed AI model training simulation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Web Speech API** for voice features

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd walmart-supply-chain-platform
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/walmart_supply_chain
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB installation
mongod

# Or use MongoDB Atlas cloud connection
```

### 4. Run the Application

#### Option 1: Run Frontend and Backend Separately
```bash
# Terminal 1 - Start Backend Server
npm run server

# Terminal 2 - Start Frontend Development Server
npm run dev
```

#### Option 2: Run Both Concurrently
```bash
npm run dev:full
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👥 Demo Accounts

The application comes with pre-configured demo accounts:

### Admin Account
- **Email**: admin@walmart.com
- **Password**: admin123
- **Access**: Full system administration, analytics, user management

### Employee Account
- **Email**: employee@walmart.com
- **Password**: emp123
- **Access**: Inventory management, IoT monitoring, AR simulation

### Customer Account
- **Email**: customer@walmart.com
- **Password**: cust123
- **Access**: Green impact tracking, order history, sustainability features

## 🗄 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'employee', 'customer'],
  isActive: Boolean,
  lastLogin: Date
}
```

### Inventory Model
```javascript
{
  sku: String (unique),
  productName: String,
  quantity: Number,
  location: String,
  expiryDate: Date,
  sensorStatus: ['active', 'inactive', 'maintenance'],
  minStockLevel: Number,
  maxStockLevel: Number
}
```

### Customer Model
```javascript
{
  userId: ObjectId (ref: User),
  greenPoints: Number,
  carbonSavings: Number,
  orderHistory: Array,
  achievements: Array,
  loyaltyTier: ['bronze', 'silver', 'gold', 'platinum']
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Admin Routes
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/alerts` - System alerts

### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new inventory item

### AI & Analytics
- `GET /api/ai/predictions` - Get AI predictions
- `POST /api/ai/scenario` - Scenario planning

### Customer Features
- `GET /api/customer/green-impact/:userId` - Green impact data
- `GET /api/customer/orders/:userId` - Order history

### IoT & Logistics
- `GET /api/logistics/iot-data` - IoT sensor data

### Voice Assistant
- `POST /api/voice/query` - Process voice queries

## 🌱 Sustainability Features

### Green Impact Tracking
- Carbon footprint calculation for each purchase
- Tree planting equivalency (15kg CO₂ = 1 tree)
- Sustainability achievement system

### Gamification Elements
- Green Points reward system
- Loyalty tier progression
- Environmental impact visualization

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment
- Set up MongoDB Atlas for production database
- Configure environment variables on your hosting platform
- Deploy to services like Heroku, Railway, or DigitalOcean

## 🧪 Testing

The application includes comprehensive mock data and APIs for testing:
- Sample inventory items with various stock levels
- Mock IoT sensor data
- Simulated AI predictions
- Blockchain transaction simulation

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎯 Future Enhancements

- Real AI model integration
- Actual blockchain implementation
- Advanced AR features with WebXR
- Real-time IoT sensor integration
- Machine learning model training
- Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Built with ❤️ for Walmart Sparkathon 2024**