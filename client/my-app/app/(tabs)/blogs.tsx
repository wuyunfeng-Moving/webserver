import { useState } from 'react';
import { StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { api } from '@/services/api';

export default function BlogsScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  // 查询博客列表
  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: api.blogs.getAll,
  });

  // 发布博客的 mutation
  const { mutate: createBlog } = useMutation({
    mutationFn: api.blogs.create,
    onSuccess: (newBlog) => {
      // 更新缓存中的博客列表
      queryClient.setQueryData(['blogs'], (old: any) => [...old, newBlog]);
      setTitle('');
      setContent('');
    },
  });

  const handleCreateBlog = () => {
    if (title.trim() && content.trim()) {
      createBlog({ title, content });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Blogs</ThemedText>
      
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Blog title"
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        value={content}
        onChangeText={setContent}
        placeholder="Blog content"
        multiline
      />
      <Button title="Create Blog" onPress={handleCreateBlog} />

      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.blogItem}>
            <ThemedText type="subtitle">{item.title}</ThemedText>
            <ThemedText>{item.content}</ThemedText>
            <ThemedText style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  blogItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
}); 