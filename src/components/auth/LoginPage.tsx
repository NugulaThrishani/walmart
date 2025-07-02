import React, { useState } from 'react';
import { LogIn, ShoppingCart, User, Users, Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
  loading: boolean;
}

export function LoginPage({ onLogin, onSwitchToRegister, loading }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'employee' | 'admin'>('customer');

  const handleSubmit = () => {
    if (email && password) {
      onLogin(email, password);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleRoleLogin = (role: 'customer' | 'employee' | 'admin') => {
    const credentials = {
      customer: { email: 'customer@walmart.com', password: 'cust123' },
      employee: { email: 'employee@walmart.com', password: 'emp123' },
      admin: { email: 'admin@walmart.com', password: 'admin123' }
    };
    
    const cred = credentials[role];
    setEmail(cred.email);
    setPassword(cred.password);
    setSelectedRole(role);
    onLogin(cred.email, cred.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Login as:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleRoleLogin('customer')}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedRole === 'customer'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Customer</span>
            </button>
            
            <button
              onClick={() => handleRoleLogin('employee')}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedRole === 'employee'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Employee</span>
            </button>
            
            <button
              onClick={() => handleRoleLogin('admin')}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedRole === 'admin'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Shield className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Admin</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center font-medium transition-colors"
          >
            {loading ? (
              'Signing in...'
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </button>

          <div className="text-center">
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Don't have an account? Register here
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Click on a role above for quick demo access
          </p>
        </div>
      </div>
    </div>
  );
}