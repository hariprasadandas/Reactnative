import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🔼 Header with Banner */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' }}
          style={styles.banner}
          resizeMode="cover"
        />
        <Text style={styles.headerTitle}>Cric Heroes🏏</Text>
      </View>

      {/* ✅ Body Content */}
      <View style={styles.card}>
        <Text style={styles.title}>🎉 Welcome Back!</Text>
        <Text style={styles.subtitle}>You're successfully logged in.</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 🔽 Static Footer */}
      <View style={styles.footer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/25/25694.png' }} // GitHub
          style={styles.footerIcon}
        />
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' }} // LinkedIn
          style={styles.footerIcon}
        />
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' }} // Instagram
          style={styles.footerIcon}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F5',
  },
  header: {
    width: '100%',
    height: 180,
    position: 'relative',
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  card: {
    marginHorizontal: 20,
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  footerIcon: {
    width: 28,
    height: 28,
  },
});
