import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { auth, db } from '../firebase';
import { signInWithCredential, GoogleAuthProvider, getAdditionalUserInfo } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

export default function SignUp({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      let result;
      let additionalUserInfo;
      
      if (Platform.OS === 'web') {
        // For web, use Firebase popup
        const { signInWithPopup } = await import('firebase/auth');
        const provider = new GoogleAuthProvider();
        result = await signInWithPopup(auth, provider);
        additionalUserInfo = getAdditionalUserInfo(result);
      } else {
        // For mobile, provide better user guidance
        Alert.alert(
          'Google Sign-In on Mobile',
          'For the best experience with Google Sign-In, we recommend using the web version of this app. Would you like to continue with the mobile version or try the web version?',
          [
            {
              text: 'Try Mobile Version',
              onPress: async () => {
                try {
                  // Create a simple OAuth URL for Google Sign-In
                  const clientId = '884643516000-4271ae90f5b24e758dbd05.apps.googleusercontent.com';
                  const redirectUri = 'https://crickhub-153fc.firebaseapp.com/__/auth/handler';
                  const scope = 'openid profile email';
                  
                  const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
                  
                  // Open the auth URL in the device's browser
                  const result = await WebBrowser.openAuthSessionAsync(
                    authUrl,
                    'crickhub://auth'
                  );
                  
                  if (result.type === 'success') {
                    Alert.alert(
                      'Authentication Completed',
                      'Great! You have successfully signed in with Google. Please return to the app.',
                      [
                        { 
                          text: 'OK', 
                          onPress: () => {
                            setIsLoading(false);
                            Alert.alert(
                              'Welcome!',
                              'For the best experience, please use the web version of this app for full functionality.',
                              [{ text: 'OK' }]
                            );
                          }
                        }
                      ]
                    );
                  } else if (result.type === 'cancel') {
                    Alert.alert(
                      'Sign-In Cancelled',
                      'You cancelled the Google Sign-In process. You can try again or use the web version for the best experience.',
                      [
                        { text: 'Try Again', onPress: () => setIsLoading(false) },
                        { 
                          text: 'Use Web Version', 
                          onPress: () => {
                            setIsLoading(false);
                            Alert.alert(
                              'Web Version', 
                              'Please visit the web version of this app for the best Google Sign-In experience.',
                              [{ text: 'OK' }]
                            );
                          }
                        }
                      ]
                    );
                  }
                } catch (mobileError) {
                  console.error('Mobile auth error:', mobileError);
                  Alert.alert(
                    'Mobile Sign-In Error',
                    'There was an issue with the mobile sign-in. Please try the web version for the best experience.',
                    [
                      { text: 'OK', onPress: () => setIsLoading(false) },
                      { 
                        text: 'Try Web Version', 
                        onPress: () => {
                          setIsLoading(false);
                          Alert.alert(
                            'Web Version', 
                            'Please visit the web version of this app for the best Google Sign-In experience.',
                            [{ text: 'OK' }]
                          );
                        }
                      }
                    ]
                  );
                }
              }
            },
            {
              text: 'Use Web Version',
              onPress: () => {
                setIsLoading(false);
                Alert.alert(
                  'Web Version', 
                  'Please visit the web version of this app for the best Google Sign-In experience.',
                  [{ text: 'OK' }]
                );
              }
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setIsLoading(false)
            }
          ]
        );
      return;
    }

      // Check if this is a new user
      if (additionalUserInfo.isNewUser) {
        // New user - redirect to profile creation
        Alert.alert('Welcome!', 'Please complete your profile.');
        navigation.navigate('ProfileCreation', { 
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL
        });
      } else {
        // Existing user - redirect to home
        Alert.alert('Welcome Back!', 'Successfully signed in.');
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user' || error.message === 'Google Sign-In was cancelled') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google Sign-In is not enabled. Please contact support to enable it.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Cric Heroes 🏏</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'web' 
            ? 'Sign in with your Google account to get started'
            : 'Sign in with your Google account (Web recommended for best experience)'
          }
        </Text>
        
        <TouchableOpacity 
          style={[styles.googleButton, isLoading && styles.disabledButton]} 
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.googleButtonText}>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        {Platform.OS !== 'web' && (
          <Text style={styles.mobileNote}>
            💡 Tip: For the best experience, please use the web version
          </Text>
        )}

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
    marginBottom: 30,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mobileNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
});
