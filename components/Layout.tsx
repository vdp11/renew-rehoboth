
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Building2, 
  FileText, 
  GitMerge, 
  Settings,
  ChevronRight,
  Sparkles,
  PlusCircle,
  Menu
} from 'lucide-react';

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; to: string; active?: boolean }> = ({ icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-gray-600 hover:bg-[#F0EDE6]'}`}>
    <span className={active ? 'text-white' : 'text-gray-400'}>{icon}</span>
    <span className="font-semibold text-sm">{label}</span>
  </Link>
);

const MobileNavItem: React.FC<{ icon: React.ReactNode; label: string; to: string; active?: boolean }> = ({ icon, label, to, active }) => (
  <Link to={to} className={`flex flex-col items-center justify-center flex-1 py-3 gap-1 transition-all ${active ? 'text-gold' : 'text-gray-400'}`}>
    <span className={`${active ? 'scale-110' : ''} transition-transform`}>{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-cream relative overscroll-none">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-[#E8E4D9] flex-col fixed h-full bg-cream z-30">
        <div className="p-8">
          <Link to="/" className="block">
            <h1 className="text-3xl font-bold serif tracking-tight">Renew</h1>
            <h2 className="text-xs uppercase tracking-[0.2em] gold-accent font-bold mt-[-4px]">Rehoboth</h2>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-1 overflow-y-auto pb-8 no-scrollbar">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" to="/" active={location.pathname === '/'} />
          <SidebarItem icon={<GitMerge size={20} />} label="Workflow" to="/pipeline" active={location.pathname === '/pipeline'} />
          <SidebarItem icon={<Users size={20} />} label="Talent Pool" to="/candidates" active={location.pathname === '/candidates'} />
          <SidebarItem icon={<Briefcase size={20} />} label="Job Board" to="/jobs" active={location.pathname === '/jobs'} />
          <SidebarItem icon={<Building2 size={20} />} label="Clients" to="/clients" active={location.pathname === '/clients'} />
          <SidebarItem icon={<Sparkles size={20} />} label="AI Engine" to="/ai-insights" active={location.pathname === '/ai-insights'} />
          <SidebarItem icon={<FileText size={20} />} label="Billing" to="/invoices" active={location.pathname === '/invoices'} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" to="/settings" active={location.pathname === '/settings'} />
        </nav>
      </aside>

      {/* Main Content Container */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen relative">
        <header className="h-16 lg:h-20 border-b border-[#E8E4D9] bg-cream/90 backdrop-blur-xl flex items-center justify-between px-6 lg:px-12 sticky top-0 z-[45] pt-safe w-full">
          <div className="lg:hidden">
             <h1 className="text-xl font-bold serif leading-none">Renew</h1>
             <p className="text-[8px] uppercase tracking-widest gold-accent font-black">Rehoboth</p>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Production</span>
            <ChevronRight size={14} />
            <span className="text-gray-900">Workspace</span>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="lg:hidden p-2"><PlusCircle size={22} className="text-gold" /></button>
             <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-2xl bg-gold flex items-center justify-center text-white text-xs lg:text-sm font-black shadow-lg shadow-gold/20">
                RR
             </div>
          </div>
        </header>

        {/* Content Area with extra padding at bottom to account for fixed Nav */}
        <div className="px-6 py-8 lg:px-12 max-w-7xl w-full mx-auto pb-40 lg:pb-12 fade-in">
          {children}
        </div>
      </main>

      {/* Mobile/Tablet Bottom Navigation Bar - Fixed & Visible */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-[#E8E4D9] flex items-center justify-around lg:hidden z-[60] px-2 pb-safe shadow-[0_-15px_35px_-10px_rgba(0,0,0,0.08)] h-16 lg:h-20">
        <MobileNavItem icon={<LayoutDashboard size={22} />} label="Home" to="/" active={location.pathname === '/'} />
        <MobileNavItem icon={<GitMerge size={22} />} label="Board" to="/pipeline" active={location.pathname === '/pipeline'} />
        <MobileNavItem icon={<Users size={22} />} label="Talent" to="/candidates" active={location.pathname === '/candidates'} />
        <MobileNavItem icon={<Briefcase size={22} />} label="Jobs" to="/jobs" active={location.pathname === '/jobs'} />
        <MobileNavItem icon={<Menu size={22} />} label="More" to="/settings" active={location.pathname === '/settings' || location.pathname === '/invoices' || location.pathname === '/clients' || location.pathname === '/ai-insights'} />
      </nav>
    </div>
  );
};

export default Layout;
