const API_BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sb:access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  } as Record<string, string>;
};

export interface AdminStats {
  total_users: number;
  total_internships: number;
  active_internships: number;
  total_applications: number;
}

export interface AdminUserItem {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  company_name?: string;
  academic_year?: string;
  department?: string;
}

export interface AdminInternshipItem {
  id: string;
  title: string;
  company_name: string;
  status: string;
  mentor_email?: string;
  posted_date?: string;
  location?: string;
  duration?: string;
  stipend?: string;
  skills?: string;
  deadline?: string;
}

export interface AdminApplicationItem {
  id: string;
  internship_id: string;
  student_email: string;
  student_name: string;
  status: string;
  applied_date?: string;
}

export const adminAPI = {
  async getStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },

  async updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/applications/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update application status');
    return res.json();
  },

  async deleteApplication(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete application');
    return res.json();
  },

  async rejectInternship(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/internships/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to reject internship');
    return res.json();
  },

  async updateInternship(id: string, payload: Partial<AdminInternshipItem>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/internships/${id}/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update internship');
    return res.json();
  },

  async getInternship(id: string): Promise<AdminInternshipItem & { description?: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/internships/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load internship');
    return res.json();
  },

  async listUsers(role?: string): Promise<AdminUserItem[]> {
    const url = new URL(`${API_BASE_URL}/admin/users`);
    if (role) url.searchParams.set('role', role);
    const res = await fetch(url.toString(), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  async deleteUser(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  async listInternships(status?: string): Promise<AdminInternshipItem[]> {
    const url = new URL(`${API_BASE_URL}/admin/internships`);
    if (status) url.searchParams.set('status', status);
    const res = await fetch(url.toString(), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load internships');
    return res.json();
  },

  async approveInternship(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/internships/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to approve internship');
    return res.json();
  },

  async removeInternship(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/internships/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove internship');
    return res.json();
  },

  async listApplications(status?: string): Promise<AdminApplicationItem[]> {
    const url = new URL(`${API_BASE_URL}/admin/applications`);
    if (status) url.searchParams.set('status', status);
    const res = await fetch(url.toString(), { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load applications');
    return res.json();
  },

  async broadcastNotification(payload: { title: string; message: string; target?: 'all' | 'role' | 'users'; role?: string; user_ids?: string[]; }): Promise<{ count: number }> {
    const res = await fetch(`${API_BASE_URL}/admin/notifications/broadcast`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to send notifications');
    return res.json();
  },
};
