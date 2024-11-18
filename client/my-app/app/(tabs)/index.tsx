import { useState } from 'react';
import { Image, StyleSheet, TextInput, Button, FlatList, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { api } from '@/services/api';

export default function HomeScreen() {
  const [message, setMessage] = useState('');
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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* 消息发送部分 */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Messages</ThemedText>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
        />
        <Button title="Send Message" onPress={handleSendMessage} />
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedText>{item.content}</ThemedText>
          )}
        />
      </ThemedView>

      {/* 博客列表部分 */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Blog Posts</ThemedText>
        <FlatList
          data={blogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedView style={styles.blogItem}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText>{item.content}</ThemedText>
              <ThemedText style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleDateString()}
              </ThemedText>
            </ThemedView>
          )}
        />
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
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
