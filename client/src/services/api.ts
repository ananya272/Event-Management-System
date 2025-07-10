const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('eventManagementToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle validation errors with more detail
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
        throw new Error(errorMessages || data.message || 'Validation failed');
      }
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    return this.handleResponse<T>(response);
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'organizer' | 'attendee';
  }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async getOrganizers() {
    return this.request<{ organizers: any[] }>('/auth/organizers');
  }

  // Events
  async getEvents(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{ events: any[]; pagination: any }>(
      `/events${query ? `?${query}` : ''}`
    );
  }

  async getEvent(id: string) {
    return this.request<{ event: any; bookingStats: any; feedbackStats: any }>(
      `/events/${id}`
    );
  }

  async createEvent(eventData: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    capacity: number;
    organizerId: string;
  }) {
    return this.request<{ event: any }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: Partial<any>) {
    return this.request<{ event: any }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string) {
    console.log('ApiService deleteEvent - id:', id); // Debug log
    if (!id) {
      throw new Error('Event ID is required');
    }
    try {
      const response = await this.request<{}>(`/events/${id}`, {
        method: 'DELETE',
      });
      console.log('ApiService deleteEvent - response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('ApiService deleteEvent - error:', error); // Debug log
      throw error;
    }
  }

  async markEventComplete(id: string, data: { status: string; feedback?: string }) {
    return this.request<{ event: any }>(`/events/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Bookings
  async getBookings(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{ bookings: any[]; pagination: any }>(
      `/bookings${query ? `?${query}` : ''}`
    );
  }

  async getBooking(id: string) {
    return this.request<{ booking: any }>(`/bookings/${id}`);
  }

  async createBooking(bookingData: {
    eventId: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone: string;
  }) {
    return this.request<{ booking: any }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(id: string) {
    return this.request<{ booking: any }>(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async getEventBookings(eventId: string, params?: {
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{ bookings: any[]; pagination: any }>(
      `/bookings/event/${eventId}${query ? `?${query}` : ''}`
    );
  }

  // Feedback
  async getFeedback(params?: {
    eventId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.eventId) searchParams.append('eventId', params.eventId);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{ feedback: any[]; pagination: any }>(
      `/feedback${query ? `?${query}` : ''}`
    );
  }

  async getFeedbackById(id: string) {
    return this.request<{ feedback: any }>(`/feedback/${id}`);
  }

  async submitFeedback(feedbackData: {
    eventId: string;
    rating: number;
    comment: string;
    type: 'feedback' | 'issue';
  }) {
    return this.request<{ feedback: any }>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async getEventFeedback(eventId: string, params?: {
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{ feedback: any[]; stats: any; pagination: any }>(
      `/feedback/event/${eventId}${query ? `?${query}` : ''}`
    );
  }

  async deleteFeedback(id: string) {
    return this.request<{}>(`/feedback/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unread?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.unread) searchParams.append('unread', params.unread.toString());

    const query = searchParams.toString();
    return this.request<{
      notifications: any[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>(`/notifications${query ? `?${query}` : ''}`);
  }

  async getUnreadCount() {
    return this.request<{ count: number }>('/notifications/unread-count');
  }

  async markNotificationRead(id: string) {
    return this.request<{ notification: any }>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request<{}>('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string) {
    return this.request<{}>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async clearAllNotifications() {
    return this.request<{}>('/notifications/clear-all', {
      method: 'DELETE',
    });
  }

  // Users
  async getProfile() {
    return this.request<{ user: any }>('/users/profile');
  }

  async updateProfile(profileData: { name?: string; email?: string }) {
    return this.request<{ user: any }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request<{}>('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getAllUsers(params?: {
    role?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.append('role', params.role);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{ users: any[]; pagination: any }>(
      `/users${query ? `?${query}` : ''}`
    );
  }

  async getUser(id: string) {
    return this.request<{ user: any }>(`/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<any>) {
    return this.request<{ user: any }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<{}>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async unblockUser(id: string) {
    return this.request<{ user: any }>(`/users/${id}/unblock`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();