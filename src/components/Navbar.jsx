import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Edit3, LogOut, Menu, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await signOut(auth);
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
      }
    }
  };

  const NavLink = ({ to, icon: Icon, text, onClick }) => {
    const active = isActive(to);
    return (
      <button
        onClick={() => {
          if (onClick) onClick();
          else navigate(to);
          setMobileMenuOpen(false);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          active
            ? 'bg-purple-500 text-white'
            : 'text-gray-700 hover:bg-purple-50'
        }`}
      >
        {Icon && <Icon size={20} className={active ? 'text-white' : 'text-purple-700'} />}
        <span>{text}</span>
      </button>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-xl font-bold text-purple-700 hover:text-purple-800"
          >
            🎓 <span className="hidden sm:inline">Skill Exchange @ IITR</span>
            <span className="sm:hidden">Skill Exchange</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/home" icon={Home} text="Home" />
            <NavLink to="/my-profile" icon={User} text="My Profile" />
            <NavLink to="/edit-skills" icon={Edit3} text="Edit Skills" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-purple-50"
          >
            {mobileMenuOpen ? <X size={24} className="text-purple-700" /> : <Menu size={24} className="text-purple-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100 py-4 px-4 space-y-2">
          <NavLink to="/home" icon={Home} text="Home" />
          <NavLink to="/my-profile" icon={User} text="My Profile" />
          <NavLink to="/edit-skills" icon={Edit3} text="Edit Skills" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;