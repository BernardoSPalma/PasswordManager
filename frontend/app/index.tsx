import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {router} from 'expo-router';

export default function homeScreen(){

  const { width } = Dimensions.get('window');

  return(
    
    <LinearGradient
      colors={['#1E293B', '#0F172A']} 
      style={styles.container}
    >
     <View style={styles.container}>
        
          <TouchableOpacity 
            onPress = {() => {router.replace('/register')}}
            style={styles.button}
            activeOpacity={0.8}
          >
            
            <Text style={styles.text}>Create an account</Text>

          </TouchableOpacity>

          <TouchableOpacity 
            onPress = {() => {router.replace('/login')}}
             style={styles.button}
             activeOpacity={0.8}
          >

            <Text style={styles.text}>Enter on your account</Text>

          </TouchableOpacity>

      </View>

    </LinearGradient>
    
   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, 
  },
  button: {
    width: '100%',
    backgroundColor: '#38BDF8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})