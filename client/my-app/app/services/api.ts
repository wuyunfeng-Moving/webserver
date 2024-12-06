import { Message, Blog, User } from '@/shared/types';

// 使用环境变量
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
// const API_URL ='http://localhost:3000';

export const api = {
  messages: {
    getAll: async (): Promise<Message[]> => {
      const response = await fetch(`${API_URL}/messages`);
      const data = await response.json();
      return data.data;
    },
    create: async (content: string): Promise<Message> => {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      return data.data;
    },
  },
  blogs: {
    getAll: async (): Promise<Blog[]> => {
      const response = await fetch(`${API_URL}/blogs`);
      const data = await response.json();
      return data.data;
    },
    getOne: async (id: string) => {
      const response = await fetch(`${API_URL}/blogs/${id}`);
      const data = await response.json();
      return data.data;
    },
    create: async (blog: { title: string; content: string }): Promise<Blog> => {
      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });
      const data = await response.json();
      return data.data;
    },
    update: async (id: string, data: { title: string; content: string; category: string }) => {
      const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.data;
    },
  },
  users: {
    register: async (userData: { 
      username: string; 
      password: string; 
      email: string; 
    }): Promise<Omit<User, 'password'>> => {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(data.error);
      }
      return data.data;
    },
  },
  auth: {
    login: async (credentials: { 
      username: string; 
      password: string; 
    }): Promise<{ token: string; user: Omit<User, 'password'> }> => {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(data.error);
      }
      return data.data;
    },
  },
  utils: {
    fetchUrlTitle: async (url: string): Promise<{ title: string | null }> => {
      try {
        // 通过我们自己的后端代理来获取标题
        const response = await fetch(`${API_URL}/utils/fetch-title`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch title');
        }

        const data = await response.json();
        return {
          title: data.title || null
        };
      } catch (error) {
        console.error('Error fetching title:', error);
        return { title: null };
      }
    },
  },
}; 