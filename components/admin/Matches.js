import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, TextInput, Modal, ScrollView, Alert, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { db } from '../../firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import Footer from './Footer';

export default function Matches({ route, navigation }) {
  const { matches: routeMatches, teams: routeTeams } = route.params || { matches: [], teams: [] };

  const [matches, setMatches] = useState(routeMatches);
  const [teams, setTeams] = useState(routeTeams);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMatchModalVisible, setEditMatchModalVisible] = useState(false);
  const [matchDetailsModalVisible, setMatchDetailsModalVisible] = useState(false);

  const [newMatchName, setNewMatchName] = useState('');
  const [newMatchGround, setNewMatchGround] = useState('');
  const [newMatchDate, setNewMatchDate] = useState('');
  const [newMatchTeam1, setNewMatchTeam1] = useState('');
  const [newMatchTeam2, setNewMatchTeam2] = useState('');

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editMatchName, setEditMatchName] = useState('');
  const [editMatchGround, setEditMatchGround] = useState('');
  const [editMatchDate, setEditMatchDate] = useState('');
  const [editMatchTeam1, setEditMatchTeam1] = useState('');
  const [editMatchTeam2, setEditMatchTeam2] = useState('');

  const [teamSelectModalVisible, setTeamSelectModalVisible] = useState(false);
  const [isTeam1Selection, setIsTeam1Selection] = useState(true);

  const [listKey, setListKey] = useState(Date.now().toString());

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const teamModalRef = useRef(null);
  const detailsModalRef = useRef(null);

  // Fetch teams from Firestore
  const fetchTeams = useCallback(async () => {
    try {
      const teamsRef = collection(db, 'teams');
      const querySnapshot = await getDocs(teamsRef);
      const teamsData = [];
      querySnapshot.forEach((doc) => {
        teamsData.push({ id: doc.id, ...doc.data() });
      });
      if (JSON.stringify(teamsData) !== JSON.stringify(teams)) {
        setTeams(teamsData);
        console.log('Matches: Teams fetched and updated:', teamsData.length);
      } else {
        console.log('Matches: Teams fetched, no state update needed.');
      }
    } catch (error) {
      console.error('Matches: Error fetching teams:', error);
      Alert.alert('Error', 'Failed to load teams. Please try again.');
    }
  }, [teams]);

  // Fetch matches from Firestore
  const fetchMatches = useCallback(async () => {
    try {
      const matchesRef = collection(db, 'matches');
      const querySnapshot = await getDocs(matchesRef);
      const matchesData = [];
      querySnapshot.forEach((doc) => {
        matchesData.push({ id: doc.id, ...doc.data() });
      });
      if (JSON.stringify(matchesData) !== JSON.stringify(matches)) {
        setMatches(matchesData);
        console.log('Matches: Matches fetched and updated:', matchesData.length);
      } else {
        console.log('Matches: Matches fetched, no state update needed.');
      }
    } catch (error) {
      console.error('Matches: Error fetching matches:', error);
      Alert.alert('Error', 'Failed to load matches. Please try again.');
    }
  }, [matches]);

  // Save match to Firestore
  const saveMatch = useCallback(async (matchData) => {
    console.log("saveMatch called with:", matchData);
    try {
      const matchesRef = collection(db, 'matches');
      console.log("Firestore collection ref created:", matchesRef.path);
      const docRef = await addDoc(matchesRef, {
        ...matchData,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      });
      console.log("Match saved! Firestore doc ID:", docRef.id);

      // Update local state
      const newMatch = { id: docRef.id, ...matchData, createdAt: new Date().toISOString(), status: 'scheduled' };
      const updatedMatches = [...matches, newMatch];
      setMatches(updatedMatches);
      setListKey(Date.now().toString());
      console.log("Local state updated with new match:", newMatch);
      return true; // Return success
    } catch (error) {
      console.error('Matches: Error saving match:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      Alert.alert('Error', `Failed to save match: ${error.message}`);
      return false; // Return failure
    }
  }, [matches]);

  // Update match in Firestore
  const updateMatch = useCallback(async (matchId, updatedData) => {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      const updatedMatches = matches.map(match =>
        match.id === matchId
          ? { ...match, ...updatedData, updatedAt: new Date().toISOString() }
          : match
      );
      setMatches(updatedMatches);
      setListKey(Date.now().toString());
      console.log("Matches: Match updated in Firestore and state updated successfully.");
    } catch (error) {
      console.error('Matches: Error updating match:', error);
      Alert.alert('Error', 'Failed to update match. Please try again.');
    }
  }, [matches]);

  // Delete match from Firestore
  const deleteMatch = useCallback(async (matchId) => {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await deleteDoc(matchRef);
      
      // Update local state
      const updatedMatches = matches.filter(match => match.id !== matchId);
      setMatches(updatedMatches);
      setListKey(Date.now().toString());
      console.log("Matches: Match deleted from Firestore and state updated successfully.");
    } catch (error) {
      console.error('Matches: Error deleting match:', error);
      Alert.alert('Error', 'Failed to delete match. Please try again.');
    }
  }, [matches]);

  useEffect(() => {
    console.log('Matches: Setting up navigation focus listener.');
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Matches: Screen focused! Fetching latest data...');
      fetchTeams();
      fetchMatches();
    });

    fetchTeams();
    fetchMatches();

    return unsubscribe;
  }, [navigation, fetchTeams, fetchMatches]);

  useEffect(() => {
    const blurAllInputs = () => {
      if (addModalRef.current) RNTextInput.State.blurTextInput(addModalRef.current);
      if (editModalRef.current) RNTextInput.State.blurTextInput(editModalRef.current);
      if (teamModalRef.current) RNTextInput.State.blurTextInput(teamModalRef.current);
      if (detailsModalRef.current) RNTextInput.State.blurTextInput(detailsModalRef.current);
      console.log('Matches: All input fields blurred due to modal closure.');
    };

    if (!modalVisible && !editMatchModalVisible && !teamSelectModalVisible && !matchDetailsModalVisible) {
      blurAllInputs();
    }
  }, [modalVisible, editMatchModalVisible, teamSelectModalVisible, matchDetailsModalVisible]);

  const addMatch = useCallback(async () => {
    console.log("Matches: addMatch function called!");
    if (!newMatchName.trim() || !newMatchGround.trim() || !newMatchDate.trim() || !newMatchTeam1 || !newMatchTeam2) {
      Alert.alert('Error', 'Please fill all fields and select two different teams');
      return;
    }
    if (newMatchTeam1 === newMatchTeam2) {
      Alert.alert('Error', 'Please select two different teams');
      return;
    }
    if (matches.some(match => match.name.toLowerCase() === newMatchName.trim().toLowerCase())) {
      Alert.alert('Error', 'Match name already exists');
      return;
    }
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(newMatchDate)) {
      Alert.alert('Error', 'Please enter a valid date in DD-MM-YYYY format');
      return;
    }

    console.log("Matches: All validations passed for adding match.");

    const newMatch = {
      name: newMatchName.trim(),
      ground: newMatchGround.trim(),
      date: newMatchDate.trim(),
      team1: newMatchTeam1,
      team2: newMatchTeam2,
    };

    console.log("Matches: Attempting to save match to Firestore...");
    const success = await saveMatch(newMatch);
    
    if (success) {
      setNewMatchName('');
      setNewMatchGround('');
      setNewMatchDate('');
      setNewMatchTeam1('');
      setNewMatchTeam2('');
      setModalVisible(false);
      Alert.alert('Success', `Match "${newMatch.name}" added successfully!`);
      console.log("Matches: Match added and modal closed.");
    } else {
      console.log("Matches: Failed to save match, modal remains open.");
    }
  }, [newMatchName, newMatchGround, newMatchDate, newMatchTeam1, newMatchTeam2, matches, saveMatch]);

  const editMatch = useCallback(() => {
    console.log("Matches: editMatch function called!");
    console.log("Current selectedMatch:", selectedMatch);
    console.log("editMatchName:", editMatchName);
    console.log("editMatchGround:", editMatchGround);
    console.log("editMatchDate:", editMatchDate);
    console.log("editMatchTeam1:", editMatchTeam1);
    console.log("editMatchTeam2:", editMatchTeam2);


    if (!selectedMatch) {
      Alert.alert('Error', 'No match selected for editing.');
      return;
    }

    // Validate all fields are filled. Using optional chaining and nullish coalescing for safety.
    if (!editMatchName?.trim() || !editMatchGround?.trim() || !editMatchDate?.trim() || !editMatchTeam1 || !editMatchTeam2) {
      console.log('Validation Failed: One or more fields are empty or undefined.');
      Alert.alert('Error', 'Please fill all fields and select two different teams');
      return;
    }

    if (editMatchTeam1 === editMatchTeam2) {
      Alert.alert('Error', 'Please select two different teams');
      return;
    }
    if (matches.some(match => match.name.toLowerCase() === editMatchName.trim().toLowerCase() && match.id !== selectedMatch.id)) {
      Alert.alert('Error', 'Match name already exists for another match.');
      return;
    }
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(editMatchDate)) {
      Alert.alert('Error', 'Please enter a valid date in DD-MM-YYYY format');
      return;
    }

    console.log("Matches: All edit validations passed. Attempting to save edited match.");

    const updatedMatch = {
      name: editMatchName.trim(),
      ground: editMatchGround.trim(),
      date: editMatchDate.trim(),
      team1: editMatchTeam1,
      team2: editMatchTeam2
    };
    updateMatch(selectedMatch.id, updatedMatch);
    setEditMatchModalVisible(false);
    Alert.alert('Success', `Match "${editMatchName.trim()}" updated successfully!`);
    console.log("Matches: Match edited and modal closed.");
  }, [editMatchName, editMatchGround, editMatchDate, editMatchTeam1, editMatchTeam2, selectedMatch, matches, updateMatch]);

  const removeMatch = useCallback((matchId, matchName) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the match: ${matchName}?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => console.log('Matches: Delete cancelled.') },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            console.log(`Matches: Attempting to delete match with ID: ${matchId}`);
            await deleteMatch(matchId);
            Alert.alert('Success', `You have deleted the match: ${matchName}`);
            console.log(`Matches: Match ${matchName} deleted successfully.`);
          },
        },
      ]
    );
  }, [deleteMatch]);

  const selectTeam = useCallback((teamName) => {
    console.log(`Matches: Selected team: ${teamName} for ${isTeam1Selection ? 'Team 1' : 'Team 2'} (Add Match)`);
    if (isTeam1Selection) {
      setNewMatchTeam1(teamName);
    } else {
      setNewMatchTeam2(teamName);
    }
    setTeamSelectModalVisible(false);
  }, [isTeam1Selection]);

  const selectEditTeam = useCallback((teamName) => {
    console.log(`Matches: Selected team for edit: ${teamName} for ${isTeam1Selection ? 'Team 1' : 'Team 2'} (Edit Match)`);
    if (isTeam1Selection) {
      setEditMatchTeam1(teamName);
    } else {
      setEditMatchTeam2(teamName);
    }
    setTeamSelectModalVisible(false);
  }, [isTeam1Selection]);

  const renderMatchItem = useCallback(({ item }) => (
    <View style={styles.matchCard}>
      <TouchableOpacity
        onPress={() => {
          setSelectedMatch(item);
          setMatchDetailsModalVisible(true);
          console.log(`Matches: Viewing details for match: ${item.name}`);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.matchName}>{item.name}</Text>
        <Text style={styles.matchGround}>Ground: {item.ground}</Text>
        <Text style={styles.matchDate}>Date: {item.date}</Text>
        <Text style={styles.matchTeams}>Teams: {item.team1} vs {item.team2}</Text>
      </TouchableOpacity>
      <View style={styles.matchActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            console.log('Matches: Edit button pressed for item:', item);
            // Ensure all properties exist, provide defaults if they might be missing from old data
            setSelectedMatch(item);
            setEditMatchName(item.name || ''); // Use || '' to ensure it's a string
            setEditMatchGround(item.ground || '');
            setEditMatchDate(item.date || '');
            setEditMatchTeam1(item.team1 || '');
            setEditMatchTeam2(item.team2 || '');
            setEditMatchModalVisible(true);
            console.log(`Matches: Opening edit modal for match: ${item.name}`);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeMatch(item.id, item.name)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [removeMatch]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.headerSection}>
              <Text style={styles.headerTitle}>🏏 Manage Matches</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                console.log("Matches: Add New Match button pressed!");
                if (teams.length < 2) {
                  Alert.alert('Error', 'You need at least two teams to create a match. Please create more teams first.');
                  return;
                }
                setNewMatchName('');
                setNewMatchGround('');
                setNewMatchDate('');
                setNewMatchTeam1('');
                setNewMatchTeam2('');
                setModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Add New Match</Text>
            </TouchableOpacity>
          </>
        }
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        key={listKey}
        extraData={listKey}
        ListEmptyComponent={<Text style={styles.emptyText}>No matches found. Add a new match!</Text>}
        contentContainerStyle={styles.scrollContent}
      />
      {/* Modals */}
      {/* Add New Match Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Matches: Add Match Modal closed via request.');
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Match</Text>
            <TextInput
              ref={addModalRef}
              style={styles.input}
              placeholder="Enter match name"
              value={newMatchName}
              onChangeText={setNewMatchName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter ground name"
              value={newMatchGround}
              onChangeText={setNewMatchGround}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter date (DD-MM-YYYY)"
              value={newMatchDate}
              onChangeText={setNewMatchDate}
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                if (teams.length === 0) {
                  Alert.alert('Error', 'No teams available to select.');
                  return;
                }
                setIsTeam1Selection(true);
                setTeamSelectModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={newMatchTeam1 ? styles.inputText : styles.placeholderText}>
                {newMatchTeam1 || 'Select Team 1'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                if (teams.length === 0) {
                  Alert.alert('Error', 'No teams available to select.');
                  return;
                }
                setIsTeam1Selection(false);
                setTeamSelectModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={newMatchTeam2 ? styles.inputText : styles.placeholderText}>
                {newMatchTeam2 || 'Select Team 2'}
              </Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addMatch}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Add Match</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  console.log('Matches: Add Match Modal Cancelled.');
                  setModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Match Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editMatchModalVisible}
        onRequestClose={() => {
          console.log('Matches: Edit Match Modal closed via request.');
          setEditMatchModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Match</Text>
            <TextInput
              ref={editModalRef}
              style={styles.input}
              placeholder="Enter match name"
              value={editMatchName}
              onChangeText={setEditMatchName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter ground name"
              value={editMatchGround}
              onChangeText={setEditMatchGround}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter date (DD-MM-YYYY)"
              value={editMatchDate}
              onChangeText={setEditMatchDate}
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                if (teams.length === 0) {
                  Alert.alert('Error', 'No teams available to select.');
                  return;
                }
                setIsTeam1Selection(true);
                setTeamSelectModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={editMatchTeam1 ? styles.inputText : styles.placeholderText}>
                {editMatchTeam1 || 'Select Team 1'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                if (teams.length === 0) {
                  Alert.alert('Error', 'No teams available to select.');
                  return;
                }
                setIsTeam1Selection(false);
                setTeamSelectModalVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={editMatchTeam2 ? styles.inputText : styles.placeholderText}>
                {editMatchTeam2 || 'Select Team 2'}
              </Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={editMatch}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  console.log('Matches: Edit Match Modal Cancelled.');
                  setEditMatchModalVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Team Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={teamSelectModalVisible}
        onRequestClose={() => {
          console.log('Matches: Team Select Modal closed via request.');
          setTeamSelectModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Team</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {teams.length > 0 ? (
                teams.map(team => (
                  <TouchableOpacity
                    key={team.id}
                    style={styles.teamOption}
                    onPress={() => (editMatchModalVisible ? selectEditTeam(team.name) : selectTeam(team.name))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.teamOptionText}>{team.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No teams available</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                console.log('Matches: Team Select Modal Cancelled.');
                setTeamSelectModalVisible(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Match Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={matchDetailsModalVisible}
        onRequestClose={() => {
          console.log('Matches: Match Details Modal closed via request.');
          setMatchDetailsModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Match Details</Text>
            {selectedMatch && (
              <View style={styles.card}>
                <Text style={styles.matchName}>{selectedMatch.name}</Text>
                <Text style={styles.matchGround}>Ground: {selectedMatch.ground}</Text>
                <Text style={styles.matchDate}>Date: {selectedMatch.date}</Text>
                <Text style={styles.matchTeams}>Teams: {selectedMatch.team1} vs {selectedMatch.team2}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                console.log('Matches: Match Details Modal Closed.');
                setMatchDetailsModalVisible(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 20,
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
  matchCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  matchActions: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E65100',
    marginBottom: 4,
  },
  matchGround: {
    fontSize: 14,
    color: '#FF7043',
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 14,
    color: '#FF7043',
    marginBottom: 4,
  },
  matchTeams: {
    fontSize: 14,
    color: '#FF7043',
    marginBottom: 8,
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
    marginTop: 10,
  },
  inputText: {
    fontSize: 14,
    color: '#000',
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
  },
  teamOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  teamOptionText: {
    fontSize: 14,
    color: '#E65100',
  },
  card: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});