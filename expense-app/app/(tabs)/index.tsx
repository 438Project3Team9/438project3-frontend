import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { getDashboard } from "../src/services/dashboardApi";
import { DashboardResponse } from "../src/types/dashboard";
import { useRouter } from 'expo-router';


export default function DashboardScreen() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      alert(String(error));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.center}>
        <Text>Failed to load dashboard.</Text>
      </View>
    );
  }

  const percentage = Math.min(dashboard.budgetUsedPercentage, 100);

  return (
    <View style={styles.screen}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {dashboard.user.profilePictureUrl ? (
            <Image
              source={{ uri: dashboard.user.profilePictureUrl }}
              style={styles.profileImage}
            />
          ) : (
            // Replace the initial placeholder with a blue 'Login' button
            <Pressable
              style={styles.loginButton}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
          )}

          <Text style={styles.appTitle}>FinanceFlow</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* User Profile (small spacer since image already in header) */}
        <View style={{ height: 4 }} />

        {/* Monthly Budget */}
        <View style={[styles.card, styles.bentoCard]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardLabel}>Monthly Budget</Text>
              <Text style={styles.cardAmount}>${dashboard.monthlyBudget.toFixed(2)}</Text>
            </View>

            <View style={styles.usageBadge}>
              <Text style={styles.usageBadgeText}>{dashboard.budgetUsedPercentage}% Used</Text>
            </View>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${percentage}%` }]} />
            </View>

            <View style={styles.progressMetaRow}>
              <Text style={styles.progressMetaText}>${dashboard.monthlySpent.toFixed(2)} spent</Text>
              <Text style={styles.progressMetaText}>${(dashboard.monthlyBudget - dashboard.monthlySpent).toFixed(2)} left</Text>
            </View>
          </View>
  </View>
  {/* Insights / Visual Section */}

        {/* Recent Expenses */}
        <View style={styles.card}>
          <View style={styles.recentHeaderRow}>
            <Text style={styles.cardTitle}>Recent Expenses</Text>
            <Pressable>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>

          <View>
            {dashboard.recentExpenses.length === 0 ? (
              <Text style={styles.emptyText}>No expenses yet.</Text>
            ) : (
              dashboard.recentExpenses.map((expense) => (
                <Pressable key={expense.expenseId} style={styles.expenseRow}>
                  <View style={styles.expenseLeft}>
                    <View style={styles.expenseIconBox}>
                      <MaterialIcons name={getIconForCategory(expense.categoryName)} size={20} color="#7b3200" />
                    </View>
                    <View>
                        <Text style={styles.expenseTitle}>{expense.merchantName || expense.description || 'Expense'}</Text>
                        <Text style={styles.expenseCategory}>{formatDate(expense.expenseDate)}</Text>
                    </View>
                  </View>

                  <View style={styles.expenseRight}>
                    <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                    <MaterialIcons name="chevron-right" size={20} color="#9AA0A6" />
                  </View>
                </Pressable>
              ))
            )}
          </View>

          <Pressable style={styles.primaryButton}>
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Add Expense</Text>
          </Pressable>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

  {/* Bottom navigation moved to layout so it appears across all pages */}
  </View>
  );
}

// small helpers
function getIconForCategory(category?: string) {
  if (!category) return 'attach-money';
  const c = category.toLowerCase();
  if (c.includes('food') || c.includes('restaurant')) return 'restaurant';
  if (c.includes('transport') || c.includes('taxi') || c.includes('uber')) return 'directions-car';
  if (c.includes('shop') || c.includes('shopping')) return 'shopping-bag';
  return 'receipt';
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + `, ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
}

const styles = StyleSheet.create({
  // screen layout
  screen: { flex: 1, backgroundColor: "#faf9f8" },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // top app bar
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#faf9f8",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  appTitle: { fontSize: 20, fontWeight: "700", color: "#00488d", marginLeft: 12 },
  iconButton: { padding: 8, borderRadius: 18 },

  // loading / center
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },

  // profile
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profilePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DDE3F0",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  welcomeText: {
    fontSize: 14,
    color: "#777",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  // cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  bentoCard: {
    // small visual tweak for the bento style budget card
  },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardLabel: { fontSize: 12, color: "#605e5c", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  cardAmount: { fontSize: 28, fontWeight: "700", color: "#111" },
  usageBadge: { backgroundColor: "#ffdbcb", paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, alignSelf: "flex-start" },
  usageBadgeText: { color: "#7b3200", fontWeight: "600", fontSize: 12 },

  // budget progress
  progressWrap: { marginTop: 12 },
  progressBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#00488d", borderRadius: 999 },
  progressMetaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  progressMetaText: { fontSize: 14, color: "#777" },
  percentageText: { fontSize: 14, color: "#555" },

  // insights grid
  insightsGrid: { flexDirection: "row", marginBottom: 8 },
  insightCardPrimary: { flex: 1, backgroundColor: "#e6f0ff", borderRadius: 12, padding: 12, justifyContent: "space-between", height: 140 },
  insightLabel: { fontSize: 12, color: "#00488d" },
  insightValue: { fontSize: 20, fontWeight: "700", color: "#00488d", marginTop: 6 },
  insightCardImage: { flex: 1, borderRadius: 12, overflow: "hidden", height: 140 },
  insightImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imageOverlay: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: "rgba(0,0,0,0.45)" },
  imageOverlayText: { color: "#fff", fontSize: 13 },

  // recent expenses
  recentHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  seeAllText: { color: "#00488d", fontWeight: "600" },
  expenseRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  expenseLeft: { flexDirection: "row", alignItems: "center" },
  expenseIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#ffdbcb", alignItems: "center", justifyContent: "center", marginRight: 12 },
  expenseRight: { flexDirection: "row", alignItems: "center" },
  expenseTitle: { fontSize: 15, fontWeight: "600", color: "#111" },
  expenseCategory: { fontSize: 13, color: "#777", marginTop: 4 },
  expenseAmount: { fontSize: 15, fontWeight: "700", color: "#111", marginRight: 8 },

  emptyText: { fontSize: 14, color: "#777", marginBottom: 12 },

  // primary button
  primaryButton: { marginTop: 18, backgroundColor: "#00488d", paddingVertical: 14, borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", marginLeft: 8 },

  // login button (used in header to navigate to login)
  loginButton: { backgroundColor: '#00488d', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  loginButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  // bottom nav
  bottomNav: { position: "absolute", left: 12, right: 12, bottom: 16, height: 64, backgroundColor: "#fff", borderRadius: 18, flexDirection: "row", justifyContent: "space-around", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, elevation: 6 },
  navItem: { alignItems: "center", justifyContent: "center" },
  navItemActive: { backgroundColor: "#e6f0ff", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  navLabel: { fontSize: 12, color: "#6B7280" },
  navLabelActive: { color: "#00488d" },

  // legacy keys kept for compatibility
  budgetRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 12 },
  spentText: { fontSize: 28, fontWeight: "800", color: "#111" },
  budgetText: { fontSize: 16, color: "#777", marginBottom: 4 },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarFill: { height: "100%", backgroundColor: "#4F46E5", borderRadius: 999 },
  viewAllButton: { marginTop: 18, backgroundColor: "#111827", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  viewAllButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});