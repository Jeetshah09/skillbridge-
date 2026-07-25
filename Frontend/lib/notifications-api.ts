const API_BASE_URL = 'http://localhost:8000';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'system' | 'application_status' | 'new_application' | 'reminder';
  title: string;
  message: string;
  href?: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sb:access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const notificationsAPI = {
  async listMy(): Promise<NotificationItem[]> {
    const response = await fetch(`${API_BASE_URL}/notifications/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to load notifications');
    }
    return response.json();
  },

  async markAllRead(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to mark notifications as read');
    }
    return response.json();
  },

  async markOneRead(notificationId: string): Promise<NotificationItem> {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ read: true }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update notification');
    }
    return response.json();
  },
};


