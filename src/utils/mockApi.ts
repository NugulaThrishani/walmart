// Mock API for simulating backend functionality
class MockAPI {
  private users: any[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@walmart.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Employee User',
      email: 'employee@walmart.com',
      password: 'emp123',
      role: 'employee'
    },
    {
      id: '3',
      name: 'Customer User',
      email: 'customer@walmart.com',
      password: 'cust123',
      role: 'customer'
    }
  ];

  private inventory = [
    { sku: 'WM001', product: 'iPhone 15', quantity: 45, status: 'In Stock', location: 'A1' },
    { sku: 'WM002', product: 'Samsung TV', quantity: 12, status: 'Low Stock', location: 'B2' },
    { sku: 'WM003', product: 'Nike Shoes', quantity: 3, status: 'Critical', location: 'C3' },
    { sku: 'WM004', product: 'Organic Apples', quantity: 89, status: 'In Stock', location: 'D1' },
    { sku: 'WM005', product: 'Laptop Charger', quantity: 67, status: 'In Stock', location: 'A2' }
  ];

  private iotData = [
    {
      device: 'Truck #1247',
      status: 'Operational',
      location: 'Loading Bay A',
      temperature: 22,
      failureRisk: 15
    },
    {
      device: 'Conveyor Belt #3',
      status: 'Operational',
      location: 'Warehouse Floor',
      temperature: 25,
      failureRisk: 8
    },
    {
      device: 'Freezer Unit #12',
      status: 'Warning',
      location: 'Cold Storage',
      temperature: -18,
      failureRisk: 35
    },
    {
      device: 'Forklift #089',
      status: 'Operational',
      location: 'Aisle 7',
      temperature: 28,
      failureRisk: 12
    }
  ];

  // Simulate network delay
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email: string, password: string) {
    await this.delay(1000);
    
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      const token = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
      return {
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      };
    }
    
    return { success: false, message: 'Invalid credentials' };
  }

  async register(name: string, email: string, password: string, role: string) {
    await this.delay(1000);
    
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role
    };
    
    this.users.push(newUser);
    return { success: true };
  }

  verifyToken(token: string) {
    try {
      const decoded = JSON.parse(atob(token));
      const user = this.users.find(u => u.id === decoded.id);
      if (user) {
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  async getAdminStats() {
    await this.delay(500);
    return {
      totalUsers: this.users.length,
      activeSuppliers: 47,
      systemAlerts: 3,
      aiAccuracy: 94
    };
  }

  async getSystemAlerts() {
    await this.delay(500);
    return [
      {
        type: 'Inventory Alert',
        message: 'Nike Shoes running critically low (3 units remaining)',
        severity: 'high'
      },
      {
        type: 'Equipment Warning',
        message: 'Freezer Unit #12 showing elevated failure risk',
        severity: 'medium'
      },
      {
        type: 'Supply Chain',
        message: 'Potential delay in electronics shipment from Supplier #23',
        severity: 'low'
      }
    ];
  }

  async getAIPredictions() {
    await this.delay(500);
    return {
      demand_forecast: 'Electronics demand expected to increase 15% next week',
      risk_score: 7,
      alert_type: 'Weather disruption may affect southern distribution centers',
      accuracy: 94
    };
  }

  async getInventory() {
    await this.delay(500);
    return this.inventory;
  }

  async getIoTData() {
    await this.delay(500);
    return this.iotData;
  }

  async getGreenImpact(userId: string) {
    await this.delay(500);
    return {
      carbon_savings: 125,
      green_points: 2340,
      trees_planted: 8,
      eco_purchases: 67
    };
  }

  async getCustomerOrders(userId: string) {
    await this.delay(500);
    return [
      {
        id: 'ORD001',
        product: 'Organic Banana Bundle',
        amount: 12.99,
        status: 'Delivered',
        date: '2024-01-15',
        green_points: 25,
        carbon_saved: 2.3
      },
      {
        id: 'ORD002',
        product: 'Eco-Friendly Detergent',
        amount: 8.49,
        status: 'In Transit',
        date: '2024-01-18',
        green_points: 40,
        carbon_saved: 3.1
      },
      {
        id: 'ORD003',
        product: 'Reusable Shopping Bags',
        amount: 15.99,
        status: 'Delivered',
        date: '2024-01-12',
        green_points: 60,
        carbon_saved: 4.2
      }
    ];
  }

  async getBlockchainData() {
    await this.delay(500);
    return {
      blockchain_status: 'Active',
      tx_id: '0x1a2b3c4d5e6f...',
      supplier_orders: [
        {
          supplier: 'TechCorp Inc',
          order_id: 'TC001',
          status: 'Verified',
          tx_hash: '0xabc123...',
          timestamp: '2024-01-20T10:30:00Z'
        }
      ]
    };
  }

  async getFederatedLearning() {
    await this.delay(500);
    return {
      global_model_accuracy: 94.2,
      local_model_accuracy: 91.8,
      training_rounds: 15,
      participants: 8,
      last_update: '2024-01-20T14:25:00Z'
    };
  }
}

export const mockApi = new MockAPI();