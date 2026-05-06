import { API_URL } from '@/constants/api';
import axios from 'axios';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function loginScreen(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleLogin(){
      if(!email || !password){
        setError('Please fill all the fields')
        return;
      }
      setError('')
      try{
      setLoading(true)
      const response = await axios.post(`${API_URL}/api/auth/login`,{
        email: email,
        password: password
      });

      await SecureStore.setItemAsync('token', response.data.token);
      await SecureStore.setItemAsync('MasterPassword', password);
      
      router.replace('/(tabs)/entries');
    
    } catch (error) {
      if(axios.isAxiosError(error)){
        if(error.response?.status === 401){
          setError('Incorrect password')
        }
        else if(error.response?.status === 404){
          setError('Email not registered')
        }
        else{
          setError('Error loading account')
        }
      }
      else{
        setError('Unexpected error, try again later')
      }
    }
    finally{
      setLoading(false)
    }
  }


    return(
        <View style={styles.container}>
            
            <Text style={styles.title}>Welcome Again</Text>

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
            ? <ActivityIndicator size={"large"} color={("#38BDF8")} />
            : <TouchableOpacity
                style={styles.touchable}
                onPress={handleLogin}>
                    <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
            }

            <Text style={styles.textCreateAccount}>
              Don't have an account? Create one <Text onPress={() => {router.replace('/register')}} style={styles.buttonCreateAccount}>here</Text>
            </Text>

            <TouchableOpacity
                onPress={() => {router.replace('/')}}>
                <Ionicons name={"home"} size={15} color={'#38BDF8'}/>
            </TouchableOpacity>

        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#38BDF8',
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
    color: '#38BDF8'
  }
});