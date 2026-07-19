import axios from "axios";

export async function getDashboard(): Promise<any> {
  // Prefer explicit backend URL from env. In development default to localhost:8000
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";
  // backend API runs under /api/v1
  const url = `${base.replace(/\/$/, "")}/api/v1/dashboard`;
  const resp = await axios.get(url, { timeout: 10000 });
  return resp.data;
}
