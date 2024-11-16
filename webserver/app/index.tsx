import { Image, StyleSheet, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#8B4513', dark: '#2F1810' }}
      // headerImage={
      //   <Image
      //     source={require('@/assets/images/podcast-hero.png')}
      //     style={styles.podcastLogo}
      //   />
      // }
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">我的播客</ThemedText>
      </ThemedView>

      <ThemedView style={styles.profileContainer}>
        {/* <Image
          source={require('@/assets/images/avatar.png')}
          style={styles.avatar}
        /> */}
        <ThemedView style={styles.profileInfo}>
          <ThemedText type="subtitle">播主名称</ThemedText>
          <ThemedText>科技领域播客主持人</ThemedText>
          <ThemedText type="defaultSemiBold">已发布 42 集</ThemedText>
        </ThemedView>
      </ThemedView>

      <Pressable onPress={() => router.push('/latest-episode')}>
        <ThemedView style={styles.episodeContainer}>
          <ThemedText type="subtitle">最新一集</ThemedText>
          <ThemedText>
            探讨人工智能的未来发展
          </ThemedText>
          <ThemedText type="defaultSemiBold">
            45分钟 · 2024年3月20日
          </ThemedText>
        </ThemedView>
      </Pressable>

      <Pressable onPress={() => router.push('/popular')}>
        <ThemedView style={styles.episodeContainer}>
          <ThemedText type="subtitle">热门推荐</ThemedText>
          <ThemedText>
            查看最受欢迎的播客内容
          </ThemedText>
        </ThemedView>
      </Pressable>

      <Pressable onPress={() => router.push('/categories')}>
        <ThemedView style={styles.episodeContainer}>
          <ThemedText type="subtitle">播客分类</ThemedText>
          <ThemedText>
            科技 · 文化 · 教育 · 娱乐
          </ThemedText>
        </ThemedView>
      </Pressable>
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
    height: 200,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    resizeMode: 'cover',
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
