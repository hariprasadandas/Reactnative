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

export default function Tournaments({ navigation }) {
  const tournamentsList = [
    {
      name: 'IPL 2025',
      icon: 'https://documents.iplt20.com/bcci/articles/1722448657_IPL%20_%20Thumbnail.PNG',
      status: 'Ongoing',
    },
    {
      name: 'World Cup 2025',
      icon: 'https://images.saymedia-content.com/.image/t_share/MTc2MjczMDM5NTE4OTk5NzQy/2019-cricket-world-cup.jpg',
      status: 'Upcoming',
    },
    {
      name: 'Test Championship',
      icon: 'https://www.prabhatkhabar.com/wp-content/uploads/2024/01/wtc-trophy.jpg',
      status: 'Ongoing',
    },
    {
      name: 'T20 World Cup',
      icon: 'https://www.mtctutorials.com/wp-content/uploads/2021/10/ICC-T20-World-Cup-2021-Logo-Png.gif',
      status: 'Upcoming',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.pageTitle}>🏏 Tournaments</Text>

        {tournamentsList.map((item, index) => (
          <View key={index} style={styles.tournamentCard}>
            <Image source={{ uri: item.icon }} style={styles.tournamentIcon} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.tournamentName}>{item.name}</Text>
              <Text style={styles.tournamentStatus}>{item.status}</Text>
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
  tournamentCard: {
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
  tournamentIcon: { width: 60, height: 60, borderRadius: 8 },
  tournamentName: { fontSize: 16, fontWeight: '600', color: '#222' },
  tournamentStatus: { fontSize: 13, color: '#E63946', marginTop: 3 },
  detailsButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  detailsButtonText: { color: '#fff', fontSize: 12, fontWeight: '500' },
});
