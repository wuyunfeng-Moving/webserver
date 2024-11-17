import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_KEY = 'blog_posts';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export const storage = {
  async getPosts(): Promise<BlogPost[]> {
    try {
      const posts = await AsyncStorage.getItem(POSTS_KEY);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  async addPost(post: Omit<BlogPost, 'id' | 'createdAt'>): Promise<BlogPost> {
    try {
      const posts = await this.getPosts();
      const newPost = {
        ...post,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      console.log("newPost", newPost);
      
      posts.push(newPost);
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      return newPost;
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }
}; 