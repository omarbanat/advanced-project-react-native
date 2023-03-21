import axios from 'axios';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';

import DatePicker from 'react-native-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';

import { theme } from '../styles/theme';

const RegisterScreen = ({ navigation }) => {
  // const API_URL =
  //   'https://advanced-project-backend-production.up.railway.app/api';
  // const API_URL = 'http://192.168.0.112:8000/api';
  const API_URL = 'http://172.20.10.4:8000/api';

  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [DOB, setDOB] = useState({ value: '', error: '' });
  const [phoneNumber, setPhoneNumber] = useState({ value: '', error: '' });
  const [error, setError] = useState('');
  const [openDateOption, setOpenDateOption] = useState(false);
  const [gender, setGender] = useState(null);
  const [genders, setGenders] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  const [date, setDate] = useState('');

  const signupHandler = async () => {
    const [fName, lName] = name.value.split(' ');
    const infoObj = {
      fName,
      lName,
      email: email.value,
      password: password.value,
      DOB: date,
      phoneNumber: phoneNumber.value,
      gender: gender,
      role: 'student',
    };

    try {
      const response = await axios.post(`${API_URL}/user/add`, infoObj);
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        console.log('ENTERED');
        navigation.navigate('HomeScreen', { id: user.data.user.id });
      }
    } catch (error) {
      console.log(error);
      setError(error.request['_response']);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Signup with MAKO LMS</Header>
      <TextInput
        label="Full Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
        autoCapitalize="words"
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <DatePicker
        style={styles.datePickerStyle}
        date={date} // Initial date from state
        mode="date" // The enum of date, datetime and time
        placeholder="Select date"
        format="YYYY-MM-DD"
        minDate="2016-01-01"
        maxDate="2019-01-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            display: 'none',
          },
          dateInput: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 15,
            height: 50,
            marginBottom: 12,
            borderRadius: 4,
            borderColor: '#6F6F6F',
          },
          placeholderText: {
            color: '#474747',
          },
        }}
        onDateChange={(date) => {
          setDate(date);
        }}
      />
      <TextInput
        label="Phone number"
        returnKeyType="next"
        value={phoneNumber.value}
        onChangeText={(text) => setPhoneNumber({ value: text, error: '' })}
        error={!!phoneNumber.error}
        errorText={phoneNumber.error}
        autoCompleteType="tel"
        textContentType="telephoneNumber"
        keyboardType="numeric"
      />
      <DropDownPicker
        style={{
          marginTop: 15,
          borderColor: theme.colors.secondary,
          opacity: 0.7,
        }}
        open={openDateOption}
        value={gender}
        items={genders}
        setOpen={setOpenDateOption}
        setValue={setGender}
        setItems={setGenders}
      />
      {error && (
        <View>
          <Text style={styles.errorOccured}>{error}</Text>
        </View>
      )}
      <Button onPress={signupHandler} mode="contained">
        Create Account
      </Button>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
    fontWeight: 700,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  errorOccured: {
    fontWeight: 'bold',
    color: 'red',
  },
  datePickerStyle: {
    width: 300,
    marginTop: 20,
  },
});

export default RegisterScreen;
