import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Head from 'expo-router/head';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, TouchableOpacity } from 'react-native';

interface ProxyServer {
  server: string;
  port: number;
  secret: string;
  url: string;
}

export default function TelegramProxyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [proxyServers, setProxyServers] = useState<ProxyServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseProxyUrl = (url: string): ProxyServer | null => {
    try {
      const urlObj = new URL(url);
      const server = urlObj.searchParams.get('server');
      const port = urlObj.searchParams.get('port');
      const secret = urlObj.searchParams.get('secret');

      if (!server || !port || !secret) {
        return null;
      }

      return {
        server,
        port: parseInt(port, 10),
        secret,
        url
      };
    } catch {
      return null;
    }
  };

  const fetchProxyServers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('https://raw.githubusercontent.com/code3-dev/v-data/refs/heads/main/proxy.txt', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      // Parse the text to extract proxy URLs
      const urls = text.split(/\s+/).filter(url => url.trim().startsWith('https://t.me/proxy'));
      
      const parsedProxies: ProxyServer[] = [];
      urls.forEach(url => {
        const proxy = parseProxyUrl(url.trim());
        if (proxy) {
          parsedProxies.push(proxy);
        }
      });

      if (parsedProxies.length === 0) {
        throw new Error('No valid proxy servers found');
      }

      setProxyServers(parsedProxies);
    } catch (err) {
      console.error('Proxy fetch error:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please check your internet connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load proxy servers');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProxyServers();
  }, [fetchProxyServers]);

  const handleCopyProxy = async (proxyUrl: string, serverId: string) => {
    try {
      await Clipboard.setStringAsync(proxyUrl);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied!', 'Proxy URL copied to clipboard');
    } catch {
      Alert.alert('Error', 'Failed to copy proxy URL');
    }
  };

  const handleShareProxy = async (proxyUrl: string) => {
    try {
      await Share.share({
        message: `Fox2Net Telegram Proxy:\n${proxyUrl}`,
        title: 'Share Telegram Proxy'
      });
    } catch {
      Alert.alert('Error', 'Failed to share proxy');
    }
  };

  const getGradientColors = () => {
    return ['#667eea', '#764ba2', '#f093fb'] as const;
  };

  return (
    <ThemedView style={styles.container}>
      <Head>
        <title>Telegram Proxy - Fox2Net</title>
        <meta name="description" content="Free proxy servers for Telegram" />
      </Head>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.header}
      >
        <ThemedText type="title" style={styles.headerTitle}>
          Telegram Proxy
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Free proxy servers for Telegram
        </ThemedText>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {loading && (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.tint} />
              <ThemedText style={styles.loadingText}>Loading proxy servers...</ThemedText>
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
                  onPress={fetchProxyServers}
                >
                  <ThemedText style={[styles.retryButtonText, { color: '#fff' }]}>
                    Retry
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          )}

          {!loading && !error && proxyServers.length > 0 && (
            <>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Available Proxy Servers ({proxyServers.length})
              </ThemedText>

              {proxyServers.map((proxy, index) => (
                <ThemedView key={index} style={[
                  styles.proxyCard,
                  { 
                    backgroundColor: '#f8fafc',
                    borderColor: '#e2e8f0'
                  }
                ]}>
                  <ThemedView style={styles.proxyHeader}>
                    <ThemedView style={styles.proxyInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.proxyTitle}>
                        Server {index + 1}
                      </ThemedText>
                      <ThemedView style={styles.statusContainer}>
                        <ThemedView style={[
                          styles.statusDot,
                          { backgroundColor: '#10b981' }
                        ]} />
                        <ThemedText style={[styles.statusText, { color: '#10b981' }]}>
                          Online
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                    <TouchableOpacity
                      style={[
                        styles.connectButton,
                        { backgroundColor: colors.tint }
                      ]}
                      onPress={() => handleCopyProxy(proxy.url, `server-${index}`)}
                    >
                      <ThemedText style={[styles.connectButtonText, { color: '#fff' }]}>
                        Copy
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>

                  <ThemedView style={styles.proxyDetails}>
                    <ThemedView style={styles.detailRow}>
                      <IconSymbol name="server.rack" size={16} color={colors.icon} />
                      <ThemedText style={styles.detailLabel}>Server:</ThemedText>
                      <ThemedText type="defaultSemiBold">{proxy.server}</ThemedText>
                    </ThemedView>
                    
                    <ThemedView style={styles.detailRow}>
                      <IconSymbol name="port" size={16} color={colors.icon} />
                      <ThemedText style={styles.detailLabel}>Port:</ThemedText>
                      <ThemedText type="defaultSemiBold">{proxy.port}</ThemedText>
                    </ThemedView>
                    
                    <ThemedView style={styles.detailRow}>
                      <IconSymbol name="key" size={16} color={colors.icon} />
                      <ThemedText style={styles.detailLabel}>Secret:</ThemedText>
                      <ThemedText style={styles.secretText} numberOfLines={1}>
                        {proxy.secret.substring(0, 32)}...
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  <ThemedView style={styles.proxyActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: '#e2e8f0' }
                      ]}
                      onPress={() => handleShareProxy(proxy.url)}
                    >
                      <IconSymbol name="square.and.arrow.up" size={16} color={colors.icon} />
                      <ThemedText style={styles.actionButtonText}>Share</ThemedText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: '#e2e8f0' }
                      ]}
                      onPress={() => handleCopyProxy(proxy.url, `server-${index}`)}
                    >
                      <IconSymbol name="doc.on.doc" size={16} color={colors.icon} />
                      <ThemedText style={styles.actionButtonText}>Copy URL</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              ))}
            </>
          )}

          {!loading && !error && proxyServers.length === 0 && (
            <ThemedView style={[
              styles.emptyContainer,
              { 
                backgroundColor: '#f8fafc',
                borderColor: '#e2e8f0'
              }
            ]}>
              <IconSymbol name="info.circle" size={48} color={colors.icon} />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                No Proxy Servers Available
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                No proxy servers found. Please try again later.
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
                How to use
              </ThemedText>
              <ThemedText style={styles.infoText}>
                1. Copy the proxy URL{'\n'}
                2. Open Telegram{'\n'}
                3. Click on the proxy link{'\n'}
                4. Confirm to use the proxy
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
  proxyCard: {
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
  proxyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  proxyInfo: {
    flex: 1,
  },
  proxyTitle: {
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
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  proxyDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    minWidth: 60,
  },
  secretText: {
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
  },
  proxyActions: {
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