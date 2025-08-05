import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const bannerImages = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'https://images.hindustantimes.com/img/2022/09/20/1600x900/international_cricket_council_1663660770590_1663660770855_1663660770855.JPG',
  'https://ss-i.thgim.com/public/incoming/jo7sva/article69810184.ece/alternates/LANDSCAPE_1200/ENG%20vs%20IND%20Blog%204.png',
  'https://d16f573ilcot6q.cloudfront.net/wp-content/uploads/2024/07/7-2.webp',
];

export default function Home({ navigation }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide for banner
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % bannerImages.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Header Title
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
    });
  }, [navigation]);

  const renderBannerItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.bannerImage} resizeMode="cover" />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* 🔼 Rolling Banner */}
        <View style={styles.bannerContainer}>
          <FlatList
            ref={flatListRef}
            data={bannerImages}
            renderItem={renderBannerItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollEnd={(event) => {
              const index = Math.floor(event.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
          />
          <View style={styles.dotsContainer}>
            {bannerImages.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* 🔥 Live Scores */}
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

        {/* 🏆 Teams */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.navigate('Teams')}>
            <Text style={[styles.sectionTitle, { color: '#000000ff' }]}>🏆 Teams</Text>
          </TouchableOpacity>
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

        {/* 🏏 Tournaments */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.navigate('Tournaments')}>
            <Text style={[styles.sectionTitle, { color: '#000000ff' }]}>🏏 Tournaments</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { name: 'IPL 2025', icon: 'https://documents.iplt20.com/bcci/articles/1722448657_IPL%20_%20Thumbnail.PNG' },
              { name: 'World Cup', icon: 'https://images.saymedia-content.com/.image/t_share/MTc2MjczMDM5NTE4OTk5NzQy/2019-cricket-world-cup.jpg' },
              { name: 'Test Championship', icon: 'https://www.prabhatkhabar.com/wp-content/uploads/2024/01/wtc-trophy.jpg' },
              { name: 'T20 World Cup', icon: 'https://www.mtctutorials.com/wp-content/uploads/2021/10/ICC-T20-World-Cup-2021-Logo-Png.gif' },
              { name: 'Champions Trophy', icon: 'https://assets.telegraphindia.com/abp/2024/Jul/1721396539_champions-trophy.jpg' },
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

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2F5' },
  bannerContainer: { width, height: 180, position: 'relative', marginBottom: 20 },
  bannerImage: { width, height: '100%' },
  dotsContainer: { position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#fff' },
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
});