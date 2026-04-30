import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';

const API_BASE_URL = 'http://localhost:9090/api/expenses';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State - Adjusted to match Backend Schema
  const [editingId, setEditingId] = useState(null);
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  // --- FETCH DATA ---
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      alert("Failed to connect to backend. Check your IP/Port!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- HANDLERS ---

  const handleAddNew = () => {
    const today = new Date().toISOString().split('T')[0]; 
    setEditingId(null);
    setMerchantName('');
    setAmount('');
    setDate(today);
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.expenseId);
    setMerchantName(item.merchantName || '');
    setAmount(item.amount.toString());
    // Extract date string from ISO format
    setDate(item.expenseDate ? item.expenseDate.split('T')[0] : ''); 
    setModalVisible(true);
  };

  const handleSave = async () => {

    if (editingId) {
      console.log(`Updating Expense ${editingId}:`, { merchantName, amount, date });
    } else {
      console.log("Creating New Expense:", { merchantName, amount, date });
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Expenses</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Text style={styles.addButtonText}>+ Add New Expense</Text>
      </TouchableOpacity>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.expenseId.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 2 }}>
                <Text style={styles.cellDate}>
                  {item.expenseDate ? item.expenseDate.split('T')[0] : 'No Date'}
                </Text>
                <Text style={styles.cellName}>{item.merchantName || "Uncategorized"}</Text>
              </View>
              
              <Text style={styles.cellAmount}>${item.amount.toFixed(2)}</Text>
              
              <TouchableOpacity 
                style={styles.editButtonSmall} 
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No expenses found.</Text>}
        />
      )}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.modalView}
          >
            <Text style={styles.modalHeader}>
              {editingId ? "Edit Expense" : "Add New Expense"}
            </Text>
            
            <Text style={styles.label}>Amount</Text>
            <TextInput 
              style={styles.input} 
              placeholder="0.00" 
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            
            <Text style={styles.label}>Merchant / Description</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Burrito, Starbucks" 
              value={merchantName}
              onChangeText={setMerchantName}
            />

            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput 
              style={styles.input} 
              value={date}
              onChangeText={setDate}
            />

            <TouchableOpacity style={styles.saveAction} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelAction} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  addButton: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    justifyContent: 'space-between'
  },
  cellDate: { fontSize: 12, color: '#888' },
  cellName: { fontSize: 16, fontWeight: '600', color: '#333' },
  cellAmount: { flex: 1, fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginRight: 15, color: '#2e7d32' },
  editButtonSmall: { backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  editButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '90%', backgroundColor: 'white', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  saveAction: { backgroundColor: '#2e7d32', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelAction: { padding: 16, alignItems: 'center' },
  cancelButtonText: { color: '#666', fontWeight: '600' },
});