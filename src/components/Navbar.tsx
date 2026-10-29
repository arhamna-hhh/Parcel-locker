import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ShieldCheck, User, ChevronDown, Check, Sparkles, BookOpen, Cpu } from 'lucide-react';

interface NavbarProps {
  onOpenHardwareAdapter: () => void;
  onOpenBsImtGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHardwareAdapter, onOpenBsImtGuide }) => {
  const { currentUser, switchRole, activeView, setActiveView, cart, firebaseConnected } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; title: string; subtitle: string; tag: string }[] = [
    { role: 'customer', title: 'Customer View', subtitle: 'Shop & Pick up via QR', tag: 'Buyer' },
    { role: 'seller', title: 'Seller View', subtitle: 'Orders, Inventory & Dispatch', tag: 'Merchant' },
    { role: 'rider', title: 'Rider View', subtitle: 'Pickup & Locker Deposit', tag: 'Fleet' },
    { role: 'admin', title: 'Admin View', subtitle: 'Network, Lockers & Audit', tag: 'Control' },
  ];

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 text-left text-slate-900 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight whitespace-nowrap">
                SafeDrop<span className="text-blue-600">PK</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider font-medium block whitespace-nowrap">
                PRIVACY LOCKER NETWORK
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (4-5 concise single-line items) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('home')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 ${
              activeView === 'home' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('shop')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 flex items-center gap-1.5 ${
              activeView === 'shop' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Demo Shop
            {totalCartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold inline-flex items-center justify-center tabular-nums">
                {totalCartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveView('hubs')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 ${
              activeView === 'hubs' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Karachi Hubs
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 ${
              activeView === 'dashboard' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Active Dashboard
          </button>
          <button
            onClick={onOpenHardwareAdapter}
            className="whitespace-nowrap text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 text-xs"
          >
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>Hardware Adapter</span>
          </button>
          <button
            onClick={onOpenBsImtGuide}
            className="whitespace-nowrap text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>BS IMT Guide</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cloud Database Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                firebaseConnected ? 'bg-emerald-500' : 'bg-blue-400'
              }`}
            />
            <span className="text-[11px]">
              {firebaseConnected ? 'Cloud Firestore' : 'Live Sync'}
            </span>
          </div>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium transition-all shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                {currentUser.role[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline font-semibold capitalize">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  {roles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setActiveView('dashboard');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        currentUser.role === item.role
                          ? 'bg-blue-50/70 text-blue-900 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{item.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({item.tag})
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-normal block">
                          {item.subtitle}
                        </span>
                      </div>
                      {currentUser.role === item.role && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-500">
                    Active: {currentUser.displayName}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Dashboard Action CTA */}
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            Open Dashboard
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav Strip */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-100 px-4 py-2 bg-slate-50/80 text-xs text-slate-600">
        <button
          onClick={() => setActiveView('home')}
          className={`py-1 ${activeView === 'home' ? 'text-blue-600 font-bold' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveView('shop')}
          className={`py-1 flex items-center gap-1 ${activeView === 'shop' ? 'text-blue-600 font-bold' : ''}`}
        >
          Demo Shop
          {totalCartCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] inline-flex items-center justify-center font-bold">
              {totalCartCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveView('hubs')}
          className={`py-1 ${activeView === 'hubs' ? 'text-blue-600 font-bold' : ''}`}
        >
          Locker Hubs
        </button>
        <button
          onClick={onOpenBsImtGuide}
          className="py-1 text-indigo-600 font-semibold"
        >
          BS IMT Guide
        </button>
      </div>
    </header>
  );
};
