import { Image, StyleSheet, Platform, Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ExternalLink } from '@/components/ExternalLink';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#8B4513', dark: '#2F1810' }}
      headerImage={
        <Image
          source={require('@/assets/images/57.jpeg')}
          style={styles.podcastLogo}
        />
      }
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">我的个人主页</ThemedText>
      </ThemedView>

      <ThemedView style={styles.profileContainer}>
        {/* <Image
          source={require('@/assets/images/avatar.png')}
          style={styles.avatar}
        /> */}
        <ThemedView style={styles.profileInfo}>
          <ThemedText type="subtitle">我目前正在做的项目</ThemedText>
          <ExternalLink href="https://github.com/wuyunfeng-Moving/localsocialforkids">
            <ThemedText type="defaultSemiBold">localsocialforkids</ThemedText>
          </ExternalLink>
          <ThemedText>一个面向儿童的社交平台</ThemedText>
          <ExternalLink href="https://github.com/wuyunfeng-Moving/webserver">
            <ThemedText type="defaultSemiBold">webserver</ThemedText>
          </ExternalLink>
          <ThemedText>一个用于管理本地社交平台的web服务端</ThemedText>
        </ThemedView>
        <View style={styles.profileInfo}>
          <ExternalLink href="https://github.com/wuyunfeng-Moving/blog">
            <ThemedText type="defaultSemiBold">我的博客</ThemedText>
          </ExternalLink>
          <ThemedText>一个用于记录生活和技术的博客</ThemedText>
        </View>
        <Pressable onPress={() => router.push('/blog')}>
          <ThemedText type="defaultSemiBold">本地博客</ThemedText>
        </Pressable>
      </ThemedView>

      
      
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  episodeContainer: {
    gap: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  podcastLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    position: 'absolute',
    resizeMode: 'contain',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
});
