import { Message, Blog } from '@/shared/types';

// const API_URL = 'http://114.55.64.28:3000';
const API_URL = 'http://localhost:3000';
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
    create: async (blog: { title: string; content: string }): Promise<Blog> => {
      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });
      const data = await response.json();
      return data.data;
    },
  },
}; 