const API_KEY = 'e4833befa7f086b';
const API_SECRET = '8f84999ea068bc5'; // Ideally, put this in a .env file later

// We use '/api' here because the vite proxy (above) will forward it to the cloud
const BASE_URL = '/api'; 

const getHeaders = () => ({
  'Authorization': `token ${API_KEY}:${API_SECRET}`,
  'Content-Type': 'application/json',
});

export const frappeService = {
  /**
   * Fetch all Job Openings (Positions)
   */
  getJobOpenings: async () => {
    try {
      // We only need the ID (name) and the Title to show in the dropdown
      const fields = JSON.stringify(["name", "job_title", "company", "status"]);
      const filters = JSON.stringify([["status", "=", "Open"]]); // Only get Open jobs
      
      const response = await fetch(
        `${BASE_URL}/resource/Job Opening?fields=${fields}&filters=${filters}`, 
        { headers: getHeaders(), cache: 'no-cache' }
      );
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  },

  /**
   * Fetch all Candidates (Job Applicants)
   */
  getCandidates: async () => {
    try {
      const fields = JSON.stringify(["name", "applicant_name", "status", "email_id", "phone_number", "job_title"]);
      const response = await fetch(`${BASE_URL}/resource/Job Applicant?fields=${fields}`, { 
        headers: getHeaders(), cache: 'no-cache'
      });

      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }
  },

  /**
   * Add a New Candidate
   */
  createCandidate: async (candidateData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/resource/Job Applicant`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          applicant_name: candidateData.applicant_name || candidateData.name || `${candidateData.firstName} ${candidateData.lastName}`,
          email_id: candidateData.email_id || candidateData.email,
          job_title: candidateData.job_title, // Must match an existing Job Opening name
          location: candidateData.location,
          status: "Open"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create candidate: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating candidate:", error);
      throw error;
    }
  },

  /**
   * Update a Candidate (Job Applicant)
   */
  updateCandidate: async (id: string, data: any) => {
    try {
      const response = await fetch(`${BASE_URL}/resource/Job Applicant/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update candidate: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error updating candidate:", error);
      throw error;
    }
  },

  /**
   * Create a New Job Opening
   */
  createJobOpening: async (jobData: any) => {
    try {
      // 1. Fetch a default company (required by Frappe HRMS)
      const companyResponse = await fetch(`${BASE_URL}/resource/Company?limit_page_length=1`, {
        headers: getHeaders()
      });
      const companyResult = await companyResponse.json();
      const defaultCompany = companyResult.data?.[0]?.name;

      if (!defaultCompany) {
        throw new Error("No Company record found in the system. Please create a Company first.");
      }

      // 2. Ensure Designation exists (required by Job Opening)
      // We attempt to create it; if it exists (409), we proceed.
      await fetch(`${BASE_URL}/resource/Designation`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ designation_name: jobData.title })
      }).catch(() => {}); // Ignore errors if designation already exists

      const response = await fetch(`${BASE_URL}/resource/Job Opening`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          job_title: jobData.title,
          designation: jobData.title, // Link to Designation
          company: defaultCompany,    // Link to Company
          status: "Open",
          // client: jobData.employerId, // Removed as it causes issues if field doesn't exist
          route: `${jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}-${Math.floor(Math.random() * 1000)}` // Ensure unique route
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create job opening: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating job opening:", error);
      throw error;
    }
  },

  /**
   * Fetch all Clients (Employers)
   */
  getClients: async () => {
    try {
      // Switching to 'Customer' as 'Client' Doctype is broken on the backend
      const fields = JSON.stringify(["name", "customer_name", "email_id", "mobile_no", "primary_address"]);
      const response = await fetch(`${BASE_URL}/resource/Customer?fields=${fields}`, { 
        headers: getHeaders(), cache: 'no-cache'
      });

      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      
      // Map standard Customer fields to your app's Client interface
      return (data.data || []).map((c: any) => ({
        name: c.name,
        client_name: c.customer_name,
        contact_person: c.customer_name, // Fallback as Customer doesn't have a single contact field
        email_id: c.email_id,
        mobile_number: c.mobile_no,
        address: c.primary_address,
        industry: 'General', // Default
        feePercentage: 15    // Default
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
  },

  /**
   * Create a New Client
   */
  createClient: async (clientData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/resource/Customer`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          customer_name: clientData.companyName,
          customer_type: "Company",
          customer_group: "All Customer Groups",
          territory: "All Territories",
          email_id: clientData.email,
          mobile_no: clientData.phone
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create client: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  }
};