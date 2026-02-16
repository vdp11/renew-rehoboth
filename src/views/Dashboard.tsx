import React, { useState, useEffect } from 'react';
import { Briefcase, Users, TrendingUp, Landmark, Calendar, Search, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { frappeService } from '../services/frappeService';
import { formatKES } from '../../utils/formatters';

const data = [
  { name: 'Jan', revenue: 1200000 },
  { name: 'Feb', revenue: 2100000 },
  { name: 'Mar', revenue: 1500000 },
  { name: 'Apr', revenue: 2800000 },
  { name: 'May', revenue: 3500000 },
];

const StatCard: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode }> = ({ label, value, sub, icon }) => (
  <div className="bg-white border border-[#E8E4D9] p-5 lg:p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-[#F9F8F3] rounded-xl text-gold group-hover:bg-gold group-hover:text-white transition-colors">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
      </div>
      <ArrowUpRight size={16} className="text-gray-300" />
    </div>
    <p className="text-gray-400 text-[10px] lg:text-xs font-black uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-xl lg:text-3xl font-bold tracking-tighter truncate">{value}</h3>
    <p className="text-[10px] text-gray-500 font-medium mt-1">{sub}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    jobsCount: 0,
    candidatesCount: 0,
    applicationsCount: 0,
    revenue: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const jobs = await frappeService.getJobOpenings();
      const candidates = await frappeService.getCandidates();
      // Applications and Revenue are mocked for now as per service limitations
      setStats({
        jobsCount: jobs.length,
        candidatesCount: candidates.length,
        applicationsCount: candidates.filter((c: any) => c.job_title).length, // Corrected field name
        revenue: 4500000 // Mock revenue
      });
    };
    loadStats();
  }, []);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 px-1">
          <h1 className="text-2xl lg:text-4xl font-bold serif tracking-tight">Performance Desk</h1>
          <p className="text-xs lg:text-sm text-gray-500 font-medium">Synced intelligence from Renew Rehoboth records</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <StatCard icon={<Briefcase />} label="Open Jobs" value={stats.jobsCount.toString()} sub="Active hiring" />
        <StatCard icon={<Users />} label="Talent" value={stats.candidatesCount.toString()} sub="Verified profiles" />
        <StatCard icon={<TrendingUp />} label="Applications" value={stats.applicationsCount.toString()} sub="In pipeline" />
        <StatCard icon={<Landmark />} label="Revenue" value={formatKES(stats.revenue).replace('KES', 'KSh')} sub="Settled fees" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-white border border-[#E8E4D9] p-6 lg:p-8 rounded-[2rem] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-bold serif text-lg lg:text-xl">Revenue Flow</h4>
            <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-gold/5 px-3 py-1 rounded-full">YTD Growth</span>
          </div>
          <div className="relative w-full h-56 lg:h-80 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C5A059" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#E8E4D9] p-6 lg:p-8 rounded-[2rem] shadow-sm">
          <h4 className="font-bold serif text-lg lg:text-xl mb-6">Top Partners</h4>
          <div className="space-y-6">
            {[
              { name: 'Safaricom PLC', score: 92, count: 12 },
              { name: 'KCB Bank', score: 85, count: 8 },
              { name: 'Standard Group', score: 78, count: 5 },
            ].map((r, idx) => (
              <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-[#F9F8F3] border border-gold/10 flex items-center justify-center font-black text-gold text-sm group-hover:bg-gold group-hover:text-white transition-all">
                    {r.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs lg:text-sm font-black text-gray-900 truncate">{r.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{r.count} slots</p>
                  </div>
                  <div className="w-full bg-[#F0EDE6] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gold h-full transition-all duration-1000" style={{ width: `${r.score}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
