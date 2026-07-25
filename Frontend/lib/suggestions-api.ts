const API_BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sb:access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  } as Record<string, string>;
};

export interface SuggestPayload {
  skills: string[];
  preferred_work_type?: string;
  difficulty?: string;
  limit?: number;
}

export interface ScoredInternship {
  id: string;
  title: string;
  company_name: string;
  match: number;
  reason: string;
  duration_weeks: number;
  work_type: string;
  difficulty_level: string;
}

export interface AnalyzeResponse {
  skills: string[];
  experience: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  tips: string[];
  recommendations?: { skillGaps?: string[] };
  source?: string;
}

export const suggestionsAPI = {
  async suggestInternships(payload: SuggestPayload): Promise<ScoredInternship[]> {
    const res = await fetch(`${API_BASE_URL}/suggestions/internships`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to get suggestions');
    }
    return res.json();
  },

  async analyzeResume(file: File): Promise<AnalyzeResponse> {
    const fd = new FormData();
    fd.append('file', file);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sb:access_token') : null;
    const res = await fetch(`${API_BASE_URL}/suggestions/analyze-resume`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      } as Record<string, string>,
      body: fd,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze resume');
    }
    return res.json();
  },
};
