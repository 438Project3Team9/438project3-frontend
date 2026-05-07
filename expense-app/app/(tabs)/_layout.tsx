import { Tabs } from 'expo-router';
import BottomNav from './BottomNav';

export default function TabsLayout() {
  return (
    <>
      <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />

        <Tabs.Screen name="expenses" options={{ title: 'Expenses' }} />
        <Tabs.Screen name="analytics" options={{ title: 'Analytics' }} />
        {/* <Tabs.Screen name="profile" options={{ title: 'Profile' }} /> */}
      </Tabs>
      <BottomNav />
    </>
  );
}