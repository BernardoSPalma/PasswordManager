import { API_URL } from "@/constants/api";
import { MAIN_LIGHT_BLUE, MAIN_WHITE } from '@/constants/Colors';
import axios from "axios";
import { BlurView } from "expo-blur";
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { SlideOutDown, ZoomIn } from 'react-native-reanimated';

export default function CreateEntryScreen() {

  const [serviceName, setServiceName] = useState('')
  const [label, setLabel] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  async function handleEntryRegister() {
    setSubmitted(true)
    if (!serviceName || !username || !password) {
      setError('Please fill all the required fields')
      return;
    }
    setError('')
    const token = await SecureStore.getItemAsync('token');
    const masterPassword = await SecureStore.getItemAsync('masterPassword');

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/entries`, {
        username: username,
        label: label,
        password: password,
        url: url,
        notes: notes,
        serviceName: serviceName
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
      setSubmitted(false)
    }
    finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    Keyboard.dismiss()
    setTimeout(() => {
          if (router.canGoBack()) {
            setIsVisible(false);
            setTimeout(() => {
              router.dismiss();
            }, 350);
          } else {
            router.replace('/(tabs)/entries');
          }
        }, 100);
  }

  return (
    <View style={styles.transparentContainer}>

      <BlurView
        intensity={30}
        tint="dark"
        style={StyleSheet.absoluteFill}
        experimentalBlurMethod="dimezisBlurView"
      />

      <TouchableOpacity
        style={StyleSheet.absoluteFillObject}
        onPress={handleDismiss}
        activeOpacity={1}
      />

      {isVisible && (
        <Animated.View
          entering={ZoomIn.springify().damping(85)}
          exiting={SlideOutDown.springify().damping(85)}
          style={styles.card}>

          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView contentContainerStyle={styles.scrollView}
              showsVerticalScrollIndicator={false}>
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
                style={[styles.input, submitted && !username && styles.inputError]}
                value={username}
                onChangeText={setUsername}
                placeholder="Email/Username"
              />

              <Text style={styles.label}>
                Password <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, submitted && !password && styles.inputError]}
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
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12
  },
  transparentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  card: {
    backgroundColor: MAIN_WHITE,
    height: '75%',
    width: '88%',
    borderRadius: 15,
    overflow: 'hidden',
    
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