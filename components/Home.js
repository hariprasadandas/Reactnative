import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* 🔼 Header with Banner */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' }}
            style={styles.banner}
            resizeMode="cover"
          />
          <Text style={styles.headerTitle}>Cric Heroes🏏</Text>
        </View>

        {/* ✅ Welcome Card */}
        <View style={styles.card}>
          <Text style={styles.title}>🎉 Welcome Back!</Text>
          <Text style={styles.subtitle}>You're successfully logged in.</Text>
        </View>

        {/* 🔥 Live Scores Section */}
        <View style={styles.liveScoreSection}>
          <Text style={styles.sectionTitle}>🔥 Live Scores</Text>
          {[
            { match: 'IND vs AUS', score: 'India 210/3 (30 overs)', status: '2nd ODI - Live' },
            { match: 'ENG vs SA', score: 'England 145/6 (25 overs)', status: 'T20 - Live' },
            { match: 'NZ vs PAK', score: 'NZ 320/8 (50 overs)', status: 'ODI - Completed' },
          ].map((item, index) => (
            <View key={index} style={styles.liveCard}>
              <Text style={styles.liveMatch}>{item.match}</Text>
              <Text style={styles.liveScore}>{item.score}</Text>
              <Text style={styles.liveStatus}>{item.status}</Text>
            </View>
          ))}
        </View>

        {/* 🏆 Teams Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Teams</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { name: 'India', icon: 'http://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_India.png' },
              { name: 'Australia', icon: 'https://www.wpmap.org/wp-content/uploads/2015/11/flag_world_australia1.jpg' },
              { name: 'England', icon: 'https://www.countryflags.com/wp-content/uploads/england-flag-jpg-xl.jpg' },
              { name: 'South Africa', icon: 'http://s1.bwallpapers.com/wallpapers/2014/05/29/south-africa-flag_121415453.jpg' },
              { name: 'New Zealand', icon: 'https://static.vecteezy.com/system/resources/previews/011/177/783/original/national-flag-of-new-zealand-vector.jpg' },
            ].map((team, index) => (
              <View style={styles.cardItem} key={index}>
                <Image source={{ uri: team.icon }} style={styles.cardIcon} />
                <Text style={styles.cardText}>{team.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 🏏 Tournaments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏏 Tournaments</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { name: 'IPL 2025', icon: 'https://documents.iplt20.com/bcci/articles/1722448657_IPL%20_%20Thumbnail.PNG' },
              { name: 'World Cup', icon: 'https://images.saymedia-content.com/.image/t_share/MTc2MjczMDM5NTE4OTk5NzQy/2019-cricket-world-cup.jpg' },
              { name: 'Test Championship', icon: 'https://www.prabhatkhabar.com/wp-content/uploads/2024/01/wtc-trophy.jpg' },
              { name: 'T20 World Cup' , icon: 'https://www.mtctutorials.com/wp-content/uploads/2021/10/ICC-T20-World-Cup-2021-Logo-Png.gif' },
            ].map((tournament, index) => (
              <View style={styles.cardItem} key={index}>
                <Image source={{ uri: tournament.icon }} style={styles.cardIcon} />
                <Text style={styles.cardText}>{tournament.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 🥇 Men's Rankings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥇 Men's Rankings</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { name: 'Test', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' },
              { name: 'ODI', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922506.png' },
              { name: 'T20', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' },
              { name: 'Batting', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922688.png' },
              { name: 'Bowling', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' },
              { name: 'All-Rounder', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' },
            ].map((ranking, index) => (
              <View style={styles.cardItem} key={index}>
                <Image source={{ uri: ranking.icon }} style={styles.cardIcon} />
                <Text style={styles.cardText}>{ranking.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 🥇 Women's Rankings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥇 Women's Rankings</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { name: 'Test', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png' },
              { name: 'ODI', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png' },
              { name: 'T20', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png' },
              { name: 'Batting', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png' },
              { name: 'Bowling', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png' },
              { name: 'All-Rounder', icon: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png' },
            ].map((ranking, index) => (
              <View style={styles.cardItem} key={index}>
                <Image source={{ uri: ranking.icon }} style={styles.cardIcon} />
                <Text style={styles.cardText}>{ranking.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 🔴 Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 🔽 Static Footer */}
      <View style={styles.footer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/25/25694.png' }}
          style={styles.footerIcon}
        />
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/174/174857.png' }}
          style={styles.footerIcon}
        />
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' }}
          style={styles.footerIcon}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2F5' },
  header: { width: '100%', height: 180, marginBottom: 20, position: 'relative' },
  banner: { width: '100%', height: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: {
    position: 'absolute', bottom: 10, left: 20, fontSize: 22, fontWeight: '700', color: '#fff',
    textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 6,
  },
  card: {
    marginHorizontal: 20, padding: 25, backgroundColor: '#fff', borderRadius: 16,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, alignItems: 'center', marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#333', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
  liveScoreSection: { marginHorizontal: 20, marginBottom: 20 },
  liveCard: {
    backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  liveMatch: { fontSize: 16, fontWeight: '700', color: '#222' },
  liveScore: { fontSize: 14, color: '#444', marginTop: 4 },
  liveStatus: { fontSize: 12, color: '#E63946', marginTop: 2, fontWeight: '600' },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#222' },
  cardItem: {
    backgroundColor: '#fff', borderRadius: 14, padding: 10, marginRight: 15, alignItems: 'center',
    width: 120, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 6,
  },
  cardIcon: { width: 60, height: 60, marginBottom: 10, borderRadius: 30 },
  cardText: { fontSize: 13, color: '#333', textAlign: 'center', fontWeight: '500' },
  logoutButton: {
    backgroundColor: '#EF4444', marginHorizontal: 20, paddingVertical: 14, borderRadius: 10,
    alignItems: 'center', marginBottom: 20,
  },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: {
    position: 'absolute', bottom: 0, backgroundColor: '#fff', width: '100%',
    paddingVertical: 14, borderTopWidth: 1, borderColor: '#ddd', flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  footerIcon: { width: 28, height: 28 },
});
