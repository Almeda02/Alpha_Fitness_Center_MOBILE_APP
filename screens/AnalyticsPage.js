import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

export default function AnalyticsPage({ navigation }) {
  const [selectedRange, setSelectedRange] = useState("6months");
  const screenWidth = Dimensions.get("window").width;

  // ✅ Create different datasets based on range
  const getBarData = () => {
    switch (selectedRange) {
      case "6months":
        return {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [{ data: [45000, 52000, 47000, 61000, 55000, 67000] }],
        };
      case "12months":
        return {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [{ data: [45000, 52000, 47000, 61000, 55000, 67000, 59000, 62000, 64000, 68000, 71000, 75000] }],
        };
      case "year":
        return {
          labels: ["2021", "2022", "2023", "2024", "2025"],
          datasets: [{ data: [520000, 610000, 590000, 700000, 760000] }],
        };
      default:
        return { labels: [], datasets: [{ data: [] }] };
    }
  };

  const barData = getBarData();

  // Membership data (unchanged)
  const pieData = [
    { name: "Premium", population: 45, color: "#E63946", legendFontColor: "#333", legendFontSize: 12 },
    { name: "Standard", population: 35, color: "#5B5B5B", legendFontColor: "#333", legendFontSize: 12 },
    { name: "Basic", population: 20, color: "#F77F00", legendFontColor: "#333", legendFontSize: 12 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#1d3c49ea", "#1e3a46ea", "#0F2027"]} style={styles.Header}>
        <View style={styles.Logo}>
          <Image source={require("../assets/ALPHAFIT_LOGO.png")} style={{ height: 60, width: 60 }} />
        </View>

        <View style={styles.AlphaFitness}>
          <View style={styles.AlphaFitnessRow}>
            <Text style={[styles.AlphaFitnessText, { color: "#5B5B5B" }]}>ALPHA</Text>
            <Text style={[styles.AlphaFitnessText, { color: "#E63946" }]}> FITNESS</Text>
          </View>
          <View style={styles.OwnerDashboard}>
            <Text style={[styles.AlphaFitnessText, { fontSize: 10 }]}>Owner Dashboard</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Analytics Section */}
      <ScrollView style={{ flex: 1, padding: 15 }}>
        {/* Top bar with title + dropdown */}
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsTitle}>Analytics</Text>
          <View style={styles.dropdownWrapper}>
            <Picker
              label="Select range"
              selectedValue={selectedRange}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedRange(itemValue)}
            >
              <Picker.Item label="Last 6 months" value="6months" />
              <Picker.Item label="Last 12 months" value="12months" />
              <Picker.Item label="This year" value="year" />
            </Picker>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Revenue & Members</Text>
       <ScrollView horizontal> 
        <BarChart
          data={barData}
          width={700}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          style={styles.chart}
        />
        </ScrollView>

        <Text style={styles.sectionTitle}>Membership Distribution</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 30}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
        />
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate("Dashboard")}>
          <Image source={require("../assets/Dashboard.png")} style={{ height: 20, width: 30 }} />
          <Text style={styles.navigationText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate("Transactions")}>
          <Image source={require("../assets/Transaction.png")} style={{ height: 22, width: 30 }} />
          <Text style={[styles.navigationText, { marginTop: 7 }]}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate("Analytics")}>
          <Image source={require("../assets/Analytics.png")} style={{ height: 18, width: 40 }} />
          <Text style={styles.navigationText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate("Members")}>
          <Image source={require("../assets/MembersNav.png")} style={{ height: 20, width: 30 }} />
          <Text style={styles.navigationText}>Members</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  Header: { flexDirection: "row", alignItems: "center", padding: 3, marginTop: 30 },
  Logo: { marginRight: 10 },
  AlphaFitness: { flexDirection: "column", alignItems: "center", justifyContent: "center" },
  AlphaFitnessText: { color: "#ffffff", textAlign: "center", fontFamily: "RussoOne" },
  AlphaFitnessRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  OwnerDashboard: { flexDirection: "row", fontSize: 10 },

  analyticsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  analyticsTitle: { fontSize: 18, fontWeight: "bold" },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    height: 35,
    width: 150,
  },
  picker: { height: 35, width: "100%" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  chart: { borderRadius: 10, marginBottom: 20 },
  navigation: {
    position: "absolute",
    bottom: 15,
    right: 10,
    left: 10,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: "#00000067",
  },
  navigationButton: { justifyContent: "center", alignItems: "center" },
  navigationText: { marginTop: 10, fontSize: 10, color: "#0000007c", textAlign: "center", fontFamily: "RussoOne" },
});
