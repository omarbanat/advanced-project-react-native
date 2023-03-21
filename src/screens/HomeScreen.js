import axios from 'axios';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import { Table, Row, Rows } from 'react-native-table-component';

import BackButton from '../components/BackButton';

import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import RadioButtonRN from 'radio-buttons-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  // const API_URL =
  //   'https://advanced-project-backend-production.up.railway.app/api';
  // const API_URL = 'http://192.168.0.112:8000/api';
  const API_URL = 'http://172.20.10.4:8000/api';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  const route = useRoute();
  const userID = route.params?.id;
  const email = route.params?.email;
  console.log('emailllll: ', email);

  const [recallAPI, setRecallAPI] = useState(false);

  const fetchAttendance = async () => {
    const attendances = await axios.get(
      `${API_URL}/getUserAttendances/${userID}`
    );
    console.log(attendances);
    const omar = attendances.data.data.map((el) => [
      el.date,
      el.attendanceType,
    ]);
    console.log('omar: ', omar);
    setData(omar);
  };

  const signoutHandler = () => {
    AsyncStorage.removeItem(email);
    setIsLoggedIn(false);
    Alert.alert('Not Authenticated!', 'Please login again...');
    setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 1000);
  };

  const [attendanceCheck, setAttendanceCheck] = useState('');
  const [attendancePopup, setAttendancePopup] = useState(false);
  const [attendanceType, setAttendanceType] = useState('');

  const checkTodayAttendance = () => {
    setRecallAPI((prev) => !prev);
    const todayDate = new Date();
    data.length > 0
      ? data.map((el) => {
          console.log('DATABASE:: ', el[0]);
          console.log('TODAT:: ', format(todayDate, 'yyyy-MM-dd'));
          if (el[0] == format(todayDate, 'yyyy-MM-dd')) {
            console.log('You already submit you attendance today as ', el[1]);
            setAttendanceCheck(
              `You already submit you attendance today as ${el[1]}`
            );
            setAttendancePopup(false);
          } else {
            console.log('SHIT');
            setAttendancePopup(true);
          }
        })
      : setAttendancePopup(true);
  };

  const radioData = [
    {
      label: 'present',
    },
    {
      label: 'absent',
    },
    {
      label: 'late',
    },
  ];

  useEffect(() => {
    fetchAttendance();
  }, [recallAPI, attendancePopup]);

  useEffect(() => {
    (async () => {
      try {
        const credentials = await AsyncStorage.getItem(email);
        // const credentials = await Keychain.getGenericPassword();
        console.log('credddd: ', credentials);
        if (credentials) {
          setIsLoggedIn(true);
        } else {
          console.log('No credentials stored');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log("Token couldn't be accessed!", error);
      }
    })();
  }, []);

  const addAttendanceHandler = async () => {
    console.log({ userID });
    const response = await axios.post(`${API_URL}/attendance/add/${userID}`, {
      attendanceType,
      date: format(new Date(), 'yyyy-MM-dd'),
    });

    setRecallAPI((prev) => !prev);
    setAttendancePopup(false);
    console.log('CHECK: ', response);
  };

  return (
    isLoggedIn && (
      <View style={styles.container}>
        {/* <BackButton goBack={navigation.goBack} /> */}
        <Text style={{ fontSize: '40px', paddingBottom: 20, color: '#047cfc' }}>
          Attendance sheet
        </Text>
        <Button mode="contained" onPress={checkTodayAttendance}>
          Check today's attendance
        </Button>
        {!attendancePopup && <Text>{attendanceCheck}</Text>}
        {attendancePopup && (
          <View>
            <RadioButtonRN
              data={radioData}
              selectedBtn={(e) => setAttendanceType(e.label)}
            />
            <Button
              mode="contained"
              width={'35%'}
              right={true}
              onPress={addAttendanceHandler}
            >
              Submit
            </Button>
          </View>
        )}
        <ScrollView>
          <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
            <Row
              data={['Date', 'Status']}
              style={styles.head}
              textStyle={styles.textHeader}
            />
            <Rows data={data} textStyle={styles.text} />
          </Table>
        </ScrollView>
        <Button onPress={signoutHandler} mode="contained">
          Signout
        </Button>
      </View>
    )
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 70, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#0470fc' },
  textHeader: { margin: 6, textAlign: 'center', color: '#fff' },
  text: { margin: 6, textAlign: 'center' },
});
export default HomeScreen;
