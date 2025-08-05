import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db, auth } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function FirebaseTest({ navigation }) {
  const [testResult, setTestResult] = useState('');

  const checkAuthStatus = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        setTestResult(`✅ Authenticated as: ${user.email}\nUID: ${user.uid}`);
        console.log('Current user:', user);
      } else {
        setTestResult('❌ Not authenticated');
        console.log('No user logged in');
      }
    } catch (error) {
      setTestResult(`❌ Auth check error: ${error.message}`);
      console.error('Auth check error:', error);
    }
  };

  const testFirebaseConnection = async () => {
    try {
      setTestResult('Testing Firebase connection...');
      
      // Test 1: Try to add a test document
      const testRef = collection(db, 'test');
      const testDoc = await addDoc(testRef, {
        message: 'Firebase connection test',
        timestamp: new Date().toISOString()
      });
      
      setTestResult(`✅ Test document created with ID: ${testDoc.id}`);
      
      // Test 2: Try to read documents
      const querySnapshot = await getDocs(testRef);
      setTestResult(prev => prev + `\n✅ Read ${querySnapshot.size} documents`);
      
      Alert.alert('Success', 'Firebase connection is working!');
      
    } catch (error) {
      console.error('Firebase test error:', error);
      setTestResult(`❌ Error: ${error.message}`);
      Alert.alert('Error', `Firebase test failed: ${error.message}`);
    }
  };

  const testTeamsCollection = async () => {
    try {
      setTestResult('Testing teams collection...');
      
      const teamsRef = collection(db, 'teams');
      const querySnapshot = await getDocs(teamsRef);
      
      setTestResult(`✅ Teams collection accessible. Found ${querySnapshot.size} teams.`);
      
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          console.log('Team:', doc.id, doc.data());
        });
      }
      
    } catch (error) {
      console.error('Teams collection test error:', error);
      setTestResult(`❌ Teams collection error: ${error.message}`);
      Alert.alert('Error', `Teams collection test failed: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Connection Test</Text>
      
      <TouchableOpacity style={styles.button} onPress={checkAuthStatus}>
        <Text style={styles.buttonText}>Check Auth Status</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testFirebaseConnection}>
        <Text style={styles.buttonText}>Test Firebase Connection</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testTeamsCollection}>
        <Text style={styles.buttonText}>Test Teams Collection</Text>
      </TouchableOpacity>
      
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Test Results:</Text>
        <Text style={styles.resultText}>{testResult}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minHeight: 100,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
}); 