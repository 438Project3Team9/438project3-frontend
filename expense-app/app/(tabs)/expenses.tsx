import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';

const MOCK_DATA = [
  { id: '1', name: 'Food', amount: 45.00, date: '2025-10-01' },
  { id: '2', name: 'Transport', amount: 12.50, date: '2025-10-02' },
  { id: '3', name: 'Shopping', amount: 80.00, date: '2025-10-03' },
];

export default function ExpensesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  // --- HANDLERS ---

  const handleAddNew = () => {
    // Dynamic Date Logic: Always gets "Today"
    const today = new Date().toISOString().split('T')[0]; 
    
    setEditingId(null);
    setName('');
    setAmount('');
    setDate(today); // Auto-fills today's date
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(item.amount.toString());
    setDate(item.date); // Keeps the record's original date
    setModalVisible(true);
  };

  const handleSave = () => {
    if (editingId) {
      console.log(`Updating ID ${editingId}:`, { name, amount, date });
    } else {
      console.log("Creating New Expense:", { name, amount, date });
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense List</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Text style={styles.addButtonText}>+ Add New Expense</Text>
      </TouchableOpacity>
      
      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cellDate}>{item.date}</Text>
            <Text style={styles.cellName}>{item.name}</Text>
            <Text style={styles.cellAmount}>${item.amount.toFixed(2)}</Text>
            
            <TouchableOpacity 
              style={styles.editButtonSmall} 
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      />

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
            
            <Text style={styles.label}>Category / Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Food, Bills" 
              value={name}
              onChangeText={setName}
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
  cellDate: { flex: 2, fontSize: 13, color: '#666' },
  cellName: { flex: 2, fontSize: 15, fontWeight: '500' },
  cellAmount: { flex: 1.5, fontSize: 15, fontWeight: 'bold', textAlign: 'right', marginRight: 10 },
  editButtonSmall: { backgroundColor: '#2e7d32', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  editButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '90%', backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 5 },
  modalHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  saveAction: { backgroundColor: '#2e7d32', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelAction: { padding: 16, alignItems: 'center' },
  cancelButtonText: { color: '#666', fontWeight: '600' },
});