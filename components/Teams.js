import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function Teams({ navigation }) {
  const teamsList = [
    {
      name: 'India',
      icon: 'http://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_India.png',
      ranking: 'ODI Rank: 1',
    },
    {
      name: 'Australia',
      icon: 'https://www.wpmap.org/wp-content/uploads/2015/11/flag_world_australia1.jpg',
      ranking: 'ODI Rank: 2',
    },
    {
      name: 'England',
      icon: 'https://www.countryflags.com/wp-content/uploads/england-flag-jpg-xl.jpg',
      ranking: 'ODI Rank: 3',
    },
    {
      name: 'South Africa',
      icon: 'http://s1.bwallpapers.com/wallpapers/2014/05/29/south-africa-flag_121415453.jpg',
      ranking: 'ODI Rank: 4',
    },
    {
      name: 'New Zealand',
      icon: 'https://static.vecteezy.com/system/resources/previews/011/177/783/original/national-flag-of-new-zealand-vector.jpg',
      ranking: 'ODI Rank: 5',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.pageTitle}>🏏 Teams</Text>

        {teamsList.map((item, index) => (
          <View key={index} style={styles.teamCard}>
            <Image source={{ uri: item.icon }} style={styles.teamIcon} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.teamName}>{item.name}</Text>
              <Text style={styles.teamRanking}>{item.ranking}</Text>
            </View>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => alert(`More details about ${item.name}`)}
            >
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
          
        ))}
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2F5' },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  teamIcon: { width: 60, height: 60, borderRadius: 8 },
  teamName: { fontSize: 16, fontWeight: '600', color: '#222' },
  teamRanking: { fontSize: 13, color: '#2563EB', marginTop: 3 },
  detailsButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  detailsButtonText: { color: '#fff', fontSize: 12, fontWeight: '500' },
});
