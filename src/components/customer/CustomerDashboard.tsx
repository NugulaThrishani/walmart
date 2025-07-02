import React, { useState, useEffect } from 'react';
import { Leaf, Award, ShoppingBag, LogOut, TrendingUp } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';

interface CustomerDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function CustomerDashboard({ user, onLogout, onNavigate }: CustomerDashboardProps) {
  const [greenImpact, setGreenImpact] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const impact = await mockApi.getGreenImpact(user.id);
      const orders = await mockApi.getCustomerOrders(user.id);
      
      setGreenImpact(impact);
      setRecentOrders(orders);
    };
    
    loadData();
  }, [user.id]);

  if (!greenImpact) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <TrendingUp className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p>Loading your green impact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-green-600" />
                Your Green Impact
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">{greenImpact.carbon_savings}kg</div>
                  <div className="text-sm text-green-600">CO₂ Saved</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">{greenImpact.green_points}</div>
                  <div className="text-sm text-blue-600">Green Points</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-800">{greenImpact.trees_planted}</div>
                  <div className="text-sm text-amber-600">Trees Planted</div>
                </div>
              </div>

              <div className="p-4 bg-green-100 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">🌱 Sustainability Achievement</h3>
                <p className="text-green-700 text-sm">
                  Great job! Your sustainable shopping choices have saved {greenImpact.carbon_savings}kg of CO₂ 
                  - equivalent to planting {greenImpact.trees_planted} trees! 
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
                Recent Orders
              </h2>
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{order.product}</h3>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">Ordered: {order.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">${order.amount}</div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      🌱 +{order.green_points} Green Points • {order.carbon_saved}kg CO₂ saved
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-amber-600" />
                Achievements
              </h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-amber-50 rounded-md">
                  <Award className="w-6 h-6 text-amber-600 mr-3" />
                  <div>
                    <p className="font-medium text-amber-800">Eco Warrior</p>
                    <p className="text-sm text-amber-600">50+ sustainable purchases</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-md">
                  <Leaf className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">Carbon Saver</p>
                    <p className="text-sm text-green-600">100kg CO₂ saved</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-left">
                  <h3 className="font-medium">Track Order</h3>
                  <p className="text-sm text-gray-600">Check delivery status</p>
                </button>
                <button className="w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-left">
                  <h3 className="font-medium">Sustainable Products</h3>
                  <p className="text-sm text-gray-600">Browse eco-friendly items</p>
                </button>
                <button className="w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-left">
                  <h3 className="font-medium">Green Challenges</h3>
                  <p className="text-sm text-gray-600">Join sustainability missions</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}