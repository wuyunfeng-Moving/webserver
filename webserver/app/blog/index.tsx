import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { storage, BlogPost } from '@/services/storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  async function loadPosts() {
    const loadedPosts = await storage.getPosts();
    setPosts(loadedPosts);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText type="title">博客列表</ThemedText>
          <Pressable 
            onPress={() => router.push('/blog/addBlog')}
            style={styles.addButton}
          >
            <ThemedText style={styles.buttonText}>写新博客</ThemedText>
          </Pressable>
        </View>
        
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <ThemedText type="subtitle">{post.title}</ThemedText>
              <ThemedText>{post.content}</ThemedText>
              <ThemedText style={styles.date}>
                {new Date(post.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  postsContainer: {
    gap: 16,
  },
  postCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
});
