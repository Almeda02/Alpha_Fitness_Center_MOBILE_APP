import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


export default function MemberPage({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#1d3c49ea", "#1e3a46ea", "#0F2027"]}
        style={styles.Header}
      >
        <View style={styles.Logo}>
          <Image
            source={require("../assets/ALPHAFIT_LOGO.png")}
            style={{ height: 60, width: 60 }}
          />
        </View>
        <View style={styles.AlphaFitness}>
          <View style={styles.AlphaFitnessRow}>
            <Text style={[styles.AlphaFitnessText, { color: "#5B5B5B" }]}>
              ALPHA
            </Text>
            <Text style={[styles.AlphaFitnessText, { color: "#E63946" }]}>
              FITNESS
            </Text>
          </View>
          <View style={styles.OwnerDashboard}>
            <Text style={[styles.AlphaFitnessText, { fontSize: 10 }]}>
              Owner Dashboard
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Members Section */}
      <View style={{ padding: 15 }}>
        <Text style={styles.sectionTitle}>Members</Text>

        {/* Cards Row */}
        <View style={styles.cardsRow}>
          <View style={styles.memberCard}>
            <View style={styles.memberCardColumn1}>
              <Image
              source={require("../assets/MemberRed.png")}
              style={[styles.cardIcon, { width: 50, height: 50 }]}
              />
              <Text style={styles.cardGrowth}>+8.1%</Text>
            </View>
            <View style={styles.memberCardColumn2}>
              <Text style={styles.cardLabel}>Total Members</Text>
              <Text style={styles.cardValue}>342</Text>
            </View>
          </View>

          <View style={styles.memberCard}>
            <View style={styles.memberCardColumn1}>
              <Image
              source={require("../assets/Members.png")}
              style={[styles.cardIcon, { width: 50, height: 50 }]}
              />
              <Text style={styles.cardGrowth}>+8.1%</Text>
            </View>
            <View style={styles.memberCardColumn2}>
              <Text style={styles.cardLabel}>Active Members</Text>
              <Text style={styles.cardValue}>342</Text>
            </View>
          </View>
        </View>

        {/* Activity Section */}
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Members Activity</Text>

          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Peak hours</Text>
            <Text style={styles.activityValue}>6-8 PM</Text>
          </View>

          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Average Session</Text>
            <Text style={styles.activityValue}>1.2 Hours</Text>
          </View>

          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Most Popular</Text>
            <Text style={styles.activityValue}>Weight Training</Text>
          </View>

          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Retention Rate</Text>
            <Text style={styles.activityValue}>87%</Text>
          </View>
        </View>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Image
            source={require("../assets/Dashboard.png")}
            style={{ height: 20, width: 30 }}
          />
          <Text style={styles.navigationText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigation.navigate("Transactions")}
        >
          <Image
            source={require("../assets/Transaction.png")}
            style={{ height: 22, width: 30 }}
          />
          <Text style={[styles.navigationText, { marginTop: 7 }]}>
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigation.navigate("Analytics")}
        >
          <Image
            source={require("../assets/Analytics.png")}
            style={{ height: 18, width: 40 }}
          />
          <Text style={styles.navigationText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigation.navigate("Members")}
        >
          <Image
            source={require("../assets/MembersNav.png")}
            style={{ height: 20, width: 30 }}
          />
          <Text style={styles.navigationText}>Members</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  /* Header */
  Header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    marginTop: 30,
  },
  Logo: { marginRight: 10 },
  AlphaFitness: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  AlphaFitnessText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "RussoOne",
  },
  AlphaFitnessRow: { flexDirection: "row", alignItems: "center" },
  OwnerDashboard: { flexDirection: "row", fontSize: 10 },

  /* Section */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "RussoOne",
  },

  /* Cards Row */
  cardsRow: {
   justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 20, 
    
  },
  memberCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#00000067',
    padding: 10,
    
  },

  memberCardColumn1: {
    flexDirection: "column",
    alignItems: "center",
  },
  memberCardColumn2: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    
  },
  cardIcon: { marginRight: 10 },
  cardLabel: { fontSize: 13, color: "#444",fontFamily: "Calibribold" },
  cardValue: { fontSize: 16, fontWeight: "bold" },
  cardGrowth: { fontSize: 12, color: "#22C55E", marginTop: 10, fontFamily: "AROneSansSemiBold" },


  /* Activity Section */
  activityCard: {
    
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00000067",
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 5,
    borderWidth: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "RussoOne",
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 10,
    borderWidth: 0,
    borderColor: '#00000067',
    padding: 10,
    paddingHorizontal: 20,
    margin: 10,
    
  },
  activityLabel: { fontSize: 13, color: "#444" },
  activityValue: { fontSize: 13, fontWeight: "bold" },

  /* Navigation */
  navigation: {
    position: "absolute",
    bottom: 15,
    right: 10,
    left: 10,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 0,
    borderColor: "#00000067",
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
  },
  navigationButton: { justifyContent: "center", alignItems: "center" },
  navigationText: {
    marginTop: 10,
    fontSize: 10,
    color: "#0000007c",
    textAlign: "center",
    fontFamily: "RussoOne",
  },
});
