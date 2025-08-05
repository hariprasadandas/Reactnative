import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, TextInput, Modal, Alert, StyleSheet } from 'react-native';
import { db } from '../../firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import Footer from './Footer';

export default function ManageTeams({ route, navigation }) {
  const { team } = route.params || {};
  const [teams, setTeams] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTeamModalVisible, setEditTeamModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(team || null);
  const [editTeamName, setEditTeamName] = useState(team?.name || '');
  const [listKey, setListKey] = useState(Date.now().toString());

  // Fetch teams from Firestore
  const fetchTeams = useCallback(async () => {
    try {
      console.log('Fetching teams from Firestore...');
      const teamsRef = collection(db, 'teams');
      console.log('Teams collection reference created');
      
      const querySnapshot = await getDocs(teamsRef);
      console.log('Query snapshot received, size:', querySnapshot.size);
      
      const teamsData = [];
      querySnapshot.forEach((doc) => {
        console.log('Processing team document:', doc.id, doc.data());
        teamsData.push({ id: doc.id, ...doc.data() });
      });
      
      console.log('Final teams data:', teamsData);
      setTeams(teamsData);
      setListKey(Date.now().toString());
    } catch (error) {
      console.error('Error fetching teams from Firestore:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      Alert.alert('Error', `Failed to load teams: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
    const unsubscribe = navigation.addListener('focus', fetchTeams);
    return unsubscribe;
  }, [fetchTeams, navigation]);

  // Add new team to Firestore
  const addTeam = useCallback(async () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    if (teams.some(team => team.name.toLowerCase() === newTeamName.trim().toLowerCase())) {
      Alert.alert('Error', 'Team name already exists');
      return;
    }
    
    try {
      console.log('Adding team to Firestore:', newTeamName.trim());
      const teamsRef = collection(db, 'teams');
      const newTeam = {
        name: newTeamName.trim(),
        players: [],
        verified: false,
        createdAt: new Date().toISOString()
      };
      console.log('Team data to save:', newTeam);
      
      const docRef = await addDoc(teamsRef, newTeam);
      console.log('Team saved successfully with ID:', docRef.id);
      
      // Update local state
      const updatedTeams = [...teams, { id: docRef.id, ...newTeam }];
      setTeams(updatedTeams);
      setNewTeamName('');
      setModalVisible(false);
      Alert.alert('Success', 'Team added successfully');
    } catch (error) {
      console.error('Error adding team to Firestore:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      Alert.alert('Error', `Failed to add team: ${error.message}`);
    }
  }, [newTeamName, teams]);

  // Add player to team in Firestore
  const addPlayer = useCallback(async () => {
    if (!newPlayerName.trim()) {
      Alert.alert('Error', 'Please enter a player name');
      return;
    }
    const teamToUpdate = teams.find(team => team.id === selectedTeamId);
    if (!teamToUpdate) {
      Alert.alert('Error', 'Selected team not found');
      return;
    }
    if (teamToUpdate.players.some(player => player.name.toLowerCase() === newPlayerName.trim().toLowerCase())) {
      Alert.alert('Error', 'Player name already exists in this team');
      return;
    }
    
    try {
      const teamRef = doc(db, 'teams', selectedTeamId);
      const newPlayer = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        verified: false,
        addedAt: new Date().toISOString()
      };
      const updatedPlayers = [...teamToUpdate.players, newPlayer];
      await updateDoc(teamRef, { players: updatedPlayers });
      
      // Update local state
      const updatedTeams = teams.map(team =>
        team.id === selectedTeamId
          ? { ...team, players: updatedPlayers }
          : team
      );
      setTeams(updatedTeams);
      setNewPlayerName('');
      setModalVisible(false);
      setListKey(Date.now().toString());
      Alert.alert('Success', 'Player added successfully');
    } catch (error) {
      console.error('Error adding player:', error);
      Alert.alert('Error', 'Failed to add player. Please try again.');
    }
  }, [newPlayerName, selectedTeamId, teams]);

  // Edit team in Firestore
  const editTeam = useCallback(async () => {
    if (!editTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    if (teams.some(team => team.name.toLowerCase() === editTeamName.trim().toLowerCase() && team.id !== selectedTeam.id)) {
      Alert.alert('Error', 'Team name already exists');
      return;
    }
    
    try {
      const teamRef = doc(db, 'teams', selectedTeam.id);
      await updateDoc(teamRef, { name: editTeamName.trim() });
      
      // Update local state
      const updatedTeams = teams.map(team =>
        team.id === selectedTeam.id
          ? { ...team, name: editTeamName.trim() }
          : team
      );
      setTeams(updatedTeams);
      setEditTeamModalVisible(false);
      setSelectedTeam(null);
      setEditTeamName('');
      Alert.alert('Success', 'Team updated successfully');
    } catch (error) {
      console.error('Error updating team:', error);
      Alert.alert('Error', 'Failed to update team. Please try again.');
    }
  }, [editTeamName, selectedTeam, teams]);

  // Remove player
  const removePlayer = useCallback((teamId, playerId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this player?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const teamRef = doc(db, 'teams', teamId);
              const updatedPlayers = teams.find(team => team.id === teamId).players.filter(player => player.id !== playerId);
              await updateDoc(teamRef, { players: updatedPlayers });
              
              // Update local state
              const updatedTeams = teams.map(team =>
                team.id === teamId
                  ? { ...team, players: updatedPlayers }
                  : team
              );
              setTeams(updatedTeams);
              Alert.alert('Success', 'Player removed successfully');
              setListKey(Date.now().toString());
            } catch (error) {
              console.error('Error removing player:', error);
              Alert.alert('Error', 'Failed to remove player. Please try again.');
            }
          },
        },
      ]
    );
  }, [teams]);

  const renderPlayerItem = ({ item, teamId }) => (
    <View style={styles.playerCard}>
      <Text style={styles.playerName}>{item.name} {item.verified ? '(Verified)' : '(Unverified)'}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removePlayer(teamId, item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTeamItem = ({ item }) => (
    <View style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamName}>{item.name}</Text>
        <View style={styles.teamActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setSelectedTeam(item);
              setEditTeamName(item.name);
              setEditTeamModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={item.players}
        renderItem={({ item: player }) => renderPlayerItem({ item: player, teamId: item.id })}
        keyExtractor={(player) => player.id}
        extraData={listKey}
        ListEmptyComponent={<Text style={styles.emptyText}>No players in this team.</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedTeamId(item.id);
          setModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Add Player</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>🏆 Manage Teams</Text>
      </View>
      {selectedTeam ? (
        renderTeamItem({ item: selectedTeam })
      ) : (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectedTeamId(null);
              setNewPlayerName('');
              setModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Add New Team</Text>
          </TouchableOpacity>
          <FlatList
            data={teams}
            renderItem={renderTeamItem}
            keyExtractor={(item) => item.id}
            key={listKey}
            extraData={listKey}
            ListEmptyComponent={<Text style={styles.emptyText}>No teams found.</Text>}
          />
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTeamId ? 'Add New Player' : 'Add New Team'}</Text>
            <TextInput
              style={styles.input}
              placeholder={selectedTeamId ? 'Enter player name' : 'Enter team name'}
              value={selectedTeamId ? newPlayerName : newTeamName}
              onChangeText={selectedTeamId ? setNewPlayerName : setNewTeamName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={selectedTeamId ? addPlayer : addTeam}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>{selectedTeamId ? 'Add Player' : 'Add Team'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedTeamId(null);
                  setNewPlayerName('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editTeamModalVisible}
        onRequestClose={() => setEditTeamModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Team</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter team name"
              value={editTeamName}
              onChangeText={setEditTeamName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={editTeam}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditTeamModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: '#66BB6A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  cancelButton: {
    backgroundColor: '#EF5350',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
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
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});