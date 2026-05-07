import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_BASE_URL = 'http://localhost:9090/api/expenses';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState(3);

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
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Could not load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleEdit = (item) => {
    setEditingId(item.expenseId);
    setMerchantName(item.merchantName || '');
    setAmount(item.amount?.toString() || '');
    setSelectedCategory(item.categoryId || 3);
    setDate(item.expenseDate ? item.expenseDate.split("T")[0] : new Date().toISOString().split('T')[0]);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete Expense", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/${id}`, { 
              method: 'DELETE', 
              credentials: 'include' 
            });
            if (!response.ok) throw new Error();
            fetchExpenses();
          } catch (err) {
            alert("Delete failed — check backend");
          }
        }
      }
    ]);
  };

  const handleSave = async () => {
    if (!merchantName.trim() || !amount || isNaN(Number(amount))) {
      alert("Please enter a valid merchant and amount");
      return;
    }

    const expenseData = {
      categoryId: selectedCategory,
      amount: parseFloat(amount),
      merchantName: merchantName.trim(),
      expenseDate: `${date}T00:00:00Z`,
      currencyCode: 'USD'
    };

    try {
      const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
        credentials: 'include'
      });

      if (!response.ok) throw new Error();

      setModalVisible(false);
      resetForm();
      fetchExpenses();
    } catch (err) {
      alert("Save failed — check backend");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setMerchantName('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedCategory(3);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#003580" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.expenseId.toString()}
          renderItem={({ item }) => {
            const cat = categories.find(c => c.id === item.categoryId) || { name: 'Other', color: '#ddd' };
            return (
              <View style={styles.card}>
                <View style={[styles.icon, { backgroundColor: cat.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.merchant}>{item.merchantName}</Text>
                  <Text style={[styles.categoryTag, { color: cat.color }]}>{cat.name.toUpperCase()}</Text>
                  <Text style={styles.date}>{item.expenseDate?.split('T')[0]}</Text>
                </View>
                <View style={styles.rightContent}>
                  <Text style={styles.amount}>${parseFloat(item.amount).toFixed(2)}</Text>
                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={[styles.actionBtn, styles.editBtn]}>
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.expenseId)} style={[styles.actionBtn, styles.delBtn]}>
                      <Text style={styles.delBtnText}>Del</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{editingId ? "Edit Transaction" : "New Expense"}</Text>
          <Text style={styles.label}>Merchant</Text>
          <TextInput style={styles.input} value={merchantName} onChangeText={setMerchantName} placeholder="e.g. Target" />
          <Text style={styles.label}>Amount</Text>
          <TextInput style={styles.input} keyboardType="decimal-pad" value={amount} onChangeText={setAmount} placeholder="0.00" />
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory}>
              {categories.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
            </Picker>
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={styles.btnText}>Save Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
            <Text style={{ color: '#666', textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#003580' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 15, marginTop: 12, padding: 15, borderRadius: 16, elevation: 2 },
  icon: { width: 44, height: 44, borderRadius: 10, marginRight: 15 },
  merchant: { fontSize: 16, fontWeight: '700', color: '#1A1C1E' },
  categoryTag: { fontSize: 10, fontWeight: '800', marginTop: 2, letterSpacing: 0.5 },
  date: { fontSize: 12, color: '#888', marginTop: 2 },
  rightContent: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '800', color: '#1A1C1E' },
  actionRow: { flexDirection: 'row', marginTop: 8 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, marginLeft: 8 },
  editBtn: { backgroundColor: '#003580' },
  delBtn: { backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#d32f2f' },
  editBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  delBtnText: { color: '#d32f2f', fontSize: 11, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#003580', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 30, fontWeight: '300' },
  modal: { flex: 1, padding: 30, paddingTop: 80, backgroundColor: '#fff' },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#003580', marginBottom: 25 },
  label: { fontSize: 11, fontWeight: '700', color: '#A0AEC0', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: '#F7FAFC', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EDF2F7' },
  pickerContainer: { backgroundColor: '#F7FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#EDF2F7', marginBottom: 25 },
  btn: { backgroundColor: '#003580', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});