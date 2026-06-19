import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { Mail, Menu, X, Send } from 'lucide-react';

interface SidebarProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const VkIcon = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M12.8712 15.6599C12.8712 15.6599 15.2212 15.6199 16.5412 17.5199C16.9812 18.1599 16.6412 18.6199 16.6412 18.6199L13.8812 18.6599C13.8812 18.6599 11.8212 18.7899 10.4612 17.2299C10.4612 17.2299 10.4412 15.1199 9.94119 15.2199C9.33119 15.3499 9.17119 16.6699 9.17119 17.5999C9.17119 18.2899 8.61119 18.6699 8.61119 18.6699C8.61119 18.6699 6.27119 18.7999 4.39119 16.5999C2.45119 14.3199 0.441193 9.42993 0.441193 9.42993C0.441193 9.42993 0.731193 8.76993 1.98119 8.79993C1.98119 8.79993 3.69119 8.74993 3.79119 8.74993C4.21119 8.74993 4.41119 8.97993 4.50119 9.16993C4.50119 9.16993 5.37119 11.4599 6.54119 13.0699C7.65119 14.5999 8.12119 14.6599 8.35119 14.4899C8.94119 14.0799 8.84119 12.3399 8.84119 11.6699C8.84119 9.53993 9.17119 8.21993 10.0812 7.97993C10.3812 7.89993 10.8412 7.84993 11.4112 7.83993C12.1612 7.81993 13.0112 7.91993 13.1912 8.16993C13.2412 8.23993 12.5512 8.52993 12.4812 9.69993C12.4212 10.9799 12.8712 11.0899 12.8712 11.0899C12.8712 11.0899 14.3612 10.9999 15.9312 8.27993C15.9312 8.27993 16.2712 7.72993 17.0712 7.79993C17.9612 7.87993 18.9112 7.78993 18.9112 7.78993C18.9112 7.78993 19.3812 7.76993 19.7412 8.13993C20.0712 8.48993 19.9512 9.10993 19.9512 9.10993C19.9512 9.10993 19.5712 10.9399 17.7412 13.0199C15.8212 15.1999 15.0712 15.3499 15.0712 15.3499L12.8712 15.6599Z" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory,
  onSelectCategory,
  isMobileMenuOpen,
  toggleMobileMenu
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const categories = Object.values(Category);

  const handleCategoryClick = (cat: Category) => {
    onSelectCategory(cat);
    if (location.pathname !== '/portfolio') {
      navigate('/portfolio');
    }
  };

  const menuItems = [
    { path: '/', label: 'Главная' },
    { path: '/portfolio', label: 'Портфолио', onClick: () => onSelectCategory(Category.ALL) },
    { path: '/pricing', label: 'Прайс' },
    { path: '/journal', label: 'Журнал' },
    { path: '/why-us', label: 'Почему мы' },
    { path: '/team', label: 'Команда' },
    { path: '/contacts', label: 'Контакты' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <NavLink 
          to="/"
          className="text-2xl font-sans font-black tracking-tighter text-zinc-900 uppercase select-none flex items-baseline hover:opacity-80 transition-opacity"
        >
          PRIZMA<span className="font-serif italic text-brandOrange font-normal ml-0.5">.</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-7 font-sans font-bold text-[10px] lg:text-[11px] uppercase tracking-wider">
          {menuItems.map((item) => {
            const isPortfolioLink = item.path === '/portfolio';
            const isPathActive = location.pathname === item.path || (isPortfolioLink && location.pathname.startsWith('/project'));

            return (
              <NavLink 
                key={item.path}
                to={item.path}
                onClick={item.onClick}
                className={`transition-all duration-200 hover:text-brandOrange py-2 relative whitespace-nowrap ${
                  isPathActive ? 'text-zinc-950' : 'text-zinc-500'
                }`}
              >
                {item.label}
                {isPathActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brandOrange rounded-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions & Social Links */}
        <div className="hidden md:flex items-center gap-4 text-zinc-400">
          <div className="hidden lg:flex items-center gap-3">
            <a href="https://t.me/gnikw" target="_blank" rel="noopener noreferrer" className="hover:text-brandOrange transition-colors">
              <Send size={16} />
            </a>
            <a href="https://vk.com/prizmastudia" target="_blank" rel="noopener noreferrer" className="hover:text-brandOrange transition-colors">
              <VkIcon size={16} />
            </a>
            <a href="mailto:gniks1@yandex.ru" className="hover:text-brandOrange transition-colors">
              <Mail size={16} />
            </a>
          </div>
          <NavLink 
            to="/contacts"
            className="ml-2 bg-zinc-950 text-white font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2.5 hover:bg-brandOrange hover:text-white transition-all rounded-lg duration-300 whitespace-nowrap"
          >
            Связаться
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-zinc-900 hover:text-brandOrange transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Portfolio Categories Sub-Header (Only shown on portfolio route) */}
      {location.pathname === '/portfolio' && (
        <div className="bg-zinc-50/50 border-b border-zinc-100 py-3 block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Категории:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-[10px] font-mono uppercase tracking-wider transition-all duration-200 py-1 px-3.5 rounded-full ${
                    activeCategory === cat
                      ? 'bg-zinc-900 text-white font-bold shadow-sm'
                      : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-zinc-200 shadow-2xl z-40 max-h-[calc(100vh-5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-6 py-4 flex flex-col font-sans font-bold text-xs uppercase tracking-wider divide-y divide-zinc-100">
            {menuItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  toggleMobileMenu();
                }}
                className={({ isActive }) => `py-3.5 flex items-center justify-between transition-colors ${
                  isActive ? 'text-brandOrange' : 'text-zinc-600 hover:text-brandOrange'
                }`}
              >
                <span>{item.label}</span>
                {location.pathname === item.path && <span className="w-1.5 h-1.5 rounded-full bg-brandOrange" />}
              </NavLink>
            ))}

            {/* Mobile Social & Contact */}
            <div className="pt-6 mt-2 flex flex-col gap-4">
              <div className="flex gap-8 text-zinc-500 justify-center py-2">
                <a href="https://t.me/gnikw" target="_blank" rel="noopener noreferrer" className="hover:text-brandOrange transition-colors">
                  <Send size={18} />
                </a>
                <a href="https://vk.com/prizmastudia" target="_blank" rel="noopener noreferrer" className="hover:text-brandOrange transition-colors">
                  <VkIcon size={18} />
                </a>
                <a href="mailto:gniks1@yandex.ru" className="hover:text-brandOrange transition-colors">
                  <Mail size={18} />
                </a>
              </div>
              <NavLink 
                to="/contacts"
                onClick={toggleMobileMenu}
                className="w-full text-center bg-zinc-950 hover:bg-brandOrange text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg shadow-sm transition-colors"
              >
                Связаться
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
