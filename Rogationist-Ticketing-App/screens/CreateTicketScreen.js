import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const CreateTicketScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [dateCreated] = useState(new Date().toISOString().split('T')[0]);
  const [status] = useState('To Do');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [reporter, setReporter] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [submitted, setSubmitted] = useState(false); // New state to track if submit has been attempted

  useEffect(() => {
    const retrieveTokenAndUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserType = await AsyncStorage.getItem('userType');

        if (!storedToken || !storedUserId || !storedUserType) {
          console.error('No authentication token, user ID, or user type found. Please log in again.');
          return;
        }

        setToken(storedToken);
        setUserId(storedUserId);
        setUserType(storedUserType);
        setReporter(storedUserType === 'student' ? 'Student' : storedUserType === 'employee' ? 'Employee' : 'Unknown');
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    retrieveTokenAndUserId();
  }, []);

  const handleCreateTicket = async () => {
    setSubmitted(true); // Set submitted to true when trying to submit

    if (!description.trim()) {
      // Stop submission and display validation message if description is empty
      return;
    }

    const ticketData = {
      issue: description,
      dateCreated,
      status,
      student: userType === 'student' ? { studentNumber: userId } : null,
      employee: userType === 'employee' ? { employeeNumber: userId } : null,
    };

    try {
      const response = await fetch('http://192.168.1.140:8080/TicketService/ticket/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        setDescription('');
        setSubmitted(false); // Reset submitted state on successful submission
        setDisabled(true);
        setTimeout(() => setDisabled(false), 5000);
      } else {
        const responseBody = await response.text();
        console.error(responseBody);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.background}>
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Create a Ticket</Text>

          <View style={styles.innerContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
                submitted && !description.trim() && styles.invalidInput, // Show invalid style only after submit
              ]}
              placeholder="Describe the issue 
               (e.g., no network in CL3)"
  value={description}
  onChangeText={setDescription}
  multiline
            />
            {submitted && !description.trim() && (
              <Text style={styles.errorText}>Description must contain an issue.</Text>
            )}

            <Text style={styles.label}>Date Created</Text>
            <TextInput style={styles.input} value={dateCreated} editable={false} />

            <Text style={styles.label}>Status</Text>
            <TextInput style={styles.input} value={status} editable={false} />

            <Text style={styles.label}>Reporter</Text>
            <TextInput style={styles.input} value={reporter} editable={false} />

            <TouchableOpacity
              style={[styles.submitButton, disabled && styles.disabledButton]}
              onPress={handleCreateTicket}
              disabled={disabled}
            >
              <Icon name="send" size={width * 0.06} color="#fff" />
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#f2f2f2',
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
    marginTop: height * 0.15,
    paddingHorizontal: width * 0.04,
    width: '95%',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    color: '#333',
    fontWeight: '700',
    marginBottom: height * 0.02,
    marginTop: height * -0.02,
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  label: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#444',
    marginBottom: height * 0.008,
  },
  input: {
    width: '100%',
    height: height * 0.06,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: height * 0.02,
  },
  descriptionInput: {
    height: height * 0.15,
    textAlignVertical: 'top',
  },
  invalidInput: {
    borderColor: '#e63946',
  },
  errorText: {
    color: '#e63946',
    fontSize: width * 0.035,
    marginBottom: height * 0.02,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.015,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  submitText: {
    color: '#FFF',
    fontSize: width * 0.045,
    fontWeight: '600',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default CreateTicketScreen;
