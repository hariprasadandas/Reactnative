import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';

export default function Community({ navigation }) {
  // State for sections
  const [grounds, setGrounds] = useState([
    { name: 'Eden Gardens', icon: 'https://i.ibb.co/xsS3zRj/ground1.jpg' },
    { name: 'Wankhede Stadium', icon: 'https://i.ibb.co/93GvGWD/ground2.jpg' },
  ]);
  const [commentators, setCommentators] = useState([
    { name: 'Harsha Bhogle', icon: 'https://i.ibb.co/pZWLR5J/commentator1.jpg' },
  ]);
  const [coaches, setCoaches] = useState([
    { name: 'Rahul Dravid', icon: 'https://i.ibb.co/sjm0W6L/coach1.jpg' },
  ]);
  const [organisers, setOrganisers] = useState([
    { name: 'BCCI', icon: 'https://i.ibb.co/R72TDvT/bcci.jpg' },
  ]);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentSection, setCurrentSection] = useState('');

  // Add new item to section
  const addItem = () => {
    if (!newItem.trim()) return;

    const newEntry = {
      name: newItem,
      icon: imageUrl || 'https://cdn-icons-png.flaticon.com/512/16/16410.png', // Default icon
    };

    if (currentSection === 'Grounds') setGrounds([...grounds, newEntry]);
    if (currentSection === 'Commentators') setCommentators([...commentators, newEntry]);
    if (currentSection === 'Coaches') setCoaches([...coaches, newEntry]);
    if (currentSection === 'Organisers') setOrganisers([...organisers, newEntry]);

    setNewItem('');
    setImageUrl('');
    setModalVisible(false);
  };

  const renderSection = (title, data, sectionName) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCurrentSection(sectionName);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => (
          <View style={styles.card} key={index}>
            <Image source={{ uri: item.icon }} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {renderSection('🏟 Grounds', grounds, 'Grounds')}
        {renderSection('🎤 Commentators', commentators, 'Commentators')}
        {renderSection('🏏 Coaches', coaches, 'Coaches')}
        {renderSection('📋 Organisers', organisers, 'Organisers')}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add {currentSection}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={newItem || ''}
              onChangeText={setNewItem}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Image URL (Optional)"
              value={imageUrl || ''}
              onChangeText={setImageUrl}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addItem}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2F5' },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#E63946',
  },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#222' },
  addButton: {
    backgroundColor: '#E63946',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    width: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  cardImage: { width: 60, height: 60, marginBottom: 10, borderRadius: 30 },
  cardText: { fontSize: 13, color: '#333', textAlign: 'center', fontWeight: '500' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { padding: 10 },
  cancelText: { color: '#E63946', fontWeight: '600' },
  saveButton: { padding: 10 },
  saveText: { color: 'green', fontWeight: '600' },
});
