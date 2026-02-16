
export enum CandidateStatus {
  NEW = 'New',
  SCREENED = 'Screened',
  SHORTLISTED = 'Shortlisted',
  INTERVIEWED = 'Interviewed',
  OFFERED = 'Offered',
  PLACED = 'Placed',
  REJECTED = 'Rejected'
}

export enum JobStatus {
  DRAFT = 'Draft',
  OPEN = 'Open',
  CLOSED = 'Closed'
}

export enum ApplicationStatus {
  APPLIED = 'Applied',
  SHORTLISTED = 'Shortlisted',
  INTERVIEW_SCHEDULED = 'Interview Scheduled',
  INTERVIEWED = 'Interviewed',
  OFFERED = 'Offered',
  REJECTED = 'Rejected',
  PLACED = 'Placed'
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  cvUrl?: string;
  skills: string[];
  yearsOfExperience: number;
  currentSalary: number;
  expectedSalary: number;
  status: CandidateStatus;
  completeness: number;
}

export interface Employer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  contractType: string;
  feePercentage: number;
  status: 'Active' | 'Inactive';
}

export interface JobOpening {
  id: string;
  title: string;
  employerId: string;
  employerName: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Remote';
  salaryRange: string;
  experienceRequired: number;
  requiredSkills: string[];
  description: string;
  status: JobStatus;
  positions: number;
  deadline: string;
}

export interface JobApplication {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  matchingScore: number;
  status: ApplicationStatus;
  recruiterNotes: string;
  employerFeedback?: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  employerName: string;
  placementName: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid';
  date: string;
}
