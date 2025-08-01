import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser?.email === email) {
      Alert.alert('Password Recovery', `Your password is: ${parsedUser.password}`);
    } else {
      Alert.alert('Error', 'Email not found!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password 🔐</Text>
        <Text style={styles.subtitle}>We'll help you recover it</Text>

        <TextInput
          placeholder="Enter your registered email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.recoverButton} onPress={handlePasswordRecovery}>
          <Text style={styles.recoverButtonText}>Recover Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F7FA',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  recoverButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  recoverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
});
