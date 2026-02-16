import React, { useState, useEffect } from 'react';
import { ApplicationStatus } from '../../types';
import { Clock, ArrowRightLeft, Target, MoreVertical, ChevronDown } from 'lucide-react';
import { frappeService } from '../services/frappeService';

const STAGES = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEW_SCHEDULED,
  ApplicationStatus.INTERVIEWED,
  ApplicationStatus.OFFERED,
  ApplicationStatus.PLACED
];

const Pipeline: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);

  const refreshPipeline = async () => {
    try {
      const [cands, jobs] = await Promise.all([
        frappeService.getCandidates(),
        frappeService.getJobOpenings()
      ]);
      
      const jobMap = new Map(jobs.map((j: any) => [j.name, j.job_title]));

      const apps = cands
        .filter((c: any) => c.job_title) // Only show candidates assigned to a job
        .map((c: any) => ({
          id: c.name,
          candidateName: c.applicant_name,
          jobTitle: jobMap.get(c.job_title) || c.job_title,
          // Map 'Open' to 'Applied' for the board view
          status: (c.status === 'Open' ? ApplicationStatus.APPLIED : c.status) as ApplicationStatus,
          updatedAt: 'Today',
          matchingScore: 85 // Mock score for now
      }));
      setApplications(apps);
    } catch (error) {
      console.error("Error loading pipeline:", error);
    }
  };

  useEffect(() => {
    refreshPipeline();

    const handleRefresh = () => refreshPipeline();
    window.addEventListener('pipeline-refresh', handleRefresh);

    return () => {
      window.removeEventListener('pipeline-refresh', handleRefresh);
    };
  }, []);

  const handleMove = async (appId: string, currentStatus: ApplicationStatus) => {
    const currentIndex = STAGES.indexOf(currentStatus);
    if (currentIndex < STAGES.length - 1) {
      const nextStatus = STAGES[currentIndex + 1];
      // Optimistic update
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: nextStatus } : a));
      await frappeService.updateCandidate(appId, { status: nextStatus });
    }
  };

  const handleRegress = async (appId: string, currentStatus: ApplicationStatus) => {
    const currentIndex = STAGES.indexOf(currentStatus);
    if (currentIndex > 0) {
      const prevStatus = STAGES[currentIndex - 1];
      // Optimistic update
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: prevStatus } : a));
      await frappeService.updateCandidate(appId, { status: prevStatus });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="px-1 flex justify-between items-end">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold serif tracking-tight">Recruitment Journey</h1>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Lifecycle of active talent engagement</p>
          </div>
          <button className="lg:hidden p-2 text-gold"><MoreVertical size={22} /></button>
      </div>

      {/* 
          Mobile/Tablet: Vertical stack with visual connectors
          Desktop (lg): Horizontal Kanban board
      */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 lg:overflow-x-auto lg:pb-8 lg:-mx-6 lg:px-6 lg:snap-x lg:snap-mandatory no-scrollbar relative">
        {STAGES.map((stage, idx) => {
          const appsInStage = applications.filter(a => a.status === stage);
          return (
            <React.Fragment key={stage}>
              {/* Vertical Step Connector Line for Mobile/Tablet */}
              {idx > 0 && (
                <div className="flex lg:hidden justify-center -my-6 relative z-0">
                  <div className="w-0.5 h-12 bg-gold/10"></div>
                </div>
              )}

              <div className="flex-shrink-0 w-full lg:w-80 snap-start">
                <div className="flex justify-between items-center mb-5 px-3">
                  <div className="flex items-center gap-3">
                    <span className="lg:hidden w-7 h-7 rounded-2xl bg-gold/5 text-gold flex items-center justify-center text-[11px] font-black border border-gold/10 shadow-sm">
                      {idx + 1}
                    </span>
                    <h3 className="text-[11px] uppercase font-black text-gray-400 tracking-[0.2em]">{stage}</h3>
                  </div>
                  <span className="text-[10px] font-black bg-white border border-[#E8E4D9] text-gray-900 px-4 py-1.5 rounded-2xl shadow-sm">
                    {appsInStage.length}
                  </span>
                </div>
                
                <div className={`space-y-4 p-5 rounded-[2.5rem] lg:min-h-[600px] border border-[#E8E4D9]/50 backdrop-blur-sm transition-all duration-500 ${appsInStage.length > 0 ? 'bg-[#F4F1EA]/40' : 'bg-transparent border-dashed'}`}>
                  {appsInStage.map(app => (
                    <div key={app.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#E8E4D9] active:scale-[0.98] transition-all group hover:border-gold/30">
                      <div className="flex justify-between items-start mb-5">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-lg">#{app.id.split('-')[1] || '001'}</span>
                        <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          {STAGES.indexOf(app.status) > 0 && (
                            <button onClick={() => handleRegress(app.id, app.status)} className="p-2 bg-gray-50 rounded-xl text-gray-400 border border-gray-100 active:bg-gray-200">
                              <ArrowRightLeft size={16} className="rotate-180" />
                            </button>
                          )}
                          {STAGES.indexOf(app.status) < STAGES.length - 1 && (
                            <button onClick={() => handleMove(app.id, app.status)} className="p-2 bg-gold/5 text-gold rounded-xl border border-gold/10 active:bg-gold/10">
                              <ArrowRightLeft size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{app.candidateName}</h4>
                      <p className="text-xs font-semibold text-gray-400 mb-6">{app.jobTitle}</p>
                      
                      <div className="flex justify-between items-center pt-5 border-t border-[#F9F8F3]">
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          <Clock size={14} className="text-gold/40" /> {app.updatedAt}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-black gold-accent italic">
                           <Target size={14} /> {app.matchingScore}% Match
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {appsInStage.length === 0 && (
                    <div className="py-14 lg:py-24 flex flex-col items-center justify-center rounded-[2rem] text-gray-300">
                      <div className="w-10 h-10 rounded-full border border-[#E8E4D9] flex items-center justify-center mb-3 opacity-30">
                        {/* Fix: Imported and used ChevronDown from lucide-react */}
                        <ChevronDown size={18} className="lg:-rotate-90" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">No active files</span>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
