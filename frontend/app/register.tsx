import { API_URL } from '@/constants/api';
import axios from 'axios';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { MAIN_LIGHT_BLUE, MAIN_WHITE } from '@/constants/Colors';

export default function registerScreen(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validatePassword(password: string): boolean{
      if(!email || !password){
        setError('Please fill all the fields')
        return false;
      }
      if(!emailRegex.test(email)){
        setError('Invalid email format')
        return false;
      }
      if(password.length < 8){
        setError("Password must have at least 8 characters")
        return false;
      }
      if(!/[A-Z]/.test(password)){
        setError('Password must have at least one uppercase letter')
        return false;
      }
      if(!/[a-z]/.test(password)){
        setError('Password must have at least one lowercase letter')
        return false;
      }
      if(!/[0-9]/.test(password)){
        setError('Password must have at least one number')
        return false;
      }
      return true;
    }

    async function handleRegister(){
      if(!validatePassword(password)){
        return;
      }

      setError('')
      try{
      setLoading(true)
      const response = await axios.post(`${API_URL}/api/auth/register`,{
        email: email,
        password: password
      });

      const loginResponse = await axios.post(`${API_URL}/api/auth/login`,{
        email: email,
        password: password
      });

      await SecureStore.setItemAsync('token', loginResponse.data.token);
      await SecureStore.setItemAsync('MasterPassword', password);
      
      router.replace('/(tabs)/entries');
    
    } catch (error) {
      if(axios.isAxiosError(error)){
        if(error.response?.status === 409){
          setError('Email already in use')
        }
        else{
          setError('Error creating account')
        }
      }
      else{
        setError('Unexpected error, please try again')
      }
    }
    finally{
      setLoading(false)
    }
  }


    return(
        <View style={styles.container}>
            
            <Text style={styles.title}>Create Your Account</Text>

            <TextInput 
                style={styles.input}
                value={email} 
                onChangeText={setEmail}
                placeholder="Email"
                />
            
            <View style={styles.passwordContainer}>
              <TextInput
                  secureTextEntry ={!showPassword}
                  style={styles.passwordInput}
                  value={password} 
                  onChangeText={setPassword}
                  placeholder="Password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="grey" />
              </TouchableOpacity>
            </View>
            
            {error ? <Text 
                style={styles.error}>{error}</Text> : null}
            
            {loading 
              ? <ActivityIndicator size="large" color = {MAIN_LIGHT_BLUE} />
              : <TouchableOpacity
                  style={styles.touchable}
                  onPress={handleRegister}>
                      <Text style={styles.text}>Register</Text>
              </TouchableOpacity>
            }

            <Text style={styles.textCreateAccount}>
              Already have an account? Enter <Text onPress={() => {router.replace('/login')}} style={styles.buttonCreateAccount}>here</Text>
            </Text>

            <TouchableOpacity
                onPress={() => {router.replace('/')}}>
                <Ionicons name={"home"} size={15} color={MAIN_LIGHT_BLUE}/>
            </TouchableOpacity>

        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAIN_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10
  },
  touchable: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: MAIN_LIGHT_BLUE,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginTop: 10
  },
  text: {
    color: '#fff'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 25
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    paddingRight: 10,
  },
  textCreateAccount: {
    margin: 25,
    fontSize: 12,
  },
  buttonCreateAccount: {
    color: MAIN_LIGHT_BLUE
  }
});