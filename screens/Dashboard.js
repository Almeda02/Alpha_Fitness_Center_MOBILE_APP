import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';

export default function Dashboard({ navigation }) {
  const screenWidth = Dimensions.get('window').width;

  // Example data for the bar chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5000, 8000, 6500, 7200, 9000, ],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#DBD6D6',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(230, 57, 70, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 10,
    },
    propsForLabels: {
      fontFamily: 'RussoOne',
      fontSize: 12
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#E63946',
    },
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
            <Text style={styles.Revenue}>₱1,000.00</Text>
          </View>
          <View style={styles.Revenuecolumn2}>
            <View style={styles.RevenueRow}>
              <Text style={styles.RevenueLabel}>Previous Month </Text>
              <Text style={styles.Current_Month}>₱42,100</Text>
            </View>
            <View style={styles.RevenueRow}>
              <Text style={styles.RevenueLabel}>Revenue Change </Text>
              <Text style={styles.Current_Month}>₱3,790 (9.0%)</Text>
            </View>
            <TouchableOpacity style={styles.ExportButton}>
              <Text style={styles.ExportButtonText}>Export Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Members & Sales */}
        <View style={styles.MembersSalesContainer}>
          <View style={styles.MembersRow1}>
            <View style={styles.MembersSalesRow}>
              <Image source={require('../assets/Members.png')} style={{ height: 50, width: 50, marginRight: 5 }} />
              <Text style={styles.Memberspercent}>+8.1</Text>
            </View>
            <View style={styles.MembersSalesRow1}>
              <Text style={styles.MembersText}>Active Members</Text>
              <Text style={styles.Members}>1,000</Text>
            </View>
          </View>

          <View style={styles.Salesrow}>
            <View style={styles.SalesRow1}>
              <Image source={require('../assets/Sales.png')} style={{ height: 50, width: 50, marginRight: 5 }} />
            </View>
            <View style={styles.SalesRow1}>
              <Text style={styles.SalesText}>Today's Sales</Text>
              <Text style={styles.Sales}>42</Text>
            </View>
          </View>
        </View>

        {/* Revenue Trend */}
        <Text style={styles.Trend}>Revenue Trend</Text>
        <View style={styles.TableTrend}>
          <BarChart
            data={data}
            width={screenWidth - 42} // Adjusted for padding
            height={220}
            yAxisLabel="₱"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            withInnerLines={true}
            style={{
              marginVertical: 0,
              borderRadius: 9,
            }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#f5f5f5',
  },
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
  Content: {
    flex: 1,
    padding: 20,
  },
  

  OverView: {
    fontSize: 13,
    fontFamily: 'RussoOne',
  },

  RevenueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#00000067',
    padding: 10,
    
  },
  Revenuecolumn1: {
    flex: 1,
    marginRight: 10,
  },
  Revenuecolumn2: {
    flex: 1,
    marginLeft: 10,
  },
  RevenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  RevenueText: {
    fontSize: 13,
    fontFamily: 'AROneSansSemiBold',
  },
  Revenue: {
    fontSize: 20,
    fontFamily: 'RussoOne',
  },
  RevenueLabel: {
    fontSize: 10,
    fontFamily: 'AROneSans',
  },
  Current_Month: {
    fontSize: 8,
    fontFamily: 'RussoOne',
  },
  ExportButton: {
    backgroundColor: '#E63946',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  ExportButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'RussoOne',
  },

  MembersSalesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    
  },
  MembersRow1: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#00000067',
    padding: 6
  },
  MembersSalesRow: {
    
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  Memberspercent: {
    marginTop: 10,
    fontSize: 10,
    fontFamily: 'RussoOne',
  },
  MembersSalesRow1: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  MembersText: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: 'Calibribold',
  },
  Members: {
    fontSize: 20,
    fontFamily: 'RussoOne',
    marginBottom: 10,
  },
  Salesrow: {
    
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#00000067',
    padding: 3,
    padding : 10, 
    
  },
  SalesText: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: 'Calibribold',
  },
  Sales: {
    fontSize: 20,
    fontFamily: 'RussoOne',
    marginBottom: 5,
    marginTop: 5
  },
   SalesRow1: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  Trend : {
    marginTop: 10,
    fontSize: 20,
    fontFamily: 'RussoOne',
  },

  /*TABLE GRAPH*/
  TableTrend: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#00000067',
  },

  /* Navigation */
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'RussoOne',
    fontSize: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#00000067',
    padding: 10,
    marginBottom: 20,
    margin: 10
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
