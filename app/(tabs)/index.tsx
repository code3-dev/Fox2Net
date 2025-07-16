import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Head from 'expo-router/head';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface Feature {
  icon: IconSymbolName;
  title: string;
  description: string;
  action: () => void;
  color: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateLink, setUpdateLink] = useState('');

  // Use hardcoded version instead of package.json import for production safety
  const currentVersion = '1.0.0';
  const updateUrl = 'https://raw.githubusercontent.com/code3-dev/v-data/refs/heads/main/update.json';

  const checkForUpdates = async () => {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(updateUrl, {
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
      
      if (data.version && data.version !== currentVersion) {
        setUpdateAvailable(true);
        setUpdateLink(data.link || 'https://t.me/h3dev');
        
        // Show update alert
        Alert.alert(
          'Update Available',
          `A new version (${data.version}) is available. Would you like to update?`,
          [
            { text: 'Later', style: 'cancel' },
            { 
              text: 'Update', 
              onPress: () => Linking.openURL(data.link || 'https://t.me/h3dev')
            }
          ]
        );
      }
    } catch (error) {
      console.log('Failed to check for updates:', error);
      // Don't show error to user, just log it
    }
  };

  useEffect(() => {
    // Add a small delay to prevent immediate network calls on startup
    const timer = setTimeout(() => {
      checkForUpdates();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getGradientColors = () => {
    return ['#667eea', '#764ba2', '#f093fb'] as const;
  };

  const features: Feature[] = [
    {
      icon: 'network',
      title: 'Telegram Proxy',
      description: 'Free proxy servers for Telegram',
      action: () => router.push('/proxy'),
      color: '#10b981'
    },
    {
      icon: 'shield.fill',
      title: 'V2Ray Config',
      description: 'Free V2Ray configurations',
      action: () => router.push('/v2ray'),
      color: '#3b82f6'
    },
    {
      icon: 'globe',
      title: 'Global Access',
      description: 'Access blocked content worldwide',
      action: () => {},
      color: '#8b5cf6'
    },
    {
      icon: 'lock.shield.fill',
      title: 'Secure Connection',
      description: 'Encrypted and secure proxy connections',
      action: () => {},
      color: '#ef4444'
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <Head>
        <title>Fox2Net - Your Gateway to Free Internet</title>
      </Head>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.header}
      >
        <ThemedText type="title" style={styles.headerTitle}>
          Fox2Net
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Your Gateway to Free Internet
        </ThemedText>
        <ThemedView style={[
          styles.statusContainer,
          { 
            backgroundColor: updateAvailable ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            borderColor: updateAvailable ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
            borderWidth: 1,
          }
        ]}>
          <ThemedView style={[
            styles.statusDot, 
            { backgroundColor: updateAvailable ? '#ef4444' : '#10b981' }
          ]} />
          <ThemedText style={[styles.statusText, { color: '#e2e8f0' }]}>
            {updateAvailable ? 'Update available' : 'All systems operational'}
          </ThemedText>
          {updateAvailable && (
            <TouchableOpacity onPress={() => Linking.openURL(updateLink)}>
              <ThemedText style={[styles.updateButton, { color: '#ef4444' }]}>
                Update
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Features
          </ThemedText>

          <ThemedView style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.featureCard,
                  { 
                    backgroundColor: '#f8fafc',
                    borderColor: '#e2e8f0'
                  }
                ]}
                onPress={feature.action}
              >
                <ThemedView style={styles.featureHeader}>
                  <ThemedView style={[
                    styles.featureIcon,
                    { backgroundColor: `${feature.color}20` }
                  ]}>
                    <IconSymbol name={feature.icon} size={24} color={feature.color} />
                  </ThemedView>
                </ThemedView>
                <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                  {feature.title}
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  {feature.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>

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
                About Fox2Net
              </ThemedText>
              <ThemedText style={styles.infoText}>
                Fox2Net provides free proxy servers and VPN configurations to help you access the internet freely and securely. All our services are completely free and regularly updated.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24 }]}>
            Support
          </ThemedText>

          <TouchableOpacity
            style={[
              styles.supportCard,
              { 
                backgroundColor: '#f1f5f9',
                borderColor: '#cbd5e1'
              }
            ]}
            onPress={() => Linking.openURL('https://t.me/h3dev')}
          >
            <ThemedView style={[
              styles.supportIcon,
              { backgroundColor: '#0088cc20' }
            ]}>
              <IconSymbol name="paperplane.fill" size={24} color="#0088cc" />
            </ThemedView>
            <ThemedView style={styles.supportContent}>
              <ThemedText type="defaultSemiBold" style={styles.supportTitle}>
                Telegram Support
              </ThemedText>
              <ThemedText style={styles.supportDescription}>
                Get help and updates on our Telegram channel
              </ThemedText>
              <ThemedText style={[styles.supportLink, { color: '#0088cc' }]}>
                @h3dev
              </ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={colors.text} />
          </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  updateButton: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  featureCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
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
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  supportLink: {
    fontSize: 12,
    fontWeight: '500',
  },
});
