import { useState, useMemo } from 'react';
import { Image, StyleSheet, TextInput, Button, FlatList, View, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { api } from '@/app/services/api';

export default function HomeScreen() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const queryClient = useQueryClient();

  // 查询消息列表
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: api.messages.getAll,
  });

  // 查询博客列表
  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: api.blogs.getAll,
  });

  // 发送消息的 mutation
  const { mutate: sendMessage } = useMutation({
    mutationFn: api.messages.create,
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages'], (old: any) => [...old, newMessage]);
      setMessage('');
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  const handleAdminLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  const groupedBlogs = useMemo(() => {
    const groups: Record<string, Blog[]> = {};
    blogs.forEach(blog => {
      if (!groups[blog.category]) {
        groups[blog.category] = [];
      }
      groups[blog.category].push(blog);
    });
    return groups;
  }, [blogs]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/pageheader.jpeg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">欢迎光临，这是我个人网站</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedText type="default">
          我叫吴云峰，是一个小镇做题家出生的计算机应用开发者，个人兴趣是软件开发、商业投资、历史研究、家庭关系等。
          这个网站会汇总记录我的一些想法、思考、研究、实践等。
      </ThemedText>

      {/* 博客列表部分 */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.blogSectionTitle}>博客文章</ThemedText>
        {Object.entries(groupedBlogs).map(([category, categoryBlogs]) => (
          <View key={category} style={styles.categorySection}>
            <ThemedText type="defaultBold" style={styles.categoryTitle}>
              {category}
            </ThemedText>
            <FlatList
              data={categoryBlogs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ThemedView style={styles.blogItem}>
                  <TouchableOpacity onPress={() => router.push(`../blogs/${item.id}`)}>
                    <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                  </TouchableOpacity>
                  <ThemedText style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </ThemedText>
                </ThemedView>
              )}
            />
          </View>
        ))}
      </ThemedView>

      {/* 底部操作区 */}
      <ThemedView style={styles.bottomActions}>
        {username ? (
          <>
            <ThemedView style={styles.userContainer}>
              <ThemedText>当前用户：{username}</ThemedText>
              <Button title="退出登录" onPress={handleLogout} />
            </ThemedView>
            <Button 
              title="创建博客" 
              onPress={() => router.push('../blogs/writeblogs')} 
            />
          </>
        ) : (
          <Button title="管理员登录" onPress={handleAdminLogin} />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    marginTop: 20,
    gap: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  blogItem: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    gap: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  reactLogo: {
    height: 250,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
    resizeMode: 'cover',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categorySection: {
    marginTop: 16,
  },
  categoryTitle: {
    fontSize: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bottomActions: {
    marginTop: 32,
    marginBottom: 20,
    gap: 16,
    paddingHorizontal: 16,
  },
  blogSectionTitle: {
    fontSize: 14,
  },
});
