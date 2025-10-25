import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PieChart } from "react-native-chart-kit";
import { supabase } from "../lib/supabase"; // ✅ Supabase client

export default function MemberPage({ navigation }) {
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [pieData, setPieData] = useState([]);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      // ✅ Fetch unique members by record_id
      const { data, error } = await supabase
        .from("all_services_table")
        .select("record_id, gymPlan, status, vip_status");

      if (error) throw error;

      // ✅ Remove duplicates by record_id
      const uniqueMembers = Array.from(
        new Map(data.map((m) => [m.record_id, m])).values()
      );

      // ✅ Count total unique members
      setTotalMembers(uniqueMembers.length);

      // ✅ Count only ACTIVE members
      const activeCount = uniqueMembers.filter(
        (m) => (m.status || "").toUpperCase() === "ACTIVE"
      ).length;
      setActiveMembers(activeCount);

      // ✅ Count each gymPlan type
      let vipCount = 0;
      let nonCount = 0;
      let walkinCount = 0;

      uniqueMembers.forEach((m) => {
        const plan = (m.gymPlan || "").toLowerCase().trim();
        if (plan.includes("non") || plan === "non") {
          nonCount++;
        } else if (plan.includes("vip")) {
          vipCount++;
        } else if (plan.includes("walk")) {
          walkinCount++;
        }
      });

      // ✅ Build chart data dynamically
      const chartData = [
        {
          name: "VIP",
          population: vipCount,
          color: "#E63946",
          legendFontColor: "#333",
          legendFontSize: 12,
        },
        {
          name: "Non-VIP",
          population: nonCount,
          color: "#5B5B5B",
          legendFontColor: "#333",
          legendFontSize: 12,
        },
        {
          name: "Walk-in",
          population: walkinCount,
          color: "#F77F00",
          legendFontColor: "#333",
          legendFontSize: 12,
        },
      ];

      setPieData(chartData);
    } catch (err) {
      console.error("❌ Error fetching member data:", err);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForLabels: { fontSize: 10, dy: 8 }, // lower labels
  };

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
            <Text style={[styles.AlphaFitnessText, { color: "#E63946" }]}>FITNESS</Text>
          </View>
          <View style={styles.OwnerDashboard}>
            <Text style={[styles.AlphaFitnessText, { fontSize: 10 }]}>Owner Dashboard</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Members Section */}
      <View style={{ padding: 15 }}>
        <Text style={styles.sectionTitle}>Members</Text>

        {/* Cards Row */}
        <View style={styles.cardsRow}>
          <View style={styles.memberCard}>
            <Image source={require("../assets/MemberRed.png")} style={[styles.cardIcon, { width: 50, height: 50 }]} />
            <View style={styles.memberCardColumn2}>
              <Text style={styles.cardLabel}>Total Members</Text>
              <Text style={styles.cardValue}>{totalMembers}</Text>
            </View>
          </View>

          <View style={styles.memberCard}>
            <Image source={require("../assets/Members.png")} style={[styles.cardIcon, { width: 50, height: 50 }]} />
            <View style={styles.memberCardColumn2}>
              <Text style={styles.cardLabel}>Active Members</Text>
              <Text style={styles.cardValue}>{activeMembers}</Text>
            </View>
          </View>
        </View>

        {/* Pie Chart */}
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Membership Distribution</Text>
          {pieData.length > 0 ? (
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
          ) : (
            <Text style={{ textAlign: "center", color: "#888" }}>Loading chart...</Text>
          )}
        </View>
      </View>

      {/* Navigation */}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  Header: { flexDirection: "row", alignItems: "center", padding: 3, marginTop: 30 },
  Logo: { marginRight: 10 },
  AlphaFitness: { flexDirection: "column", alignItems: "center", justifyContent: "center" },
  AlphaFitnessText: { color: "#fff", textAlign: "center", fontFamily: "RussoOne" },
  AlphaFitnessRow: { flexDirection: "row", alignItems: "center" },
  OwnerDashboard: { flexDirection: "row", fontSize: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, fontFamily: "RussoOne" },
  cardsRow: { justifyContent: "space-between", flexDirection: "row", marginBottom: 20 },
  memberCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#00000067",
    padding: 10,
  },
  memberCardColumn2: { flexDirection: "column", alignItems: "center", marginTop: 10 },
  cardIcon: { marginRight: 10 },
  cardLabel: { fontSize: 12.5, color: "#444", fontFamily: "Calibribold" },
  cardValue: { fontSize: 16, fontWeight: "bold" },
  activityCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00000067",
    padding: 10,
    backgroundColor: "#FFF",
    elevation: 5,
  },
  activityTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15, textAlign: "center", fontFamily: "RussoOne" },
  navigation: {
    position: "absolute",
    bottom: 15,
    right: 10,
    left: 10,
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
