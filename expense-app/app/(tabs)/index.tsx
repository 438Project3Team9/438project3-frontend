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

import { getDashboard } from "../src/services/dashboardApi";
import { DashboardResponse } from "../src/types/dashboard";


export default function DashboardScreen() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  const userName =
    dashboard.user.displayName || dashboard.user.username || "User";

  const percentage = Math.min(dashboard.budgetUsedPercentage, 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Profile */}
      <View style={styles.profileRow}>
        {dashboard.user.profilePictureUrl ? (
          <Image
            source={{ uri: dashboard.user.profilePictureUrl }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profileInitial}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      {/* Budget Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Budget</Text>

        <View style={styles.budgetRow}>
          <Text style={styles.spentText}>
            ${dashboard.monthlySpent.toFixed(2)}
          </Text>
          <Text style={styles.budgetText}>
            / ${dashboard.monthlyBudget.toFixed(2)}
          </Text>
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>

        <Text style={styles.percentageText}>
          {dashboard.budgetUsedPercentage.toFixed(1)}% used this month
        </Text>
      </View>

      {/* Recent Expenses */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Expenses</Text>

        {dashboard.recentExpenses.length === 0 ? (
          <Text style={styles.emptyText}>No expenses yet.</Text>
        ) : (
          dashboard.recentExpenses.map((expense) => (
            <View key={expense.expenseId} style={styles.expenseItem}>
              <View>
                <Text style={styles.expenseTitle}>
                  {expense.merchantName || expense.description || "Expense"}
                </Text>
                <Text style={styles.expenseCategory}>
                  {expense.categoryName}
                </Text>
              </View>

              <Text style={styles.expenseAmount}>
                ${expense.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}

        <Pressable style={styles.viewAllButton}>
          <Text style={styles.viewAllButtonText}>View All Expenses</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  spentText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },
  budgetText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 4,
  },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 999,
  },
  percentageText: {
    fontSize: 14,
    color: "#555",
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  expenseTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  expenseCategory: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 12,
  },
  viewAllButton: {
    marginTop: 18,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  viewAllButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});