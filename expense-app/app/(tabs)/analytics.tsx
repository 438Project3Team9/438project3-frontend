import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const API_BASE_URL = 'http://localhost:9090';

type Category = {
  categoryId: number;
  name: string;
  iconName: string | null;
  color: string | null;
  isDefault: boolean;
  userId: number;
};

type AnalyticsCategory = {
  id: string;
  label: string;
  amount: number;
  percent: number;
  color: string;
  icon: string;
};

export default function AnalyticsScreen() {
  const [categories, setCategories] = useState<AnalyticsCategory[]>([]);

  useEffect(() => {
    async function fetchCategories() {
        
        try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);

        console.log('Status:', response.status);

        const data: Category[] = await response.json();

        console.log('Fetching categories...');
        console.log('Status:', response.status);
        // console.log('Data:', data);

        console.log('Categories from backend:', data);

        const mappedCategories = data.map((category) => ({
            id: String(category.categoryId),
            label: category.name,
            amount: 0,
            percent: 0,
            color: category.color ?? '#605e5c',
            icon: category.iconName ?? 'category',
        }));

        console.log('Mapped categories:', mappedCategories);
        setCategories(mappedCategories);
        } catch (error) {
        console.error('Failed to fetch categories:', error);
        }
    }

    fetchCategories();
    }, []);

  const total = categories.reduce((s, c) => s + c.amount, 0);

  return (
    <ScrollView style={styles.canvas} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Spending Stats</Text>
        <View style={styles.selector}>
          <Text style={styles.selectorText}>This Month</Text>
        </View>
      </View>

      <View style={styles.pieCard}>
        <View style={styles.pieWrap}>
          <View style={styles.pieCircle}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida/ADBb0uha8YfSmr4MHwuUNNqS11b7cxVvjywDgJrmDFEpJbRO66sz9EpzJRbuRCBS70rlX6QQssyI6xSOxqO9MKtFUxw1LQkHc_QxmkILD5jsic9cb3r7MGvkZvjx6qZQN8i3_C3jwpTYVTwqCE8HA5RnpZioB7VcyeVe4xZoDOnRdUuY99Vqq8gBcNQB05Jrgp2DvuqO5SzTtjgpOAWSZ-JfPgbgUj_0PCnAN9yNqUO-wfhn3Yoc85tq-bbddoBpQMS72ODqUwwxFnn_-g',
              }}
              style={styles.pieImage}
            />
            <View style={styles.pieCenter}>
              <Text style={styles.pieLabel}>Total Spent</Text>
              <Text style={styles.pieTotal}>${total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.legendGrid}>
          {categories.map((c) => (
            <View key={c.id} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: c.color }]} />
              <Text style={styles.legendLabel}>{`${c.label} (${c.percent}%)`}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownTitle}>Category Breakdown</Text>
      </View>

      <View style={styles.breakdownList}>
        {categories.map((c) => (
          <View key={c.id} style={styles.categoryRow}>
            <View style={styles.categoryLeft}>
              <View style={[styles.categoryIcon, { backgroundColor: `${c.color}22` }]}>
                <Text style={styles.categoryIconText}>{c.label.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.categoryTitle}>{c.label}</Text>
                <Text style={styles.categorySub}>Category data</Text>
              </View>
            </View>

            <View style={styles.categoryRight}>
              <Text style={styles.categoryAmount}>${c.amount.toLocaleString()}</Text>
              <View style={styles.percentRow}>
                <View style={styles.percentBarBackground}>
                  <View
                    style={[
                      styles.percentBarFill,
                      { width: `${c.percent}%`, backgroundColor: c.color },
                    ]}
                  />
                </View>
                <Text style={[styles.percentLabel, { color: c.color }]}>{c.percent}%</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  canvas: { backgroundColor: '#faf9f8' },
  content: { padding: 20, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  selector: { borderWidth: 1, borderColor: '#D1D5DB', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  selectorText: { color: '#555', fontWeight: '600' },

  pieCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16 },
  pieWrap: { alignItems: 'center', marginBottom: 12 },
  pieCircle: { width: 240, height: 240, borderRadius: 120, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 12, borderColor: '#f1f0ef' },
  pieImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  pieCenter: { position: 'absolute', width: '64%', height: '64%', borderRadius: 999, backgroundColor: '#faf9f8', alignItems: 'center', justifyContent: 'center' },
  pieLabel: { fontSize: 12, color: '#666' },
  pieTotal: { fontSize: 20, fontWeight: '700', color: '#111' },

  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  legendRow: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { color: '#555' },

  breakdownHeader: { marginTop: 8, marginBottom: 8 },
  breakdownTitle: { color: '#6b6b6b', fontWeight: '600', letterSpacing: 1 },

  breakdownList: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  categoryLeft: { flexDirection: 'row', alignItems: 'center' },
  categoryIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  categoryIconText: { color: '#fff', fontWeight: '700' },
  categoryTitle: { fontSize: 16, fontWeight: '700' },
  categorySub: { color: '#666' },

  categoryRight: { alignItems: 'flex-end' },
  categoryAmount: { fontWeight: '700', fontSize: 16 },
  percentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  percentBarBackground: { width: 60, height: 8, backgroundColor: '#F3F4F6', borderRadius: 8, overflow: 'hidden', marginRight: 8 },
  percentBarFill: { height: '100%', width: '30%', backgroundColor: '#00488d' },
  percentLabel: { fontSize: 12, fontWeight: '600' },
});