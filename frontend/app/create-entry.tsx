import { View, StyleSheet, Text, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { MAIN_LIGHT_BLUE, MAIN_WHITE } from '@/constants/Colors';
import { useState } from "react";
import { API_URL } from "@/constants/api";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {router} from 'expo-router'

export default function CreateEntryScreen() {

  const [serviceName, setServiceName] = useState('')
  const [label, setLabel] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleEntryRegister() {
    setSubmitted(true)
    if (!serviceName || !email || !password) {
      setError('Please fill all the required fields')
      return;
    }
    setError('')
    const token = await SecureStore.getItemAsync('token');
    const masterPassword = await SecureStore.getItemAsync('masterPassword');

    try {
      setLoading(true);
      const name = label ? `${serviceName} (${label})` : serviceName;
      await axios.post(`${API_URL}/api/entries`, {
        username: email,
        password: password,
        url: url,
        notes: notes,
        serviceName: name
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Master-Password': masterPassword
        }
      });
      router.back();
    }
    catch {
      setError('An error ocurred while trying to create a new password entry')
    }
    finally {
      setLoading(false);
    }
  }

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20, backgroundColor: MAIN_WHITE, flexGrow: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Create New Password</Text>

        <Text style={styles.label}>
          Service Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, submitted && !serviceName && styles.inputError]}
          value={serviceName}
          onChangeText={setServiceName}
          placeholder="Service Name"
        />

        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="Label (ex: school)"
        />

        <Text style={styles.label}>
          Username <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, submitted && !serviceName && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="Email/Username"
        />

        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, submitted && !serviceName && styles.inputError]}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
        />

        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="Url"
        />

        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
        />

        {error ? <Text
          style={styles.error}>{error}</Text> : null}

        {loading
          ? <ActivityIndicator size={"large"} color={MAIN_LIGHT_BLUE} />
          : <TouchableOpacity
            style={styles.touchable}
            onPress={handleEntryRegister}>
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>
        }
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAIN_WHITE,
  },
  title: {
    color: MAIN_LIGHT_BLUE,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 25
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  text: {
    color: MAIN_WHITE
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
  error: {
    color: 'red',
    marginBottom: 10
  },
  inputError: {
    borderColor: 'red',
  },
  label: {
    width: '80%',
    marginBottom: 4,
    fontSize: 12,
    color: '#666'
  },
  required: {
    color: 'red'
  }
});