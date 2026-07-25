const API_BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sb:access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  } as Record<string, string>;
};

export type LearnPost = {
  id: string;
  title: string;
  content: string;
  type: 'tutorial' | 'blog' | 'video' | 'notes' | 'other' | string;
  url?: string;
  tags?: string[];
  author_email?: string;
  author_name?: string;
  created_at: string;
};

export const learnAPI = {
  async listPosts(): Promise<LearnPost[]> {
    const res = await fetch(`${API_BASE_URL}/learn/posts`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch learning posts');
    return res.json();
  },
  async getPost(id: string): Promise<LearnPost> {
    const res = await fetch(`${API_BASE_URL}/learn/posts/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch learning post');
    return res.json();
  },
  async createPost(payload: { title: string; content: string; type?: string; url?: string; tags?: string[] }): Promise<LearnPost> {
    const res = await fetch(`${API_BASE_URL}/learn/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create post');
    }
    return res.json();
  },
};
