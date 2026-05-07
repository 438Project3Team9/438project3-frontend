import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

const API_BASE_URL = 'http://localhost:9090/api/expenses';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isFocused = useIsFocused(); 

  const categories = [
    { id: 3, name: 'Food', color: '#FFBDAD' },
    { id: 4, name: 'Transport', color: '#4D96FF' },
    { id: 5, name: 'Shopping', color: '#B983FF' },
    { id: 6, name: 'Cafe', color: '#A67C52' },
    { id: 7, name: 'Grocery', color: '#6BCB77' },
    { id: 8, name: 'Bills', color: '#FFD93D' },
    { id: 9, name: 'Entertainment', color: '#FF9F1C' },
  ];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL, { credentials: 'include' });
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic to handle deleting an expense
  const deleteExpense = async (id) => {
  console.log("Trying to delete expense id:", id);

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    console.log("Delete status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Delete failed body:", errorText);
      Alert.alert("Error", `Delete failed: ${response.status}`);
      return;
    }

    setExpenses(prev => prev.filter(expense => expense.expenseId !== id));
  } catch (err) {
    console.error("Delete Error:", err);
    Alert.alert("Error", "Network error while deleting.");
  }
};

  // Re-fetch data every time the user navigates TO this tab
  useEffect(() => { 
    if (isFocused) fetchExpenses(); 
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#003580" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.expenseId.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const cat = categories.find(c => c.id === item.categoryId) || { name: 'Other', color: '#ddd' };
            return (
              <View style={styles.card}>
                {/* Category Icon */}
                <View style={[styles.icon, { backgroundColor: cat.color, justifyContent: 'center', alignItems: 'center' }]}>
                   <Text style={{color: '#fff', fontWeight: 'bold'}}>{cat.name.charAt(0)}</Text>
                </View>

                {/* Expense Details */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.merchant}>{item.merchantName}</Text>
                  <Text style={[styles.categoryTag, { color: cat.color }]}>{cat.name.toUpperCase()}</Text>
                </View>

                {/* Amount and Actions */}
                <View style={styles.rightContent}>
                  <Text style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>
                  <View style={styles.actionRow}>
                    {/* Edit Button */}
                    <TouchableOpacity 
                      onPress={() => router.push({ pathname: '/add', params: { editData: JSON.stringify(item) } })} 
                      style={[styles.actionBtn, styles.editBtn]}
                    >
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>

                    {/* Delete Button */}
                    <TouchableOpacity 
                      onPress={() => deleteExpense(item.expenseId)} 
                      style={[styles.actionBtn, styles.deleteBtn]}
                    >
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#003580' },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    marginHorizontal: 15, 
    marginTop: 12, 
    padding: 15, 
    borderRadius: 16, 
    elevation: 2 
  },
  icon: { width: 44, height: 44, borderRadius: 10, marginRight: 15 },
  merchant: { fontSize: 16, fontWeight: '700', color: '#1A1C1E' },
  categoryTag: { fontSize: 10, fontWeight: '800', marginTop: 2 },
  rightContent: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '800', color: '#1A1C1E' },
  actionRow: { flexDirection: 'row', marginTop: 8 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  editBtn: { backgroundColor: '#003580' },
  editBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  deleteBtn: { backgroundColor: '#FFEDED', marginLeft: 8 },
  deleteBtnText: { color: '#FF4D4D', fontSize: 11, fontWeight: '700' },
});