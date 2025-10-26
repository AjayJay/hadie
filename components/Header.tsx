import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';

interface HeaderProps {
    title: string;
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.name.charAt(0).toUpperCase() ?? '?';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <div className="relative">
             <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="flex items-center justify-center w-10 h-10 bg-sky-500 rounded-full text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                {userInitial}
              </button>
            {isDropdownOpen && user && (
                <div 
                    ref={dropdownRef}
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30 animate-fade-in-fast"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="py-1" role="none">
                        <div className="px-4 py-2 border-b border-slate-200">
                            <p className="text-sm text-slate-600">Signed in as</p>
                            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        </div>
                        <a 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                onLogout();
                                setIsDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            role="menuitem"
                        >
                            Logout
                        </a>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;