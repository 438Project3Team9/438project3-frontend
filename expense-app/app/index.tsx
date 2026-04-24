import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const handleLogin = () => {
    // Ouath2 login logic would go here.
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>
      <Text style={styles.subtitle}>Track your spending and view monthly insights.</Text>

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login(test)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});