import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, FlatList, View, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { api } from '@/app/services/api';

export const CATEGORIES = [
  '技术',
  '生活',
  '思考',
  '投资',
  '其他'
];

export default function BlogsScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [url, setUrl] = useState('');
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
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
      setCategory(CATEGORIES[0]);
    },
  });

  const handleCreateBlog = () => {
    if (title.trim() && content.trim()) {
      createBlog({ title, content, category });
    }
  };

  // 检测文本是否包含URL的函数
  const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
  };

  // 修改 content 的处理函数
  const handleContentChange = async (text: string) => {
    setContent(text);
    const url = extractUrl(text);
    
    if (url) {
      setIsLoadingTitle(true);
      try {
        const response = await api.utils.fetchUrlTitle(url);
        if (response.title) {
          // 替换内容中的URL为标题
          const newContent = text.replace(url, response.title);
          setContent(newContent);
        }
      } catch (error) {
        console.error('Failed to fetch title:', error);
      } finally {
        setIsLoadingTitle(false);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">写博客</ThemedText>
      
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Blog title"
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        value={content}
        onChangeText={handleContentChange}
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
  categoryContainer: {
    marginVertical: 10,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryItemSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    color: '#666',
  },
  categoryTextSelected: {
    color: '#fff',
  },
}); 