import React, { useState, useEffect } from 'react';
import { Building2, Plus, Mail, Phone, ExternalLink, X, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { frappeService } from '../services/frappeService';

export default function Clients() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployer, setNewEmployer] = useState({
    companyName: '',
    industry: '',
    contactPerson: '',
    email: '',
    feePercentage: 15
  });

  const refreshData = async () => {
    try {
      const data = await frappeService.getClients();
      setEmployers(data);
    } catch (error) {
      console.error("Failed to fetch clients", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAddModal]);

  const handleAddEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await frappeService.createClient(newEmployer);
      setShowAddModal(false);
      setNewEmployer({ companyName: '', industry: '', contactPerson: '', email: '', feePercentage: 15 });
      refreshData();
    } catch (error) {
      alert("Failed to create client");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold serif tracking-tight">Client Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Manage corporate partnerships and contracts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-90" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> New Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employers.map((employer) => (
          <div key={employer.name} className="bg-white border border-[#E8E4D9] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 flex gap-2 items-center">
                <button 
                  onClick={() => {}} 
                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                  title="Delete Client"
                >
                  <Trash2 size={16} />
                </button>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full bg-green-50 text-green-700`}>
                    Active
                </span>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#F9F8F3] rounded-2xl flex items-center justify-center text-gold border border-[#E8E4D9]">
                <Building2 size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold serif mb-1">{employer.client_name}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">{employer.industry || 'General'}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Contract</p>
                    <p className="text-sm font-semibold">Standard</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Fee</p>
                    <p className="text-sm font-semibold gold-accent">15%</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-[#F9F8F3] text-gray-900 rounded-lg text-xs font-bold border border-[#E8E4D9] hover:bg-[#F0EDE6] flex items-center justify-center gap-2">
                    Open Records <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal &&
  createPortal(
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-full h-full flex items-center justify-center p-4 overflow-y-auto">
        
        <div className="bg-[#1a1a1a] text-white rounded-2xl w-full max-w-md p-6 relative border border-white/10 shadow-2xl my-10">
          
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-white"
            onClick={() => setShowAddModal(false)}
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold serif mb-6 text-white">
            Add New Client
          </h2>

          <form onSubmit={handleAddEmployer} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                Company Name
              </label>
              <input
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none"
                value={newEmployer.companyName}
                onChange={e =>
                  setNewEmployer({ ...newEmployer, companyName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                Industry
              </label>
              <input
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none"
                value={newEmployer.industry}
                onChange={e =>
                  setNewEmployer({ ...newEmployer, industry: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                  Contact Person
                </label>
                <input
                  required
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none"
                  value={newEmployer.contactPerson}
                  onChange={e =>
                    setNewEmployer({ ...newEmployer, contactPerson: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                  Fee %
                </label>
                <input
                  required
                  type="number"
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none"
                  value={newEmployer.feePercentage}
                  onChange={e =>
                    setNewEmployer({
                      ...newEmployer,
                      feePercentage: Number(e.target.value)
                    })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold text-white rounded-lg font-bold hover:opacity-90 mt-4"
            >
              Save Client
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )}
    </div>
  );
}
