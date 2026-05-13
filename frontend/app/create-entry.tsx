import { View, StyleSheet, Text } from "react-native";

export default function CreateEntryScreen(){

    return(
        <View style={styles.container}>
            <Text>Create New Entry</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  }
});