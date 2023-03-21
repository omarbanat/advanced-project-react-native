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

import AsyncStorage from '@react-native-async-storage/async-storage';

// import HomeScreen from './src/screens/HomeScreen';

import { theme } from '../styles/theme';

const LoginScreen = ({ navigation }) => {
  // const API_URL =
  //   'https://advanced-project-backend-production.up.railway.app/api';
  // const API_URL = 'http://192.168.0.112:8000/api';
  const API_URL = 'http://172.20.10.4:8000/api';

  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [error, setError] = useState('');

  const loginHandler = async () => {
    try {
      console.log(`${API_URL}/user/getAll`);
      const user = await axios.post(`${API_URL}/login`, {
        email: email.value,
        password: password.value,
      });
      console.log(user);
      if (user.status === 200) {
        console.log('ENTERED');
        try {
          await AsyncStorage.setItem(email.value, user.data.token);
        } catch (error) {
          console.log(error);
        }
        await navigation.navigate('HomeScreen', {
          id: user.data.user.id,
          email: email.value,
        });
      }
    } catch (error) {
      console.log('error: ', error);
      setError(error.request ? error.request['_response'] : error.message);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome to MAKO LMS</Header>
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
      {error && (
        <View>
          <Text style={styles.invalidCredentials}>{error}</Text>
        </View>
      )}
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button onPress={loginHandler} mode="contained">
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
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
  invalidCredentials: {
    fontWeight: 'bold',
    color: 'red',
  },
});

export default LoginScreen;
