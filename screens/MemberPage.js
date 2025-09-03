import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';

export default function MemberPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
        <Text>Transactions</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
        <Text>Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Members')}>
        <Text>Members</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
