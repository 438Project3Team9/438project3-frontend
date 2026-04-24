import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Text>Hello, user!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:24,backgroundColor:'#f9fafb'},
  title:{fontSize:30,fontWeight:'700',marginTop:50,marginBottom:20},
});
