import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navItems = [
    { name: 'Admin', icon: 'admin-panel-settings', route: 'Admin' },
    { name: 'All Teams', icon: 'group', route: 'AllTeams' },
    { name: 'Manage Teams', icon: 'edit', route: 'ManageTeams' },
    { name: 'Matches', icon: 'sports-cricket', route: 'Matches' },
  ];

  return (
    <View style={styles.footer}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.footerItem,
            route.name === item.route && styles.activeFooterItem,
            { pointerEvents: 'auto' }, // Replace deprecated props.pointerEvents
          ]}
          onPress={() => {
            navigation.navigate(item.route);
          }}
          accessible={false} // Disable accessibility focus
          activeOpacity={0.7}
        >
          <Icon
            name={item.icon}
            size={24}
            color={route.name === item.route ? '#FFFFFF' : '#888'}
          />
          <Text
            style={[
              styles.footerText,
              route.name === item.route && styles.activeFooterText,
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ebf0f6ff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#BBDEFB',
  },
  footerItem: {
    alignItems: 'center',
    flex: 1,
  },
  activeFooterItem: {
    backgroundColor: '#cb380bff',
    borderRadius: 5,
    paddingVertical: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  activeFooterText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default Footer;