import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, StyleSheet, TextInput, Button, View, FlatList, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { api } from '@/app/services/api';

import { CATEGORIES } from '../blogs/writeblogs';

export default function BlogPost() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const queryClient = useQueryClient();
  const username = localStorage.getItem('username');

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => api.blogs.getOne(id as string),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { title: string; content: string; category: string }) =>
      api.blogs.update(id as string, data),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blog', id], updatedBlog);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (blog) {
      setEditTitle(blog.title);
      setEditContent(blog.content);
      setEditCategory(blog.category);
    }
  }, [blog]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      title: editTitle,
      content: editContent,
      category: editCategory,
    });
  };

  const handleCancel = () => {
    setEditTitle(blog?.title || '');
    setEditContent(blog?.content || '');
    setEditCategory(blog?.category || '');
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>加载中...</ThemedText>
      </ThemedView>
    );
  }

  if (!blog) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>未找到博客文章</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="博客标题"
            />
            <View style={styles.categoryContainer}>
              <FlatList
                horizontal
                data={CATEGORIES}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      editCategory === item && styles.categoryItemSelected,
                    ]}
                    onPress={() => setEditCategory(item)}
                  >
                    <ThemedText
                      style={[
                        styles.categoryText,
                        editCategory === item && styles.categoryTextSelected,
                      ]}
                    >
                      {item}
                    </ThemedText>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
            <TextInput
              style={[styles.input, styles.contentInput]}
              value={editContent}
              onChangeText={setEditContent}
              placeholder="博客内容"
              multiline
            />
            <View style={styles.buttonContainer}>
              <Button title="保存" onPress={handleSave} />
              <Button title="取消" onPress={handleCancel} color="gray" />
            </View>
          </>
        ) : (
          <>
            <ThemedText type="title" style={styles.title}>
              {blog.title}
            </ThemedText>
            <View style={styles.metaContainer}>
              <ThemedText style={styles.category}>{blog.category}</ThemedText>
              <ThemedText style={styles.date}>
                {new Date(blog.timestamp).toLocaleDateString()}
              </ThemedText>
            </View>
            <ThemedText style={styles.blogContent}>{blog.content}</ThemedText>
            {username && (
              <Button title="编辑" onPress={handleEdit} />
            )}
          </>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    color: '#666',
    fontSize: 14,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
  blogContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
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
