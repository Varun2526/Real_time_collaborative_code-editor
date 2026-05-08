import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ leftContent, centerContent, rightContent, onOpenCreateRoom }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 bg-transparent flex justify-between items-center w-full px-4 md:px-8 h-20 z-50">
      <div className="flex items-center gap-4 md:gap-8">
        {leftContent || (
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-spacex-nav ${location.pathname === '/' ? 'text-white' : 'text-[#f0f0fa]/70 hover:text-white'} transition-colors`}
            >
              Home
            </Link>
          </nav>
        )}
        {/* Mobile menu toggle or logo fallback */}
        <div className="md:hidden flex items-center gap-2">
           <span className="text-2xl font-bold tracking-[0.2em] text-[#f0f0fa] uppercase">KODAX</span>
        </div>
      </div>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
        {centerContent === undefined ? (
           <span className="text-[28px] font-bold tracking-[4px] text-[#f0f0fa] uppercase">KODAX</span>
        ) : centerContent}
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {rightContent || (
          <>
            {onOpenCreateRoom && (
              <button 
                onClick={onOpenCreateRoom}
                className="btn-ghost"
              >
                Create new Room
              </button>
            )}
          </>
        )}
        
        <div className="relative cursor-pointer ml-2">
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-12 h-12 rounded-full border border-[rgba(240,240,250,0.35)] hover:border-white bg-[rgba(240,240,250,0.1)] text-[#f0f0fa] flex items-center justify-center text-lg font-bold transition-all"
          >
            {user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-black border border-[rgba(240,240,250,0.35)] z-50">
              <div className="px-4 py-4 border-b border-[rgba(240,240,250,0.35)]">
                <p className="text-spacex-nav truncate mb-1">{user?.username || user?.name || 'CREW MEMBER'}</p>
                <p className="text-spacex-micro text-[#f0f0fa]/70 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-3 text-spacex-nav text-[#f0f0fa] hover:bg-[rgba(240,240,250,0.1)] transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;