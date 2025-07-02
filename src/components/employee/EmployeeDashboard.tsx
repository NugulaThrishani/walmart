import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertTriangle, LogOut, Cpu } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';

interface EmployeeDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function EmployeeDashboard({ user, onLogout, onNavigate }: EmployeeDashboardProps) {
  const [inventory, setInventory] = useState<any[]>([]);
  const [iotData, setIotData] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const inventoryData = await mockApi.getInventory();
      const iotSensors = await mockApi.getIoTData();
      const aiPredictions = await mockApi.getAIPredictions();
      
      setInventory(inventoryData);
      setIotData(iotSensors);
      setPredictions(aiPredictions);
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="text-gray-600">Supply Chain Command Center</p>
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
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Inventory Management
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">SKU</th>
                      <th className="text-left py-2">Product</th>
                      <th className="text-left py-2">Quantity</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.sku}</td>
                        <td className="py-2">{item.product}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.status === 'Low Stock' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-green-600" />
                IoT Equipment Monitoring
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {iotData.map((device, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{device.device}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        device.status === 'Operational' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {device.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Location: {device.location}</p>
                    <div className="text-sm">
                      <p>Temperature: {device.temperature}°C</p>
                      <p>Failure Risk: {device.failureRisk}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-purple-600" />
                AI Insights
              </h2>
              {predictions && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="font-medium text-blue-800">Demand Forecast</p>
                    <p className="text-sm text-blue-600">{predictions.demand_forecast}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-md">
                    <p className="font-medium text-amber-800">Risk Alert</p>
                    <p className="text-sm text-amber-600">{predictions.alert_type}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('ar')}
                  className="w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-left"
                >
                  <h3 className="font-medium">AR Warehouse</h3>
                  <p className="text-sm text-gray-600">Virtual warehouse view</p>
                </button>
                <button className="w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-left">
                  <h3 className="font-medium">Generate Report</h3>
                  <p className="text-sm text-gray-600">Create performance report</p>
                </button>
                <button className="w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-left">
                  <h3 className="font-medium">Maintenance Schedule</h3>
                  <p className="text-sm text-gray-600">View upcoming maintenance</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}