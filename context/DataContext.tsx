
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Candidate, Employer, JobOpening, JobApplication, Invoice, ApplicationStatus } from '../types';
import { MOCK_CANDIDATES, MOCK_EMPLOYERS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_INVOICES } from '../constants';

interface DataContextType {
  candidates: Candidate[];
  employers: Employer[];
  jobs: JobOpening[];
  applications: JobApplication[];
  invoices: Invoice[];
  addCandidate: (c: Candidate) => void;
  deleteCandidate: (id: string) => void;
  addEmployer: (e: Employer) => void;
  deleteEmployer: (id: string) => void;
  addJob: (j: JobOpening) => void;
  deleteJob: (id: string) => void;
  applyForJob: (candidateId: string, jobId: string) => void;
  updateApplicationStatus: (appId: string, newStatus: ApplicationStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [employers, setEmployers] = useState<Employer[]>(MOCK_EMPLOYERS);
  const [jobs, setJobs] = useState<JobOpening[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(MOCK_APPLICATIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

  const addCandidate = (c: Candidate) => setCandidates(prev => [...prev, c]);
  const deleteCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    setApplications(prev => prev.filter(app => app.candidateId !== id));
  };

  const addEmployer = (e: Employer) => setEmployers(prev => [...prev, e]);
  const deleteEmployer = (id: string) => {
    setEmployers(prev => prev.filter(e => e.id !== id));
    setJobs(prev => prev.filter(j => j.employerId !== id));
  };

  const addJob = (j: JobOpening) => setJobs(prev => [...prev, j]);
  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    setApplications(prev => prev.filter(app => app.jobId !== id));
  };
  
  const applyForJob = (candidateId: string, jobId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    const job = jobs.find(j => j.id === jobId);
    
    if (candidate && job) {
      const newApp: JobApplication = {
        id: `APP-${Math.floor(Math.random() * 10000)}`,
        candidateId,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        jobId,
        jobTitle: job.title,
        matchingScore: Math.floor(Math.random() * 30) + 70, // Random score for demo
        status: ApplicationStatus.APPLIED,
        recruiterNotes: 'Application submitted via portal.',
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setApplications(prev => [...prev, newApp]);
    }
  };
  
  const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : app
    ));
  };

  return (
    <DataContext.Provider value={{ 
      candidates, employers, jobs, applications, invoices, 
      addCandidate, deleteCandidate, 
      addEmployer, deleteEmployer, 
      addJob, deleteJob, 
      applyForJob, updateApplicationStatus 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
