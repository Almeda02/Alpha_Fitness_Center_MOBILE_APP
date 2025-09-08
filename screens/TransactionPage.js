import React, { useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/Feather";

export default function Transaction({ navigation }) {
   const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [search, setSearch] = useState("");

  const statuses = ["Completed", "Pending"];

  return (
    <View style={styles.container}>
        {/* Header */}
      <LinearGradient colors={['#1d3c49ea', '#1e3a46ea', '#0F2027']} style={styles.Header}>
            <View style={styles.Logo}>
                <Image source={require('../assets/ALPHAFIT_LOGO.png')} style={{height: 60, width: 60}} />
            </View>

            <View style={styles.AlphaFitness}>
              <View style={styles.AlphaFitnessRow}>
                <Text style={[styles.AlphaFitnessText, {color: '#5B5B5B'}]}>ALPHA</Text>
                <Text style={[styles.AlphaFitnessText, {color: '#E63946'}]}> FITNESS</Text>
              </View>

              <View style={styles.OwnerDashboard}>
                <Text style={[styles.AlphaFitnessText, {fontSize: 10}]}>Owner Dashboard</Text>
              </View>
            </View>
      </LinearGradient>

      {/* Content  */}
      <View style={styles.Content}>
        <Text style={styles.Transaction}>Transactions</Text>

        <View  style={styles.TransactionContainer}>
          <View  style={styles.Revenuecolumn1}>
            <Text style={styles.RevenueText}>Total Revenue</Text>
            <Text style={styles.RevenueAmount}>₱45,890</Text>
          </View>

          <View style={styles.Completedcolumn2}>
            <Text style={styles.CompletedText}>Completed</Text>
            <Text style={[styles.CompletedAmount,{color : '#22C55E'}]}>12</Text>
          </View>

          <View style={styles.Pendingcolumn3}>
            <Text style={styles.PendingText}>Pending</Text>
            <Text style={[styles.PendingAmount, {color: '#DCB756'}]}>3</Text>
          </View>

        </View>

        {/* Status Dropdown */}
    <View style={styles.DDContainer}>    
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setStatusOpen(!statusOpen)}
        >
          <Text style={styles.dropdownText}>{selectedStatus}</Text>
          <Icon name="chevron-down" size={18} color="#555" />
        </TouchableOpacity>

        {statusOpen && (
          <View style={styles.dropdownList}>
            {statuses.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedStatus(item);
                  setStatusOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
       {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Filter Name"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View> 


      </View>

      

     
        
      <View style={styles.navigation}>
              <TouchableOpacity  style={styles.navigationButton} onPress={() => navigation.navigate('Dashboard')}>
                <Image source={require('../assets/Dashboard.png')} style={{height: 20, width: 30}} />
                <Text style={styles.navigationText}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Transactions')}>
                <Image source={require('../assets/Transaction.png')} style={{height: 22, width: 30}} />
                <Text style={[styles.navigationText, {marginTop: 7}]}>Transactions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Analytics')}>
                <Image source={require('../assets/Analytics.png')} style={{height: 18, width: 40}} />
                <Text style={styles.navigationText}>Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Members')}>
                <Image source={require('../assets/MembersNav.png')} style={{height: 20, width: 30}} />
                <Text style={styles.navigationText}>Members</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#f5f5f5',
  },
  /* Header */
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    backgroundColor: '#e5e5e5ff',
    padding: 3,
    marginTop: 30,
  },
  Logo: {
    marginRight: 10,
  },
  AlphaFitness: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  AlphaFitnessText: {
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'RussoOne',
  },
  AlphaFitnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  OwnerDashboard: {
    flexDirection: 'row',
    fontSize: 10,
  },
  /* Content  */
  Content: {
    flex: 1,
    padding: 20,
  },
  Transaction: {
    fontSize: 15,
    fontFamily: 'RussoOne',
  },
  /* Transaction Container */
  TransactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  Revenuecolumn1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00000067',
    borderRadius: 20,
    padding:10,
    margin:5
  },
  RevenueText: {
    fontSize: 10,
    fontFamily: 'RussoOne',
    marginBottom: 5
  },
  RevenueAmount: {
    fontSize: 15,
    fontFamily: 'RussoOne',
  },
  Completedcolumn2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00000067',
    borderRadius: 20,
    padding:10,
    margin:5
  },
  CompletedText: {
    marginBottom: 5,
    fontSize: 10,
    fontFamily: 'RussoOne',
  },
  CompletedAmount: {
    fontSize: 15,
    fontFamily: 'RussoOne',
  },
  Pendingcolumn3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00000067',
    borderRadius: 20,
    padding:10,
    margin:5
  },
  PendingText: {
    marginBottom: 5,
    fontSize: 10,
    fontFamily: 'RussoOne',
  },
  PendingAmount: {
    fontSize: 15,
    fontFamily: 'RussoOne',
  },

  /* Dropdown Container */
  DDContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
    dropdownContainer: {
    position: "relative",
    width: 110,
    marginRight: 10,
    
    
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownList: {
    position: "absolute",
    top: 45,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    elevation: 3,
    zIndex: 999,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  















  /* Navigation  */
 navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin:20,
    marginBottom: 20,
    
    borderWidth: 2,
    borderColor: '#00000067',
    borderRadius: 30,
    padding:10,
    
  },
  navigationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
   navigationText: {
    marginTop: 10,
    fontSize: 10,
    color: '#0000007c',
    textAlign: 'center',
    fontFamily: 'RussoOne',
  },

  
});
