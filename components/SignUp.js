import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp({ navigation }) {
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      // Get existing users from AsyncStorage
      const storedUsers = await AsyncStorage.getItem('users');
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already exists
      if (users.some(user => user.email === data.email)) {
        Alert.alert('Error', 'This email is already registered. Please log in or use a different email.');
        return;
      }

      // Add new user to the array
      const newUser = { email: data.email, password: data.password };
      users = [...users, newUser];

      // Save updated users array to AsyncStorage
      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('Success', 'Account created. Please login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account 🎉</Text>
        <Text style={styles.subtitle}>Signup to get started</Text>

        <Controller
          control={control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Please confirm password',
            validate: value => value === passwordValue || 'Passwords do not match',
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

        <TouchableOpacity style={styles.signupButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.signupButtonText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? <Text style={{ fontWeight: 'bold' }}>Login</Text></Text>
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
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 13,
  },
  signupButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
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