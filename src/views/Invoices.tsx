
import React from 'react';
import { useData } from '../../context/DataContext';
import { formatKES } from '../../utils/formatters';
import { FileText, Download, TrendingUp, ArrowUpRight, Plus } from 'lucide-react';

const Invoices: React.FC = () => {
  const { invoices } = useData();
  
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const pending = invoices.filter(i => i.status !== 'Paid').reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold serif tracking-tight">Financial Hub</h1>
          <p className="text-xs lg:text-sm text-gray-500 mt-1 font-medium">Tracking placement success fees</p>
        </div>
        <button className="p-3 bg-black text-white rounded-2xl shadow-lg lg:hidden">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] border border-[#E8E4D9] shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Billed Revenue</p>
            <h4 className="text-2xl lg:text-3xl font-bold serif">{formatKES(totalBilled).replace('KES', 'KSh')}</h4>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-green-600 font-black uppercase">
                <TrendingUp size={14} /> +22.4% vs 2023
            </div>
        </div>
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] border border-[#E8E4D9] shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Outstanding</p>
            <h4 className="text-2xl lg:text-3xl font-bold serif">{formatKES(pending).replace('KES', 'KSh')}</h4>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-orange-600 font-black uppercase">
                <ArrowUpRight size={14} /> 2 Overdue
            </div>
        </div>
        <div className="bg-gold text-white p-6 lg:p-8 rounded-[2rem] shadow-xl shadow-gold/20">
            <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.15em] mb-2">Avg placement fee</p>
            <h4 className="text-2xl lg:text-3xl font-bold serif">17.5%</h4>
            <div className="mt-4 text-[10px] font-bold text-white/50 uppercase">Global Agency Standard</div>
        </div>
      </div>

      <div className="lg:bg-white lg:border lg:border-[#E8E4D9] lg:rounded-[2.5rem] lg:overflow-hidden lg:shadow-sm">
        {/* Desktop View Table */}
        <table className="hidden lg:table w-full text-left">
          <thead className="bg-[#F9F8F3] border-b border-[#E8E4D9]">
            <tr>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-gray-500">Invoice ID</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-gray-500">Client Partner</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-gray-500">Placement</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-gray-500">Fee Amount</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-gray-500">Status</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0]">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-[#FDFBF7] transition-colors">
                <td className="px-8 py-6 text-xs font-black text-gray-900">#{inv.id.split('-')[2] || inv.id}</td>
                <td className="px-8 py-6 text-xs font-bold text-gray-700">{inv.employerName}</td>
                <td className="px-8 py-6 text-xs text-gray-500 italic">{inv.placementName}</td>
                <td className="px-8 py-6 text-xs font-black text-gray-900">{formatKES(inv.amount)}</td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-3 bg-[#F9F8F3] hover:bg-gold/10 hover:text-gold rounded-2xl transition-all">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View Cards */}
        <div className="lg:hidden space-y-4">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white border border-[#E8E4D9] p-6 rounded-3xl shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">#{inv.id}</span>
                    <h3 className="text-sm font-black text-gray-900">{inv.employerName}</h3>
                 </div>
                 <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                    {inv.status}
                 </span>
              </div>
              <p className="text-[11px] text-gray-500 italic border-l-2 border-gold/20 pl-3">{inv.placementName}</p>
              <div className="flex justify-between items-center pt-2">
                 <span className="text-lg font-black text-gray-900">{formatKES(inv.amount).replace('KES', 'KSh')}</span>
                 <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl active:bg-gold active:text-white transition-colors">
                    <Download size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
