import { API_URL } from '@/constants/api';
import { MAIN_DARK_BLUE, MAIN_LIGHT_BLUE, MAIN_WHITE } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Entry = {
  id: number,
  name: string,
  label: string | null,
  url: string,
  createdAt: string
}

type EntryDetail = {
  id: number,
  name: string,
  label: string | null,
  username: string,
  password: string,
  url: string,
  notes: string,
}

export default function EntriesScreen() {

  const [list, setList] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchEntries() {
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await axios.get(`${API_URL}/api/entries`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(JSON.stringify(response.data));
      setList(response.data)

    } catch (error) {
      setError('Error trying to get password entries')
    }
    finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [])
  );


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={MAIN_LIGHT_BLUE} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Passwords</Text>
      
      <FlatList
        style={styles.flatList}
        data={list}
        keyExtractor={(entry) => entry.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/entry-detail?id=${item.id}`)}>
            <View style={styles.entryContainer}>

              <View style={styles.textContainer}>
                <Text style={styles.text}>{item.name} </Text>
                {item.label ?
                  <Text style={styles.labelText}>{item.label} </Text> : null}
              </View>

              <Ionicons name="chevron-forward" size={20} color={MAIN_DARK_BLUE}/>

            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => router.push('/create-entry')} style={styles.createButton}>
        <Ionicons name={"add"} size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAIN_WHITE,
    justifyContent: 'center',
  },
  error: {
    alignSelf: 'center',
    color: 'red',
    marginBottom: 10
  },
  entryContainer: {
    backgroundColor: MAIN_WHITE,
    borderColor: MAIN_DARK_BLUE,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textContainer:{
    flexDirection: 'column',
    flex:1
  },
  mainTitle: {
    color:MAIN_LIGHT_BLUE,
    alignSelf: 'center',
    fontSize: 35,
    marginTop: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 122,255, 0.2)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15
  },
  createButton: {
    backgroundColor: MAIN_LIGHT_BLUE,
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
  labelText: {
    color: MAIN_LIGHT_BLUE,
    fontSize: 14,
    fontWeight: 'bold'
  }
});