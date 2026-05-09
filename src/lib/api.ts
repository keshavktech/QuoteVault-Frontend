export const API_BASE = "http://localhost:8080";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("qv_token");
}

export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem("qv_token", t);
  else localStorage.removeItem("qv_token");
}

async function handle(res: Response) {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = (data && (data.message || data.error)) || JSON.stringify(data);
    } catch {
      try { msg = await res.text() || msg; } catch {}
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export const api = {
  get: (path: string) =>
    fetch(`${API_BASE}${path}`, { headers: { ...authHeaders() } }).then(handle),
  post: (path: string, body?: unknown) =>
    fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handle),
  delete: (path: string) =>
    fetch(`${API_BASE}${path}`, { method: "DELETE", headers: { ...authHeaders() } }).then(handle),
  postForm: (path: string, form: FormData) =>
    fetch(`${API_BASE}${path}`, { method: "POST", headers: { ...authHeaders() }, body: form }).then(handle),
};

export type User = { id: number; username: string; email: string; role: string; createdAt: string };
export type QuotePost = {
  id: number;
  quoteText: string;
  quoteAuthor: string;
  imageUrl?: string;
  createdAt: string;
  createdBy: User;
  createdById: number;    
};
export type SavedPost = { id: number; user: User; post: QuotePost; savedAt: string };
