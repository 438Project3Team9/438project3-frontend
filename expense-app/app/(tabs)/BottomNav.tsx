import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isHomeActive = pathname === '/' || pathname === '/dashboard';
  const isExpensesActive = pathname.startsWith('/expenses');
  const isAnalyticsActive = pathname.startsWith('/analytics');

  return (
    <View style={styles.bottomNav}>
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

      <Pressable
        style={styles.navItem}
        onPress={() => router.push('/add')}
      >
        <MaterialIcons name="add-circle" size={32} color="#00488d" />
        <Text style={styles.navLabel}>Add</Text>
      </Pressable>

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
    position: 'absolute',
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
    zIndex: 99999,
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
    fontSize: 13,
    color: '#6B7280',
  },
  navLabelActive: {
    color: '#00488d',
    fontWeight: '700',
  },
});