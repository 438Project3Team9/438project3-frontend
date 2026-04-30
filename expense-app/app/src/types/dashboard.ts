export type User = {
  userId: number;
  username: string;
  email: string;
  displayName: string | null;
  profilePictureUrl: string | null;
  role: string;
  isActive: boolean;
};

export type ExpensePreview = {
  expenseId: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  merchantName: string | null;
  description: string | null;
  expenseDate: string;
};

export type DashboardResponse = {
  user: User;
  monthlyBudget: number;
  monthlySpent: number;
  budgetUsedPercentage: number;
  recentExpenses: ExpensePreview[];
};