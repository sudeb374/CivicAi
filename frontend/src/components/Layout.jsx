import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Mic, 
  Map as MapIcon, 
  BrainCircuit, 
  Flame, 
  BarChart3, 
  Lightbulb, 
  Home,
  Search,
  Bell,
  UserCircle,
  Globe,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/requests', label: 'Citizen Requests', icon: Users },
  { path: '/voice', label: 'Voice Complaints', icon: Mic },
  { path: '/map', label: 'Infrastructure Map', icon: MapIcon },
  { path: '/analysis', label: 'AI Analysis', icon: BrainCircuit },
  { path: '/hotspots', label: 'Demand Hotspots', icon: Flame },
  { path: '/insights', label: 'Government Insights', icon: BarChart3 },
  { path: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { path: '/villages', label: 'Villages', icon: Home },
];

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getPageTitle = () => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'CivicAI Platform';
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-slate-50 ${isDarkMode ? 'dark:bg-slate-900 dark:text-white' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        dark:bg-slate-900/95 dark:border-slate-800/60 dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">CivicAI</span>
          </div>
          <button className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:scale-[1.02] dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between h-20 px-4 sm:px-8 bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 shadow-sm dark:bg-slate-900/70 dark:border-slate-800/60">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-md"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 hidden sm:block dark:text-white">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-64 pl-10 pr-4 py-2 text-sm bg-slate-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600"
              />
            </div>

            {/* Language Selector */}
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700" title="Language">
              <Globe className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>

            {/* Profile */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm cursor-pointer ml-2">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
