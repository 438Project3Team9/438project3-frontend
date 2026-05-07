import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

const API_BASE_URL = 'http://localhost:9090/api/expenses';

export default function AddExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(3);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = [
    { id: 3, name: 'Food' }, { id: 4, name: 'Transport' }, { id: 5, name: 'Shopping' },
    { id: 6, name: 'Cafe' }, { id: 7, name: 'Grocery' }, { id: 8, name: 'Bills' },
    { id: 9, name: 'Entertainment' },
  ];

  useEffect(() => {
    if (params.editData) {
      const item = JSON.parse(params.editData as string);
      setEditingId(item.expenseId);
      setMerchantName(item.merchantName);
      setAmount(item.amount.toString());
      setSelectedCategory(item.categoryId);
      setDate(item.expenseDate.split('T')[0]);
    }
  }, [params.editData]);

  const handleSave = async () => {
    if (!merchantName.trim() || !amount) {
      Alert.alert("Error", "Please fill all fields");
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

      if (response.ok) {
        router.back(); 
      } else {
        throw new Error();
      }
    } catch (err) {
      Alert.alert("Error", "Save failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>{editingId ? "Edit Transaction" : "New Expense"}</Text>
      
      <Text style={styles.label}>Merchant</Text>
      <TextInput style={styles.input} value={merchantName} onChangeText={setMerchantName} placeholder="e.g. Target" />

      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.input} keyboardType="decimal-pad" value={amount} onChangeText={setAmount} placeholder="0.00" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedCategory} onValueChange={(v) => setSelectedCategory(Number(v))}>
          {categories.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
        </Picker>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>{editingId ? "Update Transaction" : "Save Transaction"}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ color: '#666', textAlign: 'center' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, paddingTop: 80, backgroundColor: '#fff' },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#003580', marginBottom: 25 },
  label: { fontSize: 11, fontWeight: '700', color: '#A0AEC0', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: '#F7FAFC', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EDF2F7' },
  pickerContainer: { backgroundColor: '#F7FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#EDF2F7', marginBottom: 25 },
  btn: { backgroundColor: '#003580', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});