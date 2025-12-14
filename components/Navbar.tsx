import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Map, User, LogOut, Heart, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
          isActive 
            ? 'bg-plango-500 text-white shadow-md' 
            : 'text-gray-600 hover:bg-plango-50 hover:text-plango-600'
        }`}
      >
        <Icon size={18} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-plango-500 to-plango-400 p-2 rounded-lg text-white group-hover:rotate-12 transition-transform">
              <Compass size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-plango-600 to-plango-400">
              Plango
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-2">
            <NavItem to="/" icon={Map} label="Explore" />
            <NavItem to="/generate" icon={Sparkles} label="Plan Trip" />
            <NavItem to="/bucketlist" icon={Heart} label="Bucket List" />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <User size={20} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-plango-600 font-medium hover:underline">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Nav (Optional for mobile layout optimization) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 z-50">
        <Link to="/" className={`p-2 ${location.pathname === '/' ? 'text-plango-600' : 'text-gray-400'}`}><Map size={24}/></Link>
        <Link to="/generate" className={`p-2 ${location.pathname === '/generate' ? 'text-plango-600' : 'text-gray-400'}`}><Sparkles size={24}/></Link>
        <Link to="/bucketlist" className={`p-2 ${location.pathname === '/bucketlist' ? 'text-plango-600' : 'text-gray-400'}`}><Heart size={24}/></Link>
        <Link to="/profile" className={`p-2 ${location.pathname === '/profile' ? 'text-plango-600' : 'text-gray-400'}`}><User size={24}/></Link>
      </div>
    </nav>
  );
};

export default Navbar;