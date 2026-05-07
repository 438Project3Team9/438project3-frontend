import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Logic to determine which tab is currently active
  const isHomeActive = pathname === '/' || pathname === '/dashboard';
  const isExpensesActive = pathname.startsWith('/expenses');
  const isAnalyticsActive = pathname.startsWith('/analytics');

  return (
    <View style={styles.bottomNav}>
      {/* Home / Dashboard */}
      <Pressable
        style={[styles.navItem, isHomeActive && styles.navItemActive]}
        onPress={() => router.push('/dashboard')}
      >
        <MaterialIcons
          name="dashboard"
          size={22}
          color={isHomeActive ? '#00488d' : '#6B7280'}
        />
        <Text style={[styles.navLabel, isHomeActive && styles.navLabelActive]}>
          Home
        </Text>
      </Pressable>

      {/* Expenses List */}
      <Pressable
        style={[styles.navItem, isExpensesActive && styles.navItemActive]}
        onPress={() => router.push('/expenses')}
      >
        <MaterialIcons
          name="receipt"
          size={22}
          color={isExpensesActive ? '#00488d' : '#6B7280'}
        />
        <Text style={[styles.navLabel, isExpensesActive && styles.navLabelActive]}>
          Expenses
        </Text>
      </Pressable>

      {/* Add Expense - Fixed Path */}
      <Pressable
        style={styles.navItem}
        onPress={() => router.push('/add')}
      >
        <MaterialIcons name="add-circle" size={32} color="#00488d" />
        <Text style={styles.navLabel}>Add</Text>
      </Pressable>

      {/* Analytics */}
      <Pressable
        style={[styles.navItem, isAnalyticsActive && styles.navItemActive]}
        onPress={() => router.push('/analytics')}
      >
        <MaterialIcons
          name="pie-chart"
          size={22}
          color={isAnalyticsActive ? '#00488d' : '#6B7280'}
        />
        <Text style={[styles.navLabel, isAnalyticsActive && styles.navLabelActive]}>
          Analytics
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute', // Use 'absolute' for React Native sticky placement
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 999,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: '#e6f0ff',
  },
  navLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#00488d',
    fontWeight: '700',
  },
});