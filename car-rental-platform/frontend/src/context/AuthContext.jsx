import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem("auth_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(values) {
    const response = await api.post("/auth/login", values);
    localStorage.setItem("auth_token", response.data.token);
    const me = await api.get("/auth/me");
    setUser(me.data);
    return me.data;
  }

  async function register(values) {
    const response = await api.post("/auth/register", values);
    if (response.data?.token) {
      localStorage.setItem("auth_token", response.data.token);
      const me = await api.get("/auth/me");
      setUser(me.data);
      return me.data;
    }

    return response.data;
  }

  function logout() {
    localStorage.removeItem("auth_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
