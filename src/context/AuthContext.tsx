import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

interface User {
  username?: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  register: (data: User) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const register = (data: User) => {
    const exists = localStorage.getItem(data.email);
    if (exists) {
      toast("User already exists");
      return;
    }
    localStorage.setItem(data.email, JSON.stringify(data));
    toast("Registration successful");
    // auto-login after register
    localStorage.setItem("currentUser", JSON.stringify(data));
    setUser(data);
  };

  const login = (email: string, password: string) => {
    const stored = localStorage.getItem(email);
    if (!stored) {
      toast("No such user");
      return;
    }
    const u: User = JSON.parse(stored);
    if (u.password === password) {
      toast("Login successful");
      localStorage.setItem("currentUser", JSON.stringify(u));
      setUser(u);
    } else {
      toast("Incorrect password");
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    toast("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
