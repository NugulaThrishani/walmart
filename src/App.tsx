import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { ARSimulation } from './components/ar/ARSimulation';
import { VoiceAssistant } from './components/voice/VoiceAssistant';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'customer';
}

type Page = 'home' | 'about' | 'contact' | 'login' | 'register' | 'admin' | 'employee' | 'customer' | 'ar';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Verify token with backend
        fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            setCurrentPage(data.user.role);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setCurrentPage(data.user.role);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login error: Unable to connect to server');
    }
    setLoading(false);
  };

  const handleRegister = async (name: string, email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Registration successful! Please login.');
        setCurrentPage('login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Registration error: Unable to connect to server');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentPage('register')}
            loading={loading}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentPage('login')}
            loading={loading}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            user={user!}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'employee':
        return (
          <EmployeeDashboard
            user={user!}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'customer':
        return (
          <CustomerDashboard
            user={user!}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case 'ar':
        return (
          <ARSimulation
            user={user!}
            onBack={() => setCurrentPage(user!.role)}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />
      <VoiceAssistant user={user} />
      {renderCurrentPage()}
    </div>
  );
}

export default App;