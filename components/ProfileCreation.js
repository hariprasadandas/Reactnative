import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileCreation({ route, navigation }) {
  const { email, name, photoURL } = route.params || {};
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: name || '',
      email: email || '',
      phone: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No user found. Please sign in again.');
        return;
      }

      // Save profile data to Firestore using user's UID
      await setDoc(doc(db, 'users', user.uid), {
        name: data.name || name || 'User',
        email: data.email || email || user.email,
        photoURL: photoURL || user.photoURL || null,
        phone: data.phone || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true }); // Use merge to avoid overwriting existing data

      Alert.alert('Success', 'Profile created successfully!');
      navigation.replace('Main');
    } catch (error) {
      console.error('Profile Creation Error:', error);
      
      let errorMessage = 'Failed to create profile. Please try again.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your Firestore security rules.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Profile',
    });
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingBottom: 120 }]}>
      <View style={styles.card}>
        <Text style={styles.title}>Complete Your Profile 🚀</Text>
        <Text style={styles.subtitle}>Add your details to get started</Text>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              onChangeText={onChange}
              value={value || ''}
            />
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <Controller
          control={control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={onChange}
              value={value || ''}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false} // Email from Google is read-only
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Phone Number (Optional)"
              style={styles.input}
              onChangeText={onChange}
              value={value || ''}
              keyboardType="phone-pad"
              maxLength={15}
            />
          )}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButtonText}>Complete Profile</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={async () => {
          try {
            await auth.signOut();
            await AsyncStorage.removeItem('loggedInEmail');
            navigation.replace('Login');
          } catch (error) {
            console.error('Logout error:', error);
            // Still navigate to login even if there's an error
            navigation.replace('Login');
          }
        }}
        style={{
          alignSelf: 'center',
          marginVertical: 20,
          paddingVertical: 12,
          paddingHorizontal: 32,
          backgroundColor: '#E63946',
          borderRadius: 24,
          elevation: 3,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, letterSpacing: 1, fontFamily: 'Montserrat-Bold' }}>Logout</Text>
      </TouchableOpacity>
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
  saveButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});