import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const TicketListScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const userType = await AsyncStorage.getItem('userType');
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('authToken');

      if (!userId || !userType || !token) {
        setError('User information or token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const url = `http://192.168.1.140:8080/TicketService/tickets/user/${encodeURIComponent(userId)}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setTickets(response.data);
      } else if (response.status === 204) {
        setError('No tickets found.');
      } else {
        setError('Failed to fetch tickets. Please check your network connection.');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
      setError('Failed to fetch tickets. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.rowText}>{item.issue || 'No Issue'}</Text>
      <Text style={styles.rowText}>{item.status || 'No Status'}</Text>
      <Text style={styles.rowText}>
        {item.dateCreated ? new Date(item.dateCreated).toLocaleDateString() : 'No Date'}
      </Text>
      <Text style={styles.rowText}>
        {item.dateFinished ? new Date(item.dateFinished).toLocaleDateString() : 'N/A'}
      </Text>
      <Text style={styles.rowText}>
        {item.misStaff && (item.misStaff.firstName || item.misStaff.lastName)
          ? `${String(item.misStaff.firstName || '')} ${String(item.misStaff.lastName || '')}`.trim()
          : 'Unassigned'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.background}>
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Ticket List</Text>
            <TouchableOpacity onPress={fetchTickets} style={styles.refreshIcon}>
              <Icon name="refresh" size={width * 0.07} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Issue</Text>
            <Text style={styles.headerText}>Status</Text>
            <Text style={styles.headerText}>Date Created</Text>
            <Text style={styles.headerText}>Date Finished</Text>
            <Text style={styles.headerText}>MIS Staff</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : tickets.length === 0 ? (
            <Text style={styles.noTicketsText}>No tickets available</Text>
          ) : (
            <FlatList
              data={tickets}
              keyExtractor={(item) => item.ticketId.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.tableBody}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#e0e0e0',
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
    marginTop: height * 0.13,
    paddingHorizontal: width * 0.03,
    width: '100%',
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
    fontWeight: '700',
  },
  refreshIcon: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.015,
    borderRadius: 8,
    marginBottom: height * 0.015,
  },
  headerText: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
    marginVertical: height * 0.005,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  rowText: {
    fontSize: width * 0.033,
    color: '#555',
    textAlign: 'center',
    flex: 1,
  },
  errorText: {
    color: 'fff',
    fontSize: width * 0.05,
    textAlign: 'center',
    marginTop: height * 0.02,
  },
});

export default TicketListScreen;
