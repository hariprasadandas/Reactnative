import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';

export default function AllTeams({ navigation }) {
  const [teams, setTeams] = useState([]);
  const [listKey, setListKey] = useState(Date.now().toString());

  // Fetch teams from AsyncStorage
  const fetchTeams = useCallback(async () => {
    try {
      const storedTeams = await AsyncStorage.getItem('teams');
      setTeams(storedTeams ? JSON.parse(storedTeams) : []);
      setListKey(Date.now().toString());
    } catch (error) {
      console.error('Error fetching teams:', error);
      Alert.alert('Error', 'Failed to load teams. Please try again.');
    }
  }, []);

  useEffect(() => {
    fetchTeams();
    const unsubscribe = navigation.addListener('focus', fetchTeams);
    return unsubscribe;
  }, [fetchTeams, navigation]);

  // Save teams to AsyncStorage
  const saveTeams = useCallback(async (updatedTeams) => {
    try {
      await AsyncStorage.setItem('teams', JSON.stringify(updatedTeams));
      setTeams([...updatedTeams]);
      setListKey(Date.now().toString());
    } catch (error) {
      console.error('Error saving teams:', error);
      Alert.alert('Error', 'Failed to save teams. Please try again.');
    }
  }, []);

  // Delete team
  const removeTeam = useCallback((teamId, teamName) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedTeams = teams.filter(team => team.id !== teamId);
            await saveTeams(updatedTeams);
            Alert.alert('Success', `You have deleted the team: ${teamName}`);
          },
        },
      ]
    );
  }, [teams, saveTeams]);

  const renderTeamItem = ({ item }) => (
    <View style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamName}>{item.name}</Text>
        <View style={styles.teamActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ManageTeams', { team: item })}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeTeam(item.id, item.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.playerName}>
        Players: {item.players.length > 0 ? item.players.map(p => p.name).join(', ') : 'No players'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>🏆 All Teams</Text>
      </View>
      <FlatList
        data={teams}
        renderItem={renderTeamItem}
        keyExtractor={(item) => item.id}
        key={listKey}
        extraData={listKey}
        ListEmptyComponent={<Text style={styles.emptyText}>No teams found.</Text>}
      />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerSection: {
    marginHorizontal: 15,
    marginVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF7043',
  },
  teamCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    marginHorizontal: 15,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamActions: {
    flexDirection: 'row',
    gap: 5,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E65100',
  },
  playerName: {
    fontSize: 14,
    color: '#E65100',
  },
  editButton: {
    backgroundColor: '#42A5F5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#EF5350',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteButtonText: {
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