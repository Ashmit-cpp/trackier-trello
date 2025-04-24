import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { dbGet, dbSet, dbDelete } from "@/lib/db";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (data: User) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load current user from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const stored = await dbGet("users", "current");
      if (stored) setUser(stored as User);
      setLoading(false);
    })();
  }, []);

  const register = async (data: User): Promise<void> => {
    const exists = await dbGet("users", data.email);
    if (exists) {
      throw new Error("User already exists");
    }

    await dbSet("users", data.email, data);
    await dbSet("users", "current", data);
    setUser(data);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const u = (await dbGet("users", email)) as User | undefined;

    if (!u) {
      throw new Error("User does not exist");
    }

    if (u.password !== password) {
      throw new Error("Incorrect password");
    }

    // success! store current and update state
    await dbSet("users", "current", u);
    setUser(u);
  };

  const logout = () => {
    dbDelete("users", "current");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <div>Loading session…</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
