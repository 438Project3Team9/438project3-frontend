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
import { useRouter } from "expo-router";

const API_BASE_URL = "http://localhost:9090";

type CurrentUser = {
  userId: number;
  username: string;
  email: string;
  displayName: string | null;
  profilePictureUrl: string | null;
  role: string;
  isActive: boolean;
};

export default function DashboardScreen() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
    loadCurrentUser();
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

  async function loadCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch current user: ${response.status}`);
      }

      const data: CurrentUser = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.warn("Current user fetch failed:", error);
    }
  }

  const handleLogout = () => {
    window.location.href = "http://localhost:9090/logout";
  };

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

  const displayName =
      currentUser?.displayName ||
      currentUser?.username ||
      dashboard.user.displayName ||
      dashboard.user.username ||
      "User";

  const profilePictureUrl =
      currentUser?.profilePictureUrl || dashboard.user.profilePictureUrl;

  const initial = displayName.charAt(0).toUpperCase();

  return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>Rocket Currency</Text>

          <View style={styles.profileMenuWrapper}>
            <Pressable
                style={styles.userChip}
                onPress={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              {profilePictureUrl ? (
                  <Image source={{ uri: profilePictureUrl }} style={styles.profileImage} />
              ) : (
                  <View style={styles.profilePlaceholder}>
                    <Text style={styles.profileInitial}>{initial}</Text>
                  </View>
              )}

              <Text style={styles.userChipName} numberOfLines={1}>
                {displayName}
              </Text>

              <MaterialIcons
                  name={profileMenuOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={22}
                  color="#00488d"
              />
            </Pressable>

            {profileMenuOpen && (
                <View style={styles.profileDropdown}>
                  <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProfileMenuOpen(false);
                        router.push("/profile");
                      }}
                  >
                    <MaterialIcons name="person" size={18} color="#111827" />
                    <Text style={styles.dropdownText}>Profile Settings</Text>
                  </Pressable>

                  <Pressable style={styles.dropdownItem} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={18} color="#111827" />
                    <Text style={styles.dropdownText}>Logout</Text>
                  </Pressable>
                </View>
            )}
          </View>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={[styles.card, styles.bentoCard]}>
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardLabel}>Monthly Budget</Text>
                <Text style={styles.cardAmount}>${dashboard.monthlyBudget.toFixed(2)}</Text>
              </View>

              <View style={styles.usageBadge}>
                <Text style={styles.usageBadgeText}>
                  {dashboard.budgetUsedPercentage}% Used
                </Text>
              </View>
            </View>

            <View style={styles.progressWrap}>
              <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>

              <View style={styles.progressMetaRow}>
                <Text style={styles.progressMetaText}>
                  ${dashboard.monthlySpent.toFixed(2)} spent
                </Text>
                <Text style={styles.progressMetaText}>
                  ${(dashboard.monthlyBudget - dashboard.monthlySpent).toFixed(2)} left
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.recentHeaderRow}>
              <Text style={styles.cardTitle}>Recent Expenses</Text>
             <Pressable onPress={() => router.push("/expenses")}>
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
                            <MaterialIcons
                                name={getIconForCategory(expense.categoryName)}
                                size={20}
                                color="#7b3200"
                            />
                          </View>
                          <View>
                            <Text style={styles.expenseTitle}>
                              {expense.merchantName || expense.description || "Expense"}
                            </Text>
                            <Text style={styles.expenseCategory}>
                              {formatDate(expense.expenseDate)}
                            </Text>
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

            <Pressable style={styles.primaryButton}
            onPress={() => router.push("/add")}>
              
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Add Expense</Text>
            </Pressable>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
  );
}

function getIconForCategory(category?: string) {
  if (!category) return "attach-money";
  const c = category.toLowerCase();
  if (c.includes("food") || c.includes("restaurant")) return "restaurant";
  if (c.includes("transport") || c.includes("taxi") || c.includes("uber")) return "directions-car";
  if (c.includes("shop") || c.includes("shopping")) return "shopping-bag";
  return "receipt";
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#faf9f8" },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#faf9f8",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    zIndex: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00488d",
  },

  profileMenuWrapper: {
    position: "relative",
    zIndex: 20,
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 999,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 10,
  },
  userChipName: {
    color: "#00488d",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 8,
    maxWidth: 160,
  },
  profileDropdown: {
    position: "absolute",
    top: 48,
    right: 0,
    width: 190,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 30,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownText: {
    marginLeft: 10,
    color: "#111827",
    fontWeight: "600",
    fontSize: 14,
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

  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  profilePlaceholder: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0056a8",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  bentoCard: {},
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLabel: {
    fontSize: 12,
    color: "#605e5c",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  cardAmount: { fontSize: 28, fontWeight: "700", color: "#111" },
  usageBadge: {
    backgroundColor: "#ffdbcb",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  usageBadgeText: { color: "#7b3200", fontWeight: "600", fontSize: 12 },

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

  recentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  seeAllText: { color: "#00488d", fontWeight: "600" },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  expenseLeft: { flexDirection: "row", alignItems: "center" },
  expenseIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#ffdbcb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  expenseRight: { flexDirection: "row", alignItems: "center" },
  expenseTitle: { fontSize: 15, fontWeight: "600", color: "#111" },
  expenseCategory: { fontSize: 13, color: "#777", marginTop: 4 },
  expenseAmount: { fontSize: 15, fontWeight: "700", color: "#111", marginRight: 8 },

  emptyText: { fontSize: 14, color: "#777", marginBottom: 12 },

  primaryButton: {
    marginTop: 18,
    backgroundColor: "#00488d",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
});