const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

export interface User {
  id: number;
  full_name: string;
  email: string;
  role:
    | "Administrator"
    | "Technical Engineer"
    | "Regional Manager"
    | "Viewer";
  is_active: boolean;
  created_at: string;
}


export interface AuditLog {
  id: number;
  user_id: number | null;
  user_email: string | null;
  user_role: string | null;
  module: string;
  action: string;
  description: string | null;
  entity_type: string | null;
  entity_id: string | null;
  old_values: string | null;
  new_values: string | null;
  ip_address: string | null;
  status: "SUCCESS" | "FAILURE";
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (
    options.body &&
    !(options.body instanceof URLSearchParams)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {

  // USER LOGIN
  async login(
    email: string,
    password: string
  ): Promise<LoginResponse> {

    const formData = new URLSearchParams();

    formData.set("username", email);
    formData.set("password", password);

    return request<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: formData,
      }
    );
  },

  // USER SELF-REGISTRATION
  async register(
    data: RegisterData
  ): Promise<LoginResponse> {

    return request<LoginResponse>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // GET CURRENT USER
  getCurrentUser(token: string): Promise<User> {
    return request<User>(
      "/auth/me",
      { method: "GET" },
      token
    );
  },

  get<T>(
    endpoint: string,
    token: string
  ): Promise<T> {
    return request<T>(
      endpoint,
      { method: "GET" },
      token
    );
  },

  post<T>(
    endpoint: string,
    data: unknown,
    token: string
  ): Promise<T> {
    return request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
  },

  patch<T>(
    endpoint: string,
    data: unknown,
    token: string
  ): Promise<T> {
    return request<T>(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      token
    );
  },
};