import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../lib/supabase";

export default function AnalyticsPage({ navigation }) {
  const [selectedRange, setSelectedRange] = useState("Week");
  const [barData, setBarData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [loading, setLoading] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchRevenueData(selectedRange);
  }, [selectedRange]);

  const fetchRevenueData = async (range) => {
    setLoading(true);

    // ✅ Calculate date range: current + previous month
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("all_services_table")
      .select("record_id, price, created_at")
      .gte("created_at", startOfPrevMonth.toISOString())
      .lte("created_at", endOfCurrentMonth.toISOString());

    if (error) {
      console.error("❌ Supabase error:", error);
      setLoading(false);
      return;
    }

    // ✅ Filter unique record_id to avoid duplicates
    const uniqueData = Array.from(
      new Map(data.map((item) => [item.record_id, item])).values()
    );

    const grouped = groupDataByRange(uniqueData, range);
    setBarData({
      labels: grouped.labels,
      datasets: [{ data: grouped.values }],
    });

    setLoading(false);
  };

  const groupDataByRange = (data, range) => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = {};

    data.forEach((item) => {
      if (!item.created_at) return;
      const createdAt = new Date(item.created_at);
      const price = Number(item.price) || 0;

      if (range === "Week") {
        const dayName = createdAt.toLocaleDateString("en-US", { weekday: "short" });
        result[dayName] = (result[dayName] || 0) + price;
      } else if (range === "Monthly") {
        const monthName = createdAt.toLocaleDateString("en-US", { month: "short" });
        result[monthName] = (result[monthName] || 0) + price;
      } else if (range === "Yearly") {
        const year = createdAt.getFullYear().toString();
        result[year] = (result[year] || 0) + price;
      }
    });

    if (range === "Week") {
      return {
        labels: weekdays,
        values: weekdays.map((d) => result[d] || 0),
      };
    } else if (range === "Monthly") {
      return {
        labels: months,
        values: months.map((m) => result[m] || 0),
      };
    } else if (range === "Yearly") {
      const years = Object.keys(result).sort();
      return {
        labels: years,
        values: years.map((y) => result[y]),
      };
    }

    return { labels: [], values: [] };
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.6,
    propsForLabels: {
      fontSize: 10,
      dy: 8,
    },
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
            <Text style={[styles.AlphaFitnessText, { color: "#E63946" }]}> FITNESS</Text>
          </View>
          <View style={styles.OwnerDashboard}>
            <Text style={[styles.AlphaFitnessText, { fontSize: 10 }]}>Owner Dashboard</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Analytics Section */}
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.analyticsTitle}>Analytics</Text>
          <View style={styles.dropdownWrapper}>
            <Picker
              selectedValue={selectedRange}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedRange(itemValue)}
            >
              <Picker.Item label="Week" value="Week" />
              <Picker.Item label="Monthly" value="Monthly" />
              <Picker.Item label="Yearly" value="Yearly" />
            </Picker>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Revenue (₱)</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#E63946" />
        ) : (
          <ScrollView horizontal>
            <BarChart
              data={barData}
              width={Math.max(barData.labels.length * 60, screenWidth - 40)}
              height={220}
              chartConfig={chartConfig}
              fromZero
              showValuesOnTopOfBars
              verticalLabelRotation={0}
              yAxisSuffix="₱"
              yAxisInterval={1}
              segments={5}
              style={styles.chart}
            />
          </ScrollView>
        )}
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
