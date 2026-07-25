const API_BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sb:access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  } as Record<string, string>;
};

export type HrProfile = {
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  role: string;
};

export type HrStats = {
  total_posts: number;
  active_posts: number;
  expired_posts: number;
  applications_received: number;
  approved_applications: number;
};

export type HrPostItem = {
  id: string;
  title: string;
  company_name?: string;
  status?: string;
  posted_date?: string;
};

export type HrApplicationItem = {
  id: string;
  internship_id: string;
  internship_title?: string;
  student_name?: string;
  status: string;
  applied_date?: string;
};

export const hrAPI = {
  async profile(): Promise<HrProfile> {
    const res = await fetch(`${API_BASE_URL}/hr/profile`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch HR profile');
    return res.json();
  },
  async internshipStats(): Promise<HrStats> {
    const res = await fetch(`${API_BASE_URL}/hr/internships/stats`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch HR stats');
    return res.json();
  },
  async recentInternships(limit = 5): Promise<HrPostItem[]> {
    const res = await fetch(`${API_BASE_URL}/hr/internships?limit=${limit}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch HR internships');
    return res.json();
  },
  async recentApplications(limit = 5): Promise<HrApplicationItem[]> {
    const res = await fetch(`${API_BASE_URL}/hr/applications?limit=${limit}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch HR applications');
    return res.json();
  },
};
