import React, { useState } from 'react';
import { View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Icon from 'react-native-vector-icons/FontAwesome';


export default function SignInPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  return (
   <ScrollView contentContainerStyle={styles.container}>
      {/* Top Title */}
      <Text style={styles.title}>
        ALPHA <Text style={styles.titleHighlight}>FITNESS</Text>
      </Text>

    <View style={styles.Graycontainer}>
      
      {/* Logo */}
      <Image
        source={require("../assets/ALPHAFIT_LOGO.png")} // Add your logo here
        style={styles.logo}
      />

      {/* Owner Portal Label */}
      <Text style={styles.portalText}>OWNER PORTAL</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={25} color="#aaa" style={styles.icon} /> 
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      </View>

      {/* Password Input */}
      <Text style={[styles.label, { marginTop: 15 }]}>Password</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={25} color="#aaa" style={styles.icon} /> 
      <TextInput
        style={styles.input}
        
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      </View>

      {/* Remember Me */}
      <TouchableOpacity
        style={styles.rememberContainer}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity >
        <Text style={styles.forgotPassword}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    
    paddingTop: 70,
  },
  Graycontainer: {
    backgroundColor: "#cecece52",
    width: "100%",  
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 70,
    paddingBottom: 50
    
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 50,
  },
  titleHighlight: {
    color: "#E53935",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 20,
  },
  portalText: {
    fontSize: 18,
    color: "#E53935",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: "#444",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  inputContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#0000008e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 15,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#666",
    marginRight: 8,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#1976D2",
    borderColor: "#1976D2",
  },
  rememberText: {
    color: "#333",
    fontSize: 14,
  },
  signInButton: {
    width: "100%",
    backgroundColor: "#E53935",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  signInText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#1976D2",
    fontSize: 14,
    marginTop: 15,
  },
});