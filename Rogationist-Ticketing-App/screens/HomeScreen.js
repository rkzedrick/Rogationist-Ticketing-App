import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setUserName(name);
        }
      } catch (error) {
        console.error("Failed to load user's name:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.safeArea}>
      <View style={styles.topBox}>
        <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Hi {userName || 'User'}, Welcome to Report IT!</Text>
        <Text style={styles.subtitle}>Your tool for managing IT tickets and profile information at Rogationist College.</Text>

        <View style={styles.cardContainer}>
          {[
            { icon: 'list-circle-outline', color: '#ff6347', text: 'View Tickets', screen: 'TicketList' },
            { icon: 'add-circle-outline', color: '#4682b4', text: 'Create Ticket', screen: 'CreateTicket' },
            { icon: 'person-circle-outline', color: '#6a5acd', text: 'Profile', screen: 'Profile' },
          ].map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [styles.card, { backgroundColor: pressed ? '#f0f4f8' : '#fff' }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={50} color={item.color} />
              <Text style={styles.cardText}>{item.text}</Text>
            </Pressable>
          ))}
        </View>


        <Section title="Features" content={[
          'Submit New Tickets: Report issues like network problems in computer labs.',
          'Ticket Status Monitoring: Stay updated on your ticket\'s progress.',
          'Profile Management: Keep your information current.',
             ]} />

      
        <Section title="About the Project" content={[
         'Report IT is designed to create an efficient IT ticketing system for Rogationist College. Our mission is to enhance IT issue management, making it easier and faster to address technical support needs and improve the user experience.',
        ]} />
      </View>
    </ScrollView>
  );
};

const Section = ({ title, content }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {content.map((text, idx) => (
      <Text key={idx} style={styles.sectionText}>• {text}</Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: '#f2f5f8',
    alignItems: 'center',
  },
  topBox: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: height * 0.07,
    backgroundColor: '#0C356A',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.5,
    height: '100%',
    marginRight: 170,
    resizeMode: 'contain',
  },
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.04,
    marginTop: height * 0.15,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#666',
    textAlign: 'left',
    marginBottom: 20,
    lineHeight: 24,
    maxWidth: '85%',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',

    marginBottom: 20,
  },
  card: {
    width: width * 0.4,
    height: height * 0.18,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 10,
  },
  cardText: {
    fontSize: width * 0.045,
    color: '#333',
    marginTop: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10, // Adds equal margin between each section
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    minHeight: height * 0.25, // Sets a minimum height for consistency
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#0C356A',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: width * 0.04,
    color: '#555',
    lineHeight: 22,
  },
});

export default HomeScreen;
