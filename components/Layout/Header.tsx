
import React from 'react';
import { Tab, NavItem } from '../../types';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  navItems: NavItem[];
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, navItems }) => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary-500">FITAI</h1>
          <nav>
            <ul className="flex space-x-2 md:space-x-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                      ${activeTab === item.id 
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    {item.icon}
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
    