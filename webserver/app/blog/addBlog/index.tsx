'use client';
import { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { storage } from '@/services/storage';

export default function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    try {
      await storage.addPost({ title, content });
      console.log("提交博客成功");
      router.back();
    } catch (error) {
      console.error('提交博客失败:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>写新博客</ThemedText>
      
      <View style={styles.inputGroup}>
        <ThemedText>标题：</ThemedText>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText>内容：</ThemedText>
        <TextInput
          value={content}
          onChangeText={setContent}
          style={[styles.input, styles.contentInput]}
          multiline
          placeholderTextColor="#666"
        />
      </View>

      <Pressable onPress={handleSubmit} style={styles.submitButton}>
        <ThemedText style={styles.buttonText}>提交</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    color: '#000',
    backgroundColor: '#fff',
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});
