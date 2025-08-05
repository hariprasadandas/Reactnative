import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import Footer from './Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Admin({ navigation }) {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  // Fetch users from Firestore
  const fetchData = useCallback(async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    }
  }, []);

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [fetchData, navigation]);

  // Verify player in Firestore
  const verifyPlayer = useCallback(async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { verified: true });
      
      // Update local state
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, verified: true } : user
      );
      setUsers(updatedUsers);
      Alert.alert('Success', 'Player verified');
    } catch (error) {
      console.error('Error verifying player:', error);
      Alert.alert('Error', 'Failed to verify player. Please try again.');
    }
  }, [users]);

  // Header with Logout
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '🏏 Admin Panel',
      headerStyle: {
        backgroundColor: '#1E88E5',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 20,
        color: '#FFFFFF',
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            try {
              // Sign out from Firebase Auth
              await auth.signOut();
              // Clear AsyncStorage session
              await AsyncStorage.removeItem('loggedInEmail');
              console.log('Successfully logged out and cleared session');
              navigation.replace('Login');
            } catch (error) {
              console.error('Error signing out:', error);
              // Even if there's an error, try to navigate to login
              navigation.replace('Login');
            }
          }}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Text style={styles.headerButtonText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Render user item for FlatList
  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }}
        style={styles.userIcon}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>
          {item.email === 'admin@gmail.com' ? 'Admin' : item.verified ? 'Verified User' : 'Unverified User'}
        </Text>
      </View>
      {!item.verified && item.email !== 'admin@gmail.com' && (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => verifyPlayer(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, showUsers && styles.activeTab]}
            onPress={() => setShowUsers(true)}
          >
            <Text style={styles.tabText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !showUsers && styles.activeTab]}
            onPress={() => setShowUsers(false)}
          >
            <Text style={styles.tabText}>Teams & Matches</Text>
          </TouchableOpacity>
        </View>
        {showUsers ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage Users</Text>
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.email}
              style={styles.userList}
              extraData={users}
              ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Signup')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Add New User</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage Teams & Matches</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AllTeams')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>View All Teams</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ManageTeams')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Manage Teams</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Matches')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Manage Matches</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('FirebaseTest')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Test Firebase Connection</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#42A5F5', // Replaced invalid linear-gradient with solid color
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    backgroundColor: '#2cc91bff',
    borderRadius: 5,
  },
  tabText: {
    color: '#161515ff',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#42A5F5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#66BB6A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  headerButton: {
    marginRight: 15,
    backgroundColor: '#EF5350',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  userList: {
    maxHeight: 200,
    marginBottom: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  userIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E65100',
  },
  userRole: {
    fontSize: 12,
    color: '#FF7043',
  },
  verifyButton: {
    backgroundColor: '#66BB6A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#FF7043',
    textAlign: 'center',
    marginVertical: 10,
  },
});