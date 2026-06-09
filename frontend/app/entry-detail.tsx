import { View, StyleSheet, Text, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { MAIN_LIGHT_BLUE, MAIN_WHITE } from '@/constants/Colors';
import { API_URL } from "@/constants/api";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from "react";

type EntryDetail = {
  id: number,
  name: string,
  username: string,
  password: string,
  url: string,
  notes: string,
}

export default function CreateDetailsScreen(){
    const [selectedEntry, setSelectedEntry] = useState<EntryDetail | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [error, setError] = useState('');
    const {id} = useLocalSearchParams();

    useEffect(() => {
        if(id) {
            fetchEntryDetail(Number(id));
        }
    }, [id]);

    async function fetchEntryDetail(id: number){
    setLoadingDetail(true)
    const token = await SecureStore.getItemAsync('token')
    const masterPassword = await SecureStore.getItemAsync('masterPassword')
    try{
      const response = await axios.get(`${API_URL}/api/entries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Master-Password': masterPassword
        }
      });
      setSelectedEntry(response.data)
    } catch (error) {
      setError('Error trying to get the details')
    }
    finally{
      setLoadingDetail(false)
    }
  }

  return(
    <View style={styles.transparentContainer}>

        <TouchableOpacity
            style={{flex:1}}
            onPress={() => router.dismiss()}
            activeOpacity={1}
        />

        <View style={styles.card}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.title}>Details</Text>
                </ScrollView>
                

            </KeyboardAvoidingView>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    transparentContainer: {
       justifyContent: 'flex-end',
        flex: 1
    },
    card: {
        height: '60%',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    container: {
        flex: 1,
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8
    },
    scrollView: {
        alignItems: 'center', 
        padding: 10,
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: MAIN_WHITE,
        borderRadius: 15,
    },
    title: {
        color: MAIN_LIGHT_BLUE,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center'
    },
})