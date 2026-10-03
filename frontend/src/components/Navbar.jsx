import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notifAPI } from '../services/api';
import { 
  ShieldAlert, 
  MapPin, 
  PlusCircle, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Sparkles, 
  Layers, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, openAuthModal, setSelectedIssueId }) {
  const { user, role, logout, quickDemoLogin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        notifAPI.getUnreadCount(),
        notifAPI.getAll()
      ]);
      setUnreadCount(countRes.data || 0);
      setNotifications(listRes.data || []);
    } catch (e) {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notifAPI.markAllRead();
      setUnreadCount(0);
      fetchNotifications();
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Demo Persona Quick Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white">CivicRoad AI v1.0</span>
          <span className="text-slate-400 hidden sm:inline">| Community Road Damage Intelligence & Maintenance</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 hidden md:inline">Quick Demo Switcher:</span>
          <button 
            onClick={() => quickDemoLogin('citizen')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium transition"
          >
            Citizen Arun
          </button>
          <button 
            onClick={() => quickDemoLogin('officer')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium transition"
          >
            Officer Rahul
          </button>
          <button 
            onClick={() => quickDemoLogin('admin')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-400 font-medium transition"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActivePage('landing')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
              CivicRoad<span className="text-brand-600 ml-1">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium -mt-1 tracking-wider uppercase">See It. Report It. Fix It.</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setActivePage('landing')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activePage === 'landing' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActivePage('map')}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition ${
              activePage === 'map' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Interactive Map</span>
          </button>
          
          {user && role === 'ROLE_CITIZEN' && (
            <button
              onClick={() => setActivePage('citizen-dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                activePage === 'citizen-dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              My Dashboard
            </button>
          )}

          {user && (role === 'ROLE_OFFICER' || role === 'ROLE_ADMIN') && (
            <button
              onClick={() => setActivePage('authority-dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition ${
                activePage === 'authority-dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Officer Ops</span>
            </button>
          )}

          {user && role === 'ROLE_ADMIN' && (
            <button
              onClick={() => setActivePage('admin-dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition ${
                activePage === 'admin-dashboard' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Admin & Analytics</span>
            </button>
          )}
        </nav>

        {/* Right CTA & Profile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActivePage('report')}
            className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold shadow-sm shadow-brand-600/30 hover:shadow-md transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Damage</span>
          </button>

          {/* Notifications Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead} 
                        className="text-xs text-brand-600 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-xs text-slate-400">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            if (n.issueId) {
                              setSelectedIssueId(n.issueId);
                              setActivePage('issue-detail');
                              setShowNotifs(false);
                            }
                          }}
                          className={`px-4 py-3 hover:bg-slate-50 transition cursor-pointer text-left ${!n.isRead ? 'bg-brand-50/50' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                            <span className="text-[10px] text-slate-400 flex items-center">
                              <Clock className="w-3 h-3 mr-0.5" />
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-900">{user.fullName}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                  {role?.replace('ROLE_', '')}
                </p>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
