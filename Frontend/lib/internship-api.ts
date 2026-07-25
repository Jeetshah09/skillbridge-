// Internship API service
const API_BASE_URL = 'http://localhost:8000';

export interface Internship {
  id: string;
  title: string;
  description: string;
  company_name: string;
  mentor_name: string;
  mentor_email?: string;
  mentor_year?: string;
  mentor_department?: string;
  duration_weeks: number;
  stipend: number;
  max_applicants: number;
  current_applicants: number;
  required_skills: string[];
  preferred_skills: string[];
  difficulty_level: string;
  work_type: string;
  location?: string;
  posted_date?: string;
  application_deadline: string;
  start_date?: string;
  end_date?: string;
  status: string;
  additional_info?: string;
  benefits: string[];
}

export interface Application {
  id: string;
  internship_id: string;
  internship_title?: string;
  student_email: string;
  student_name: string;
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  github_url?: string;
  status: string;
  applied_date?: string;
  reviewed_by?: string;
  reviewed_date?: string;
  review_notes?: string;
  motivation?: string;
  relevant_experience?: string;
}

export interface CreateInternshipData {
  title: string;
  description: string;
  company_name: string;
  mentor_name: string;
  mentor_year?: string;
  mentor_department?: string;
  duration_weeks: number;
  stipend: number;
  max_applicants: number;
  required_skills: string[];
  preferred_skills: string[];
  difficulty_level: string;
  work_type: string;
  location?: string;
  application_deadline: string;
  start_date?: string;
  additional_info?: string;
  benefits: string[];
}

export interface ApplyInternshipData {
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  github_url?: string;
  motivation?: string;
  relevant_experience?: string;
}

export interface InternshipFilters {
  status?: string;
  difficulty?: string;
  work_type?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('sb:access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Functions
export const internshipAPI = {
  // Get all internships with optional filtering
  async getInternships(filters: InternshipFilters = {}): Promise<Internship[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/internships/?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch internships');
    }

    return response.json();
  },

  // Get a specific internship by ID
  async getInternship(id: string): Promise<Internship> {
    const response = await fetch(`${API_BASE_URL}/internships/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch internship');
    }

    return response.json();
  },

  // Create a new internship (HR/Admin only)
  async createInternship(data: CreateInternshipData): Promise<{ message: string; internship_id: string }> {
    const response = await fetch(`${API_BASE_URL}/internships/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create internship');
    }

    return response.json();
  },

  // Update an internship (HR/Admin only)
  async updateInternship(id: string, data: Partial<CreateInternshipData>): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/internships/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update internship');
    }

    return response.json();
  },

  // Delete an internship (HR/Admin only)
  async deleteInternship(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/internships/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete internship');
    }

    return response.json();
  },

  // Apply for an internship (Students only)
  async applyForInternship(internshipId: string, data: ApplyInternshipData): Promise<{ message: string; application_id: string }> {
    const response = await fetch(`${API_BASE_URL}/internships/${internshipId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to apply for internship');
    }

    return response.json();
  },

  // Get current user's applications
  async getMyApplications(): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/internships/applications/my`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch applications');
    }

    return response.json();
  },

  // Get applications for a specific internship (HR/Admin only)
  async getInternshipApplications(internshipId: string): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/internships/${internshipId}/applications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch applications');
    }

    return response.json();
  },

  // Update application status (HR/Admin only)
  async updateApplication(applicationId: string, data: { status?: string; review_notes?: string }): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/internships/applications/${applicationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update application');
    }

    return response.json();
  },
};
