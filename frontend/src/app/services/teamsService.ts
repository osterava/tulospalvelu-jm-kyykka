const API_URL = "http://localhost:8000";

export async function fetchTeams(): Promise<string[]> {
  const res = await fetch(`${API_URL}/teams`);
  if (!res.ok) {
    throw new Error("Failed to fetch teams");
  }
  return res.json();
}
