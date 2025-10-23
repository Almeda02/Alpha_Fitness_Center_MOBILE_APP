import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';
import { supabase } from '../lib/supabase'; // ✅ Ensure correct path

export default function Dashboard({ navigation }) {
  const screenWidth = Dimensions.get('window').width;

  // 🔹 State Variables
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [prevMonthRevenue, setPrevMonthRevenue] = useState(0);
  const [increaseRevenue, setIncreaseRevenue] = useState(0);
  const [increasePercent, setIncreasePercent] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]); // 📊 Weekly revenue by weekday

  // 🔹 Fetch Dashboard Data on Mount
  useEffect(() => {
    fetchDashboardData();
    fetchWeeklyRevenue();
  }, []);

  // ✅ Logout Function
  const handleLogout = async () => {
    const confirmLogout = await new Promise((resolve, reject) => {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => resolve(true) },
        ],
        { cancelable: false },
      );
    });

    if (!confirmLogout) return;

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      Alert.alert('Success', 'You have been logged out.');
      navigation.replace('SignIn'); // redirect to Login screen
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const now = new Date();

      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const { data: thisMonthData, error: thisMonthError } = await supabase
        .from('members')
        .select('walkinpayment, paymentstatus')
        .gte('createdAt', firstDayThisMonth.toISOString())
        .lte('createdAt', now.toISOString())
        .eq('paymentstatus', 'PAID');

      if (thisMonthError) throw thisMonthError;

      const totalRev = thisMonthData.reduce((sum, row) => sum + (row.walkinpayment || 0), 0);
      setTotalRevenue(totalRev);

      const { data: prevMonthData, error: prevMonthError } = await supabase
        .from('members')
        .select('walkinpayment')
        .gte('createdAt', firstDayPrevMonth.toISOString())
        .lte('createdAt', lastDayPrevMonth.toISOString());

      if (prevMonthError) throw prevMonthError;

      const prevRev = prevMonthData.reduce((sum, row) => sum + (row.walkinpayment || 0), 0);
      setPrevMonthRevenue(prevRev);

      const increase = totalRev - prevRev;
      const percent = prevRev > 0 ? ((increase / prevRev) * 100).toFixed(2) : 100;
      setIncreaseRevenue(increase);
      setIncreasePercent(percent);

      const { count: activeCount, error: activeError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE');

      if (activeError) throw activeError;
      setActiveMembers(activeCount || 0);

      const { data: todayData, error: todayError } = await supabase
        .from('members')
        .select('walkinpayment, paymentstatus, createdAt')
        .eq('paymentstatus', 'PAID')
        .gte('createdAt', todayStart.toISOString())
        .lte('createdAt', todayEnd.toISOString());

      if (todayError) throw todayError;

      const todaySum = todayData.reduce((sum, row) => sum + (row.walkinpayment || 0), 0);
      setTodaySales(todaySum);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
    }
  };

  const fetchWeeklyRevenue = async () => {
    try {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('members')
        .select('walkinpayment, createdAt')
        .eq('paymentstatus', 'PAID')
        .gte('createdAt', monday.toISOString())
        .lte('createdAt', sunday.toISOString());

      if (error) throw error;

      const totals = [0, 0, 0, 0, 0, 0, 0];
      data.forEach((row) => {
        const createdAt = new Date(row.createdAt);
        const weekday = createdAt.getDay();
        const index = weekday === 0 ? 6 : weekday - 1;
        totals[index] += row.walkinpayment || 0;
      });

      setWeeklyData(totals);
    } catch (err) {
      console.error('Error fetching weekly revenue:', err.message);
    }
  };

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: weeklyData.length ? weeklyData : [0, 0, 0, 0, 0, 0, 0] }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#DBD6D6',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 10 },
    propsForLabels: { fontFamily: 'RussoOne', fontSize: 12 },
    propsForDots: { r: '5', strokeWidth: '2', stroke: '#E63946' },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1d3c49ea', '#1e3a46ea', '#0F2027']} style={styles.Header}>
        <View style={styles.HeaderLeft}>
          <Image source={require('../assets/ALPHAFIT_LOGO.png')} style={{ height: 60, width: 60 }} />
          <View style={styles.AlphaFitness}>
            <View style={styles.AlphaFitnessRow}>
              <Text style={[styles.AlphaFitnessText, { color: '#5B5B5B' }]}>ALPHA</Text>
              <Text style={[styles.AlphaFitnessText, { color: '#E63946' }]}> FITNESS</Text>
            </View>
            <Text style={[styles.AlphaFitnessText, { fontSize: 10 }]}>Owner Dashboard</Text>
          </View>
        </View>

        {/* 🔹 Logout Button */}
        <TouchableOpacity style={styles.LogoutButton} onPress={handleLogout}>
          
          <Text style={styles.LogoutText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* --- Rest of your Dashboard Content (unchanged) --- */}
      <View style={styles.Content}>
        <Text style={styles.OverView}>Quick Overview</Text>

        {/* Revenue Section */}
        <View style={styles.RevenueContainer}>
          <View style={styles.Revenuecolumn1}>
            <Text style={styles.RevenueText}>Total Revenue</Text>
            <Text style={styles.Revenue}>₱{totalRevenue.toLocaleString()}</Text>
          </View>
          <View style={styles.Revenuecolumn2}>
            <View style={styles.RevenueRow}>
              <Text style={styles.RevenueLabel}>Previous Month </Text>
              <Text style={styles.Current_Month}>₱{prevMonthRevenue.toLocaleString()}</Text>
            </View>
            <View style={styles.RevenueRow}>
              <Text style={styles.RevenueLabel}>Increase Revenue </Text>
              <Text style={styles.Current_Month}>
                ₱{increaseRevenue.toLocaleString()} ({increasePercent}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Members & Sales */}
        <View style={styles.MembersSalesContainer}>
          <View style={styles.MembersRow1}>
            <Image source={require('../assets/Members.png')} style={{ height: 50, width: 50, marginRight: 5 }} />
            <View>
              <Text style={styles.MembersText}>Active Members</Text>
              <Text style={styles.Members}>{activeMembers}</Text>
            </View>
          </View>

          <View style={styles.Salesrow}>
            <Image source={require('../assets/Sales.png')} style={{ height: 50, width: 50, marginRight: 5 }} />
            <View>
              <Text style={styles.SalesText}>Today Revenue</Text>
              <Text style={styles.Sales}>₱{todaySales.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Revenue Trend */}
        <Text style={styles.Trend}>Revenue Trend (This Week)</Text>
        <View style={styles.TableTrend}>
          <BarChart
            data={data}
            width={screenWidth - 42}
            height={220}
            yAxisLabel="₱"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            withInnerLines={true}
            style={{ marginVertical: 0, borderRadius: 9 }}
          />
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Dashboard')}>
          <Image source={require('../assets/Dashboard.png')} style={{ height: 20, width: 30 }} />
          <Text style={styles.navigationText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Transactions')}>
          <Image source={require('../assets/Transaction.png')} style={{ height: 22, width: 30 }} />
          <Text style={[styles.navigationText, { marginTop: 7 }]}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Analytics')}>
          <Image source={require('../assets/Analytics.png')} style={{ height: 18, width: 40 }} />
          <Text style={styles.navigationText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton} onPress={() => navigation.navigate('Members')}>
          <Image source={require('../assets/MembersNav.png')} style={{ height: 20, width: 30 }} />
          <Text style={styles.navigationText}>Members</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 30,
  },
  HeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  AlphaFitness: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  AlphaFitnessText: { color: '#ffffff', textAlign: 'center', fontFamily: 'RussoOne' },
  AlphaFitnessRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

  LogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  LogoutText: { color: '#E63946', fontFamily: 'RussoOne', fontSize: 12 },

  Content: { flex: 1, padding: 20 },
  OverView: { fontSize: 13, fontFamily: 'RussoOne' },
  RevenueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#00000067',
    padding: 10,
    marginTop: 20,
  },
  Revenuecolumn1: { flex: 1, marginRight: 0 },
  Revenuecolumn2: { flex: 1, marginLeft: -30 },
  RevenueRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  RevenueText: { fontSize: 13, fontFamily: 'AROneSansSemiBold' },
  Revenue: { fontSize: 20, fontFamily: 'RussoOne' },
  RevenueLabel: { fontSize: 10, fontFamily: 'AROneSans' },
  Current_Month: { fontSize: 8, fontFamily: 'RussoOne' },
  MembersSalesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  MembersRow1: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#00000067',
    padding: 6,
  },
  MembersText: { marginTop: 10, fontSize: 13, fontFamily: 'Calibribold' },
  Members: { fontSize: 20, fontFamily: 'RussoOne', marginBottom: 10 },
  Salesrow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#00000067',
    padding: 10,
  },
  SalesText: { marginTop: 10, fontSize: 13, fontFamily: 'Calibribold' },
  Sales: { fontSize: 20, fontFamily: 'RussoOne', marginBottom: 5, marginTop: 5 },
  Trend: { marginTop: 30, fontSize: 20, fontFamily: 'RussoOne' },
  TableTrend: {
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#00000067',
  },
  navigation: {
    position: 'absolute',
    bottom: 15,
    right: 10,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
  },
  navigationButton: { justifyContent: 'center', alignItems: 'center' },
  navigationText: {
    marginTop: 10,
    fontSize: 10,
    color: '#0000007c',
    textAlign: 'center',
    fontFamily: 'RussoOne',
  },
});
