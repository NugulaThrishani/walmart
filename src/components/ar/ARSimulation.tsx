import React, { useState } from 'react';
import { ArrowLeft, Package, MapPin, Eye, Zap } from 'lucide-react';

interface ARSimulationProps {
  user: any;
  onBack: () => void;
}

export function ARSimulation({ user, onBack }: ARSimulationProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'ar'>('normal');

  const warehouseItems = [
    { id: 'A1', name: 'Electronics Section', x: 20, y: 15, status: 'optimal', items: 245 },
    { id: 'B2', name: 'Clothing Department', x: 45, y: 25, status: 'low', items: 89 },
    { id: 'C3', name: 'Grocery Section', x: 70, y: 35, status: 'optimal', items: 412 },
    { id: 'D4', name: 'Home & Garden', x: 30, y: 55, status: 'critical', items: 23 },
    { id: 'E5', name: 'Pharmacy', x: 60, y: 65, status: 'optimal', items: 156 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'low': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">AR Warehouse Simulation</h1>
                <p className="text-gray-400">Augmented Reality Inventory Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode(viewMode === 'normal' ? 'ar' : 'normal')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  viewMode === 'ar' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                {viewMode === 'ar' ? 'AR Mode' : 'Normal View'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                Warehouse Floor Plan
                {viewMode === 'ar' && (
                  <span className="ml-2 px-2 py-1 bg-blue-600 text-xs rounded">AR ACTIVE</span>
                )}
              </h2>
              
              <div className="relative bg-gray-700 rounded-lg h-96 overflow-hidden">
                {/* Warehouse Layout Background */}
                <div className="absolute inset-0 p-4">
                  <div className="w-full h-full border-2 border-gray-600 rounded grid grid-cols-4 grid-rows-4 gap-2">
                    {Array.from({ length: 16 }, (_, i) => (
                      <div key={i} className="border border-gray-600 bg-gray-800 rounded"></div>
                    ))}
                  </div>
                </div>

                {/* Warehouse Items */}
                {warehouseItems.map((item) => (
                  <div
                    key={item.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                  >
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(item.status)} ${
                      viewMode === 'ar' ? 'animate-pulse shadow-lg' : ''
                    }`}></div>
                    
                    {(selectedItem === item.id || viewMode === 'ar') && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
                                    bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-600 min-w-max">
                        <div className="text-sm font-medium text-white mb-1">{item.name}</div>
                        <div className="text-xs text-gray-400">ID: {item.id}</div>
                        <div className="text-xs text-gray-400">Items: {item.items}</div>
                        <div className={`text-xs font-medium mt-1 ${
                          item.status === 'optimal' ? 'text-green-400' :
                          item.status === 'low' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          Status: {item.status.toUpperCase()}
                        </div>
                        
                        {viewMode === 'ar' && (
                          <div className="mt-2 pt-2 border-t border-gray-600">
                            <div className="text-xs text-blue-400 flex items-center">
                              <Zap className="w-3 h-3 mr-1" />
                              AR Navigation Active
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* AR Overlay Effects */}
                {viewMode === 'ar' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-20 p-2 rounded">
                      <div className="text-xs text-blue-300">AR OVERLAY ACTIVE</div>
                    </div>
                    
                    {/* Simulated AR path lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 50 50 Q 200 100 350 150"
                        stroke="url(#pathGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="10,5"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {viewMode === 'ar' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-400" />
                  AR Instructions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-900 bg-opacity-30 rounded border border-blue-600">
                    <p className="text-blue-300 font-medium">Navigation Path</p>
                    <p className="text-gray-400">Follow the highlighted path to reach your destination</p>
                  </div>
                  <div className="p-3 bg-green-900 bg-opacity-30 rounded border border-green-600">
                    <p className="text-green-300 font-medium">Item Scanning</p>
                    <p className="text-gray-400">Point device at items to view detailed information</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-400" />
                Inventory Status
              </h3>
              <div className="space-y-3">
                {warehouseItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedItem === item.id 
                        ? 'bg-gray-700 border-blue-500' 
                        : 'bg-gray-900 border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                    </div>
                    <div className="text-xs text-gray-400">
                      <div>ID: {item.id}</div>
                      <div>Items: {item.items}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">AR Controls</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-md text-sm">
                  Start Picking Route
                </button>
                <button className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                  Scan Item
                </button>
                <button className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                  Update Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}