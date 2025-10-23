import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { supabase } from "../lib/supabase"; // ✅ make sure path is correct

export default function Transaction({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0); // ✅ new state for paid sum
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [search, setSearch] = useState("");

  // ✅ Fetch transactions from Supabase
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("members")
      .select(
        "id, fullname, vip_status, paymentstatus, createdAt, walkinpayment"
      );

    if (error) {
      console.error("❌ Error fetching transactions:", error.message);
      return;
    }

    // ✅ Format for display
    const formatted = data.map((item) => ({
      id: item.id,
      name: item.fullname,
      membership: item.vip_status || "N/A",
      price: `₱${item.walkinpayment || 0}`,
      date: new Date(item.createdAt).toLocaleDateString(),
      status:
        item.paymentstatus?.charAt(0).toUpperCase() +
        item.paymentstatus?.slice(1),
    }));

    setTransactions(formatted);

    // ✅ Compute total sum for "Paid" status
    const today = new Date().toISOString().split("T")[0];
    const todayRevenueSum = data
      .filter(
        (item) =>
          item.paymentstatus &&
          item.paymentstatus.toLowerCase() === "paid" &&
          item.createdAt.split("T")[0] === today
      )
      .reduce((sum, item) => sum + (item.walkinpayment || 0), 0);

    setTotalPaid(todayRevenueSum);
  };

  useEffect(() => {
    fetchTransactions();

    // ✅ Real-time updates from Supabase
    const subscription = supabase
      .channel("members-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        () => fetchTransactions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // ✅ Summary calculation
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + parseFloat(t.price.replace(/[₱,]/g, "")),
    0
  );
  const completedCount = transactions.filter(
    (t) => t.status?.toLowerCase().includes("paid")
  ).length;
  const pendingCount = transactions.filter(
    (t) => t.status?.toLowerCase().includes("pending")
  ).length;

  // ✅ Filtering logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesStatus =
      selectedStatus === "Status" || t.status === selectedStatus;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // ✅ Render card
  const renderTransaction = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardMembership}>{item.membership}</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.cardPrice}>{item.price}</Text>
          <View
            style={[
              styles.statusBadge,
              item.status === "PAID"
                ? { backgroundColor: "#d1f5d3" }
                : { backgroundColor: "#fbe4b4" },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: item.status === "PAID" ? "#2d8a42" : "#8a6d2d",
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

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
              {" "}
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

      {/* Summary */}
      <Text style={styles.TransactionTitle}>Transactions</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Todays Paid Revenue:</Text>
          <Text style={styles.summaryValue}>₱{totalPaid.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#d1f5d3" }]}>
          <Text style={[styles.summaryValue, { color: "#2d8a42" }]}>
            {completedCount}
          </Text>
          <Text style={styles.summaryTitle}>Completed</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#fbe4b4" }]}>
          <Text style={[styles.summaryValue, { color: "#8a6d2d" }]}>
            {pendingCount}
          </Text>
          <Text style={styles.summaryTitle}>Pending</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterDropdown}
          onPress={() =>
            setSelectedStatus(
              selectedStatus === "PAID"
                ? "PENDING"
                : selectedStatus === "PENDING"
                ? "Status"
                : "PAID"
            )
          }
        >
          <Text style={{ color: "#000" }}>{selectedStatus}</Text>
          <Icon name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Icon name="search" size={16} color="#aaa" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Filter Name"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Navigation */}
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

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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
  AlphaFitnessText: { color: "#fff", textAlign: "center", fontFamily: "RussoOne" },
  AlphaFitnessRow: { flexDirection: "row", alignItems: "center" },
  OwnerDashboard: { flexDirection: "row", fontSize: 10 },

  TransactionTitle: {
    fontSize: 15,
    fontFamily: "RussoOne",
    marginTop: 20,
    paddingHorizontal: 10,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 2,
  },
  summaryTitle: { fontSize: 12, color: "#333" },
  summaryValue: { fontSize: 18, fontWeight: "bold", color: "#000" },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  cardMembership: { fontSize: 12, color: "#666" },
  cardDate: { fontSize: 12, color: "#888", marginTop: 4 },
  cardPrice: { fontSize: 14, fontWeight: "bold", color: "#000" },
  statusBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: "flex-end",
  },
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
  navigationText: {
    marginTop: 10,
    fontSize: 10,
    color: "#0000007c",
    textAlign: "center",
    fontFamily: "RussoOne",
  },
});
