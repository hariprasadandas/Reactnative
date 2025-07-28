import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';

export default function Community({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ title: 'Community' });
  }, [navigation]);

  const grounds = [
    { name: 'Eden Gardens', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Eden_Gardens.jpg/800px-Eden_Gardens.jpg' },
    { name: 'Wankhede Stadium', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Wankhede_stadium_aerial_view.jpg/800px-Wankhede_stadium_aerial_view.jpg' },
  ];

  const commentators = [
    { name: 'Harsha Bhogle', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Harsha_Bhogle.jpg/800px-Harsha_Bhogle.jpg' },
    { name: 'Ravi Shastri', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Ravi_Shastri_2021.jpg/800px-Ravi_Shastri_2021.jpg' },
  ];

  const coaches = [
    { name: 'Rahul Dravid', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rahul_Dravid_2023.jpg/800px-Rahul_Dravid_2023.jpg' },
    { name: 'Ricky Ponting', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Ricky_Ponting_2015.jpg/800px-Ricky_Ponting_2015.jpg' },
  ];

  const organizers = [
    { name: 'BCCI', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Board_of_Control_for_Cricket_in_India_Logo.svg/1200px-Board_of_Control_for_Cricket_in_India_Logo.svg.png' },
    { name: 'ICC', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/International_Cricket_Council_Logo.svg/1200px-International_Cricket_Council_Logo.svg.png' },
  ];

  const renderSection = (title, data) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => (
          <View style={styles.card} key={index}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderSection('🏟️ Grounds', grounds)}
        {renderSection('🎤 Commentators', commentators)}
        {renderSection('🎯 Coaches', coaches)}
        {renderSection('📢 Organizers', organizers)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2F5' },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#222' },
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
  cardImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 8 },
  cardText: { fontSize: 13, color: '#333', textAlign: 'center', fontWeight: '500' },
});
