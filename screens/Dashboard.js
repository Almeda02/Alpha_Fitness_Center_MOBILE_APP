import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';
import { supabase } from '../lib/supabase';

export default function Dashboard({ navigation }) {
  const screenWidth = Dimensions.get('window').width;

  const [totalMembers, setTotalMembers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [prevMonthRevenue, setPrevMonthRevenue] = useState(0);
  const [increaseRevenue, setIncreaseRevenue] = useState(0);
  const [increasePercentage, setIncreasePercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Total members
        const { count: total, error: totalError } = await supabase
          .from('all_services_table')
          .select('record_id', { count: 'exact', head: true });
        if (totalError) throw totalError;

        // Active members
        const { count: active, error: activeError } = await supabase
          .from('all_services_table')
          .select('record_id', { count: 'exact', head: true })
          .ilike('status', '%active%');
        if (activeError) throw activeError;

        // Total Revenue (PAID or ACTIVE)
        const { data: allRevenueData, error: allRevenueError } = await supabase
          .from('all_services_table')
          .select('price, paymentstatus')
          .or('paymentstatus.ilike.PAID,paymentstatus.ilike.ACTIVE');
        if (allRevenueError) throw allRevenueError;
        const totalRev = allRevenueData.reduce((sum, item) => sum + (item.price || 0), 0);

        // Today Revenue (strictly today based on created_at)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(todayStart.getDate() + 1);

        const { data: todayRevenueData, error: todayRevenueError } = await supabase
          .from('all_services_table')
          .select('price, paymentstatus, created_at')
          .or('paymentstatus.ilike.PAID,paymentstatus.ilike.ACTIVE')
          .gte('created_at', todayStart.toISOString())
          .lt('created_at', tomorrowStart.toISOString());
        if (todayRevenueError) throw todayRevenueError;
        const todayRev = todayRevenueData.reduce((sum, item) => sum + (item.price || 0), 0);

        // Previous Month Revenue
        const today = new Date();
        const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        const { data: prevMonthData, error: prevMonthError } = await supabase
          .from('all_services_table')
          .select('price, paymentstatus, created_at')
          .or('paymentstatus.ilike.PAID,paymentstatus.ilike.ACTIVE')
          .gte('created_at', prevMonthStart.toISOString())
          .lte('created_at', prevMonthEnd.toISOString());
        if (prevMonthError) throw prevMonthError;
        const prevRev = prevMonthData.reduce((sum, item) => sum + (item.price || 0), 0);

        // Compute increase revenue and percentage
        const increaseRev = totalRev - prevRev;
        const increasePct = prevRev === 0 ? 0 : (increaseRev / prevRev) * 100;

        // Set states
        setTotalMembers(total);
        setActiveMembers(active);
        setTotalRevenue(totalRev);
        setTodayRevenue(todayRev);
        setPrevMonthRevenue(prevRev);
        setIncreaseRevenue(increaseRev);
        setIncreasePercentage(increasePct.toFixed(1));
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [5000, 8000, 6500, 7200, 9000] }],
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
        <View style={styles.Logo}>
          <Image source={require('../assets/ALPHAFIT_LOGO.png')} style={{ height: 60, width: 60 }} />
        </View>
        <View style={styles.AlphaFitness}>
          <View style={styles.AlphaFitnessRow}>
            <Text style={[styles.AlphaFitnessText, { color: '#5B5B5B' }]}>ALPHA</Text>
            <Text style={[styles.AlphaFitnessText, { color: '#E63946' }]}> FITNESS</Text>
          </View>
          <View style={styles.OwnerDashboard}>
            <Text style={[styles.AlphaFitnessText, { fontSize: 10 }]}>Owner Dashboard</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.Content}>
        <Text style={styles.OverView}>Quick Overview</Text>

        {/* Revenue */}
        <View style={styles.RevenueContainer}>
          <View style={styles.Revenuecolumn1}>
            <Text style={styles.RevenueText}>Total Revenue</Text>
            <Text style={styles.thisMonth}>This Month</Text>
            {loading ? <ActivityIndicator color="#E63946" size="small" /> : (
              <Text style={styles.Revenue}>₱{totalRevenue.toLocaleString()}</Text>
            )}
          </View>
          <View style={styles.Revenuecolumn2}>
            <View style={styles.RevenueRow}>
              <Text style={styles.RevenueLabel}>Previous Month</Text>
              <Text style={styles.Current_Month}>₱{prevMonthRevenue.toLocaleString()}</Text>
            </View>
            <View style={styles.RevenueRow}>
              <Text style={styles.RevenueLabel}>Increase Revenue</Text>
              <Text style={styles.Current_Month}>₱{increaseRevenue.toLocaleString()} ({increasePercentage}%)</Text>
            </View>
          </View>
        </View>

        {/* Members & Sales */}
        <View style={styles.MembersSalesContainer}>
          <View style={styles.MembersRow1}>
            <View style={styles.MembersSalesRow}>
              <Image source={require('../assets/Members.png')} style={{ height: 50, width: 50, marginRight: 5 }} />
            </View>
            <View style={styles.MembersSalesRow1}>
              <Text style={styles.MembersText}>Active Members</Text>
              {loading ? <ActivityIndicator color="#E63946" size="small" /> : (
                <Text style={styles.Members}>{activeMembers}</Text>
              )}
            </View>
          </View>

          <View style={styles.Salesrow}>
            <View style={styles.SalesRow1}>
              <Image source={require('../assets/Sales.png')} style={{ height: 50, width: 50, marginRight: 5 }} />
            </View>
            <View style={styles.SalesRow1}>
              <Text style={styles.SalesText}>Today Revenue</Text>
              {loading ? <ActivityIndicator color="#E63946" size="small" /> : (
                <Text style={styles.Sales}>₱{todayRevenue.toLocaleString()}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Revenue Trend */}
        <Text style={styles.Trend}>Revenue Trend</Text>
        <View style={styles.TableTrend}>
          <BarChart
            data={chartData}
            width={screenWidth - 42}
            height={220}
            yAxisLabel="₱"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            withInnerLines
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

// Styles remain unchanged





const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  Header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'left', backgroundColor: '#e5e5e5ff', padding: 3, marginTop: 30 },
  Logo: { marginRight: 10 },
  AlphaFitness: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  AlphaFitnessText: { color: '#ffffff', textAlign: 'center', fontFamily: 'RussoOne' },
  AlphaFitnessRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  OwnerDashboard: { flexDirection: 'row', fontSize: 10 },
  Content: { flex: 1, padding: 20 },
  OverView: { fontSize: 13, fontFamily: 'RussoOne' },
  RevenueContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, elevation: 5, borderWidth: 2, borderColor: '#00000067', padding: 10, marginTop: 20 },
  Revenuecolumn1: { flex: 1, marginRight: 10 },
  Revenuecolumn2: { flex: 1, marginLeft: -50 },
  RevenueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  RevenueText: { fontSize: 13, fontFamily: 'AROneSansSemiBold' },
  thisMonth: { fontSize: 8, fontFamily: 'RussoOne' },
  Revenue: { fontSize: 20, fontFamily: 'RussoOne' },
  RevenueLabel: { fontSize: 10, fontFamily: 'AROneSans' },
  Current_Month: { fontSize: 8, fontFamily: 'RussoOne' },
  MembersSalesContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  MembersRow1: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, elevation: 5, borderWidth: 2, borderColor: '#00000067', padding: 6 },
  MembersSalesRow: { justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  MembersSalesRow1: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  MembersText: { marginTop: 10, fontSize: 13, fontFamily: 'Calibribold' },
  Members: { fontSize: 20, fontFamily: 'RussoOne', marginBottom: 10 },
  Salesrow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, elevation: 5, borderWidth: 2, borderColor: '#00000067', padding: 10 },
  SalesText: { marginTop: 10, fontSize: 13, fontFamily: 'Calibribold' },
  Sales: { fontSize: 20, fontFamily: 'RussoOne', marginBottom: 5, marginTop: 5 },
  SalesRow1: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  Trend: { marginTop: 30, fontSize: 20, fontFamily: 'RussoOne' },
  TableTrend: { marginTop: 15, backgroundColor: '#fff', borderRadius: 10, elevation: 5, borderWidth: 1, borderColor: '#00000067' },
  navigation: { position: "absolute", bottom: 15, right: 10, left: 10, zIndex: 1, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", borderColor: "#00000067", borderRadius: 30, padding: 10, borderWidth: 1 },
  navigationButton: { justifyContent: 'center', alignItems: 'center' },
  navigationText: { marginTop: 10, fontSize: 10, color: '#0000007c', textAlign: 'center', fontFamily: 'RussoOne' },
});

