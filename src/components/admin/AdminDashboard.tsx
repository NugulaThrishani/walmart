import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, TrendingUp, LogOut, Activity } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ user, onLogout, onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const adminStats = await mockApi.getAdminStats();
      const systemAlerts = await mockApi.getSystemAlerts();
      const aiPredictions = await mockApi.getAIPredictions();
      
      setStats(adminStats);
      setAlerts(systemAlerts);
      setPredictions(aiPredictions);
    };
    
    loadData();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold">{stats.activeSuppliers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">System Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">AI Accuracy</p>
                <p className="text-2xl font-bold">{predictions?.accuracy}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center p-3 bg-red-50 rounded-md">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">{alert.type}</p>
                    <p className="text-sm text-red-600">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">AI Predictions</h2>
            {predictions && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="font-medium text-blue-800">Demand Forecast</p>
                  <p className="text-sm text-blue-600">{predictions.demand_forecast}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-md">
                  <p className="font-medium text-amber-800">Risk Assessment</p>
                  <p className="text-sm text-amber-600">Risk Score: {predictions.risk_score}/10</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('ar')}
              className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 text-left"
            >
              <h3 className="font-medium">AR Warehouse View</h3>
              <p className="text-sm text-gray-600">Monitor warehouse operations</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 text-left">
              <h3 className="font-medium">Supplier Network</h3>
              <p className="text-sm text-gray-600">View blockchain tracking</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 text-left">
              <h3 className="font-medium">Federated Learning</h3>
              <p className="text-sm text-gray-600">Model training status</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}