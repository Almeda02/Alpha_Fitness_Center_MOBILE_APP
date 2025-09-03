import React from 'react';
import { View, Text, Button,Image, StyleSheet,TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';




export default function LoginPage({ navigation }) {
  return (
    
    <LinearGradient
      colors={['#0F0F0F', '#222222', '#414141ff','#474747','#6B6B6B']} 
      style={styles.container}
    >
      <Image // LOGO
        source={require('../assets/ALPHAFIT_LOGO.png')}
        style={{ width: 200, height: 200, }}
      />

      <Text style={styles.APLHAtext}>
        <Text style={{color: '#ffffff'}}>WELCOME TO </Text>
        <Text style={{color: '#7a7a7a'}}>ALPHA </Text>
        <Text style={{color: '#e63946'}}>FITNESS</Text>
      </Text>

        <Text style={styles.Text}>You weren’t born to be average. You were built </Text>
        <Text style={[styles.Text, {marginBottom: 25}]}> to be Alpha.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  APLHAtext: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'RussoOne',
  },
  Text: {
    fontSize: 13,
    marginBottom: 0,
    fontFamily: 'AROneSans',
    color: '#7a7a7a',
  },
  button: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  
   
});
