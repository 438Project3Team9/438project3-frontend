import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BottomNav(){
  const router = useRouter();

  useEffect(() => {
    // debug mount
  console.log('BottomNav mounted');
  }, []);

  return (
  <View style={styles.bottomNav}>
      <Pressable style={[styles.navItem, styles.navItemActive]} onPress={() => router.push('/') }>
        <MaterialIcons name="dashboard" size={22} color="#00488d" />
        <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => router.push('/expenses')}>
        <MaterialIcons name="receipt" size={22} color="#6B7280" />
        <Text style={styles.navLabel}>Expenses</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => router.push('/add')}>
        <MaterialIcons name="add-circle" size={32} color="#00488d" />
        <Text style={styles.navLabel}>Add</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => router.push('/analytics')}>
        <MaterialIcons name="pie-chart" size={22} color="#6B7280" />
        <Text style={styles.navLabel}>Analytics</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // make it visually prominent while debugging
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 99999,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemActive: { backgroundColor: '#e6f0ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  navLabel: { fontSize: 13, color: '#6B7280' },
  navLabelActive: { color: '#00488d' },
});
