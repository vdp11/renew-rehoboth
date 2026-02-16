import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { frappeService } from '../services/frappeService';
import { X, Plus } from 'lucide-react';

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobOpenings, setJobOpenings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- FORM STATE ---
  // We use separate fields for the UI, but will combine names when sending
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    job_title: '',
    location: ''
  });

  const refreshData = async () => {
    setLoading(true);
    try {
      const jobs = await frappeService.getJobOpenings();
      setJobOpenings(jobs);
      const data = await frappeService.getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // 1. Combine First + Last Name for Frappe's "applicant_name" field
    const fullName = `${formData.first_name} ${formData.last_name}`.trim();

    // 2. Prepare the payload
    const payload = {
      applicant_name: fullName, // Mandatory in Frappe
      email_id: formData.email_id,
      job_title: formData.job_title, // Optional (Service handles empty string)
      location: formData.location // Will only save if you have a 'location' field in Frappe
    };

    console.log("🚀 Submitting:", payload);

    try {
      await frappeService.createCandidate(payload);
      
      // Success
      alert("✅ Candidate Added!");
      setShowAddModal(false);
      
      // Reset Form
      setFormData({ 
        first_name: '', 
        last_name: '', 
        email_id: '', 
        job_title: '',
        location: ''
      }); 
      
      refreshData(); // Reload list

    } catch (err: any) {
      console.error("Submission Error:", err);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold serif tracking-tight">Talent Pool</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all candidates in the system</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-90"
        >
          <Plus size={14} /> New Candidate
        </button>
      </div>

      {/* CANDIDATE LIST */}
      <div className="bg-white border border-[#E8E4D9] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading candidates...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F9F8F3] border-b border-[#E8E4D9]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Applied For</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm italic">
                      No candidates found. Click "Add Candidate" to start.
                    </td>
                  </tr>
                ) : (
                  candidates.map((c, idx) => (
                    <tr key={c.name || idx} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{c.applicant_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.email_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {c.job_title ? (
                           <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                             {c.job_title}
                           </span>
                        ) : (
                          <span className="text-gray-400 italic">General Application</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${c.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gold/10 text-gold'}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- POPUP MODAL --- */}
      {showAddModal &&
  createPortal(
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center backdrop-blur-sm">
      
      <div className="relative w-full h-full flex items-center justify-center p-4 overflow-y-auto">
        
        <div className="bg-[#1a1a1a] text-white rounded-2xl w-full max-w-md p-6 relative border border-white/10 shadow-2xl my-10">
          
          {/* Header */}
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-white"
            onClick={() => setShowAddModal(false)}
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold serif mb-6 text-white">
              Add New Candidate
          </h2>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[75vh]">
            <form id="add-candidate-form" onSubmit={handleSubmit} className="space-y-4">

              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                    value={formData.first_name}
                    onChange={e =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                    value={formData.last_name}
                    onChange={e =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                  value={formData.email_id}
                  onChange={e =>
                    setFormData({ ...formData, email_id: e.target.value })
                  }
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              {/* Job Dropdown */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                  Job Opening
                </label>
                <select
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                  value={formData.job_title}
                  onChange={e =>
                    setFormData({ ...formData, job_title: e.target.value })
                  }
                >
                  <option value="" className="bg-[#1a1a1a]">-- General Application --</option>
                  {jobOpenings.map(job => (
                    <option key={job.name} value={job.name} className="bg-[#1a1a1a]">
                      {job.job_title}
                    </option>
                  ))}
                </select>
              </div>

            </form>
          </div>

          {/* Footer */}
            <button
              type="submit"
              form="add-candidate-form"
              disabled={submitting}
              className="w-full py-3 bg-gold text-white rounded-lg font-bold hover:opacity-90 transition-opacity mt-4"
            >
              {submitting ? 'Saving...' : 'Save Candidate'}
            </button>
          </div>

        </div>
      </div>,
    document.body
  )}
    </div>
  );
}