import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Briefcase, MapPin, DollarSign, Users, ArrowRight, X, Trash2, Send } from 'lucide-react';
import { frappeService } from '../services/frappeService';
import { JobStatus, ApplicationStatus } from '../../types';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  
  const [newJob, setNewJob] = useState({
    title: '',
    employerId: '',
    location: '',
    salaryRange: '',
    description: ''
  });

  const refreshData = async () => {
    try {
      const [fetchedJobs, fetchedClients, fetchedCandidates] = await Promise.all([
        frappeService.getJobOpenings(),
        frappeService.getClients(),
        frappeService.getCandidates()
      ]);
      
      const mappedJobs = fetchedJobs.map((job: any) => ({
        id: job.name,
        title: job.job_title,
        employerName: job.company || 'Renew Rehoboth', // Fallback to Company since Client field is unavailable
        location: 'Nairobi', // Default as API doesn't return yet
        salaryRange: 'Competitive', // Default
        status: job.status
      }));

      setJobs(mappedJobs);
      setEmployers(fetchedClients);
      setCandidates(fetchedCandidates);
    } catch (error) {
      console.error("Failed to load jobs data", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (showAddModal || showApplyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAddModal, showApplyModal]);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await frappeService.createJobOpening(newJob);
      setShowAddModal(false);
      setNewJob({ title: '', employerId: '', location: '', salaryRange: '', description: '' });
      refreshData();
    } catch (error) {
      alert("Error creating job opening");
    }
  };

  const handleApply = async () => {
    if (!selectedCandidate || !showApplyModal) return;
    
    try {
      await frappeService.updateCandidate(selectedCandidate, {
        job_title: showApplyModal, // Link candidate to this Job ID
        status: 'Open'
      });

      window.dispatchEvent(new Event('pipeline-refresh'));

      alert("Application Submitted Successfully!");
      setShowApplyModal(null);
      setSelectedCandidate('');
    } catch (error) {
      alert("Failed to submit application");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold serif tracking-tight">Active Openings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage active vacancies across clients</p>
        </div>
        <button className="px-6 py-2.5 bg-gold text-white rounded-lg text-xs font-bold hover:opacity-90" onClick={() => setShowAddModal(true)}>
          Post New Opening
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-[#E8E4D9] p-6 rounded-xl shadow-sm hover:border-gold transition-all flex flex-col md:flex-row items-center gap-6 group">
            <div className="w-14 h-14 bg-black/5 rounded-xl flex items-center justify-center text-gray-600">
                <Briefcase size={24} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold mb-1">{job.title}</h3>
              <p className="text-sm text-gold font-medium mb-3">{job.employerName}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                <span className="flex items-center gap-1"><DollarSign size={12} /> {job.salaryRange}</span>
              </div>
            </div>
            <div className="flex gap-4 items-center border-t md:border-t-0 md:border-l border-[#F0F0F0] pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
              <button 
                onClick={() => setShowApplyModal(job.id)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:opacity-90"
              >
                <Send size={14} /> Apply
              </button>
              <button 
                onClick={() => {}} // Delete not implemented in service yet
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                title="Delete Job"
              >
                <Trash2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#E8E4D9] flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal &&
  createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
      
      <div className="relative w-full h-full flex items-center justify-center p-4 overflow-y-auto">
        
        <div className="bg-[#1a1a1a] text-white rounded-2xl w-full max-w-md p-6 relative border border-white/10 shadow-2xl my-10">
          
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-white"
            onClick={() => setShowAddModal(false)}
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold serif mb-6 text-white">
            Post Job Opening
          </h2>

          <form onSubmit={handleAddJob} className="space-y-4">
            
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                Job Title
              </label>
              <input
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                value={newJob.title}
                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                Employer
              </label>
              <select
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                value={newJob.employerId}
                onChange={e => setNewJob({ ...newJob, employerId: e.target.value })}
              >
                <option value="" className="bg-[#1a1a1a]">
                  Select Employer
                </option>
                {employers.map(e => (
                  <option key={e.name} value={e.name} className="bg-[#1a1a1a]">
                    {e.client_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                Location
              </label>
              <input
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                value={newJob.location}
                onChange={e => setNewJob({ ...newJob, location: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                Salary Range
              </label>
              <input
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                value={newJob.salaryRange}
                onChange={e => setNewJob({ ...newJob, salaryRange: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold text-white rounded-lg font-bold hover:opacity-90 transition-opacity mt-4"
            >
              Post Opening
            </button>

          </form>
        </div>
      </div>
    </div>,
    document.body
  )}

      {showApplyModal &&
  createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
      
      <div className="relative w-full h-full flex items-center justify-center p-4 overflow-y-auto">
        
        <div className="bg-[#1a1a1a] text-white rounded-2xl w-full max-w-md p-6 relative border border-white/10 shadow-2xl my-10">
          
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-white"
            onClick={() => setShowApplyModal(null)}
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold serif mb-2 text-white">
            Apply for Role
          </h2>

          <p className="text-xs text-gray-400 mb-6 italic">
            This will register the candidate in the workflow board.
          </p>

          <form className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
                Select Candidate
              </label>
              <select
                required
                className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-gold outline-none"
                value={selectedCandidate}
                onChange={e => setSelectedCandidate(e.target.value)}
              >
                <option value="" className="bg-[#1a1a1a]">
                  Select from Talent Pool
                </option>
                {candidates.map((c: any) => (
                  <option key={c.name} value={c.name} className="bg-[#1a1a1a]">
                    {c.applicant_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3 bg-gold text-white rounded-lg font-bold hover:opacity-90 transition-opacity mt-4"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )}
    </div>
  );
};

export default Jobs;
