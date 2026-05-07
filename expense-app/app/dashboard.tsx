import DashboardScreen from './(tabs)/index';
import BottomNav from './(tabs)/BottomNav';
import React from 'react';
import { View } from 'react-native';

export default function DashboardRoute() {
  // Render the same dashboard screen but also include the BottomNav so
  // the navbar appears when visiting /dashboard directly.
  return (
    <View style={{ flex: 1 }}>
      <DashboardScreen />
      <BottomNav />
    </View>
  );
}
