import { DashboardResponse } from "../types/dashboard";

const API_BASE_URL = "http://localhost:8080";

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    //credentials: "include", // Ouath2
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}