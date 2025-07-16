import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Head from 'expo-router/head';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, TouchableOpacity } from 'react-native';

interface V2RayConfig {
  title: string;
  link: string;
}

export default function V2RayScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [configs, setConfigs] = useState<V2RayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchV2RayConfigs();
  }, []);

  const fetchV2RayConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('https://raw.githubusercontent.com/code3-dev/v-data/refs/heads/main/v2ray.json', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      setConfigs(data);
    } catch (err) {
      console.error('V2Ray config fetch error:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please check your internet connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load V2Ray configurations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyConfig = async (link: string, title: string) => {
    try {
      await Clipboard.setStringAsync(link);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied!', `${title} configuration copied to clipboard`);
    } catch {
      Alert.alert('Error', 'Failed to copy configuration');
    }
  };

  const handleShareConfig = async (link: string, title: string) => {
    try {
      await Share.share({
        message: `Fox2Net V2Ray Config - ${title}:\n${link}`,
        title: `Share ${title}`
      });
    } catch {
      Alert.alert('Error', 'Failed to share configuration');
    }
  };

  const getGradientColors = () => {
    return ['#667eea', '#764ba2', '#f093fb'] as const;
  };

  return (
    <ThemedView style={styles.container}>
      <Head>
        <title>V2Ray Configurations - Fox2Net</title>
      </Head>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.header}
      >
        <ThemedText type="title" style={styles.headerTitle}>
          V2Ray Configurations
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Free V2Ray configs for secure browsing
        </ThemedText>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {loading && (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.tint} />
              <ThemedText style={styles.loadingText}>Loading configurations...</ThemedText>
            </ThemedView>
          )}

          {error && (
            <ThemedView style={[
              styles.errorContainer,
              { 
                backgroundColor: '#f8fafc',
                borderColor: '#ef4444'
              }
            ]}>
              <IconSymbol name="info.circle" size={24} color="#ef4444" />
              <ThemedView style={styles.errorContent}>
                <ThemedText type="defaultSemiBold" style={[styles.errorTitle, { color: '#ef4444' }]}>
                  Error
                </ThemedText>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: colors.tint }]}
                  onPress={fetchV2RayConfigs}
                >
                  <ThemedText style={[styles.retryButtonText, { color: '#fff' }]}>
                    Retry
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          )}

          {!loading && !error && configs.length > 0 && (
            <>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Available Configurations
              </ThemedText>

              {configs.map((config, index) => (
                <ThemedView key={index} style={[
                  styles.configCard,
                  { 
                    backgroundColor: '#f8fafc',
                    borderColor: '#e2e8f0'
                  }
                ]}>
                  <ThemedView style={styles.configHeader}>
                    <ThemedView style={styles.configInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.configTitle}>
                        {config.title}
                      </ThemedText>
                      <ThemedView style={styles.statusContainer}>
                        <ThemedView style={[
                          styles.statusDot,
                          { backgroundColor: '#10b981' }
                        ]} />
                        <ThemedText style={[styles.statusText, { color: '#10b981' }]}>
                          Active
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                    <TouchableOpacity
                      style={[
                        styles.copyButton,
                        { backgroundColor: colors.tint }
                      ]}
                      onPress={() => handleCopyConfig(config.link, config.title)}
                    >
                      <ThemedText style={[styles.copyButtonText, { color: '#fff' }]}>
                        Copy
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>

                  <ThemedView style={styles.configActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: '#e2e8f0' }
                      ]}
                      onPress={() => handleShareConfig(config.link, config.title)}
                    >
                      <IconSymbol name="square.and.arrow.up" size={16} color={colors.icon} />
                      <ThemedText style={styles.actionButtonText}>Share</ThemedText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: '#e2e8f0' }
                      ]}
                      onPress={() => handleCopyConfig(config.link, config.title)}
                    >
                      <IconSymbol name="doc.on.doc" size={16} color={colors.icon} />
                      <ThemedText style={styles.actionButtonText}>Copy Config</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              ))}
            </>
          )}

          {!loading && !error && configs.length === 0 && (
            <ThemedView style={[
              styles.emptyContainer,
              { 
                backgroundColor: '#f8fafc',
                borderColor: '#e2e8f0'
              }
            ]}>
              <IconSymbol name="info.circle" size={48} color={colors.icon} />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                No Configurations Available
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                No V2Ray configurations found. Please try again later.
              </ThemedText>
            </ThemedView>
          )}

          <ThemedView style={[
            styles.infoCard,
            { 
              backgroundColor: '#f1f5f9',
              borderColor: '#cbd5e1'
            }
          ]}>
            <IconSymbol name="info.circle" size={24} color={colors.tint} />
            <ThemedView style={styles.infoContent}>
              <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                How to use V2Ray
              </ThemedText>
              <ThemedText style={styles.infoText}>
                1. Copy the configuration link{'\n'}
                2. Open your V2Ray client app{'\n'}
                3. Import the configuration{'\n'}
                4. Connect to start browsing securely
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  errorContent: {
    flex: 1,
    marginLeft: 12,
  },
  errorTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  configCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  configHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  configInfo: {
    flex: 1,
  },
  configTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  copyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  configActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 