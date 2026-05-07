import { DashboardResponse } from "../types/dashboard";

const API_BASE_URL = "http://localhost:9090";

export async function getDashboard(): Promise<DashboardResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // include cookies for session-based auth if backend expects it
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    return response.json();
  } catch (err) {
    // Typical reasons: backend not running, CORS blocked, or redirect to login (302)
    // Provide a small mock so the UI can render while backend/CORS/auth is fixed.
    console.warn("Dashboard fetch failed, returning mock data:", err);

    const mock: DashboardResponse = {
      user: {
        userId: 1,
        username: "demo.user",
        email: "demo@example.com",
        displayName: "Demo User",
        profilePictureUrl: null,
        role: "user",
        isActive: true,
      },
      monthlyBudget: 2000,
      monthlySpent: 1500,
      budgetUsedPercentage: 75,
      recentExpenses: [
        { expenseId: 1, categoryId: 10, categoryName: "Food", amount: 45, merchantName: "Cafe 42", description: "Lunch", expenseDate: new Date().toISOString() },
        { expenseId: 2, categoryId: 20, categoryName: "Transport", amount: 12.5, merchantName: "Taxi Co", description: "Ride", expenseDate: new Date(Date.now()-86400000).toISOString() },
        { expenseId: 3, categoryId: 30, categoryName: "Shopping", amount: 80, merchantName: "Mall Store", description: "Shoes", expenseDate: new Date(Date.now()-2*86400000).toISOString() },
      ],
    };

    return mock;
  }
}