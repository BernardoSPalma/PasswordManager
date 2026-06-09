import { useState } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '@/constants/api';

export default function CreateDetailsScreen(){
    const [selectedEntry, setSelectedEntry] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [error, setError] = useState('');

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
}