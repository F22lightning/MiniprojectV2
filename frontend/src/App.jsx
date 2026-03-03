import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChefHat, ShoppingCart, LayoutDashboard, History, Settings } from 'lucide-react';

import KDSPage from './pages/KDSPage';
import POSPage from './pages/POSPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'หน้าจอเชฟ (KDS)', icon: ChefHat },
    { path: '/pos', label: 'รับออเดอร์ (POS)', icon: ShoppingCart },
    { path: '/dashboard', label: 'ยอดขาย (Dashboard)', icon: LayoutDashboard },
    { path: '/history', label: 'ประวัติออเดอร์', icon: History },
    { path: '/admin', label: 'จัดการเมนู (Admin)', icon: Settings },
  ];

  return (
    <nav className="bg-slate-800 text-slate-300 p-4 sticky top-0 z-40 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-2">
        <ChefHat className="w-8 h-8 text-emerald-400" />
        <h1 className="text-xl font-black text-white tracking-tight">Kitchen Buddy <span className="text-emerald-400">V2</span></h1>
      </div>
      <div className="flex gap-1 md:gap-4 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-emerald-500 text-white shadow-sm' : 'hover:bg-slate-700 hover:text-white'}`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-1 overflow-hidden p-4 md:p-6">
        <Routes>
          <Route path="/" element={<KDSPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
