import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '@/constants/api';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Entry = {
  id: number,
  name: string,
  url: string,
  createdAt: string
}

export default function EntriesScreen(){

    const[list, setList] = useState<Entry[]>([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState('');

    async function fetchEntries(){
      const token = await SecureStore.getItemAsync('token');
      
      try{
        const response = await axios.get(`${API_URL}/api/entries`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setList(response.data)

      }catch(error){
        setError('Error trying to get password entries')
      }
      finally{
        setLoading(false)
      }
    }
    
    useEffect(() => {
      fetchEntries();
    }, []);


    if(loading){
      return(
        <View style={styles.container}>
          <ActivityIndicator size={'large'} color={'#38BDF8'}/>
        </View>
      )
    }

    if(error){
      return(
        <View style={styles.container}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )
    }

    return(
        <View style ={styles.container}>
          <FlatList
            data = {list}
            keyExtractor={(entry) => entry.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.entryContainer}>
                <Text>{item.name} </Text>
              </View>
            )} 
          />

          <TouchableOpacity
            onPress={() => router.push('/create-entry')} style={styles.createButton}>
              <Ionicons name={"add"} size={24} color="white"/>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  entryContainer: {
    flex: 1,
    backgroundColor: '#dddddd',
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderRadius: 8,
    padding: 15
  },
  createButton: {
    backgroundColor: "#38BDF8",
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    }
});