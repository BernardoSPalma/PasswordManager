import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {router} from 'expo-router';

export default function homeScreen(){

  const { width } = Dimensions.get('window');

  return(
    
   <View style={styles.container}>
        
        <View style={styles.textContainer}>

          <Text style={styles.title}>Welcome to <Text style={styles.popText}>Fortaleza</Text> </Text>
          <Text style={styles.text}>Keep all your passwords safe in one place</Text>

        </View>

          <TouchableOpacity 
            onPress = {() => {router.replace('/register')}}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            
            <Text style={styles.primaryText}>Create new account</Text>

          </TouchableOpacity>

          <TouchableOpacity 
            onPress = {() => {router.replace('/login')}}
             style={styles.secondaryButton}
             activeOpacity={0.8}
          >

            <Text style={styles.secondaryText}>Enter on your account</Text>

          </TouchableOpacity>

      </View>   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, 
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 35,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10
  },
  text: {
    textAlign: 'center',
    fontSize: 16
  },
  popText: {
    color: '#38BDF8'
  },
  primaryButton: {
    width:'80%',
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
  secondaryButton:{
    width:'80%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#38BDF8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})