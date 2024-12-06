import { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { api } from '@/app/services/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isPending } = useMutation({
    mutationFn: api.auth.login,
    onSuccess: (data) => {
      console.log('Login response:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      Alert.alert('Success', 'Login successful!');
      router.replace('/');
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleLogin = () => {
    console.log('username:', username);
    console.log('password:', password);
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    login({ username, password });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>
      
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password123"
        secureTextEntry
      />
      
      <Button 
        title={isPending ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isPending}
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
    borderRadius: 4,
    paddingHorizontal: 8,
  },
}); 