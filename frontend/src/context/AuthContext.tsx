import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('sms_token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem('sms_token');
      if (!saved) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authService.me();
        setUser(profile);
        setToken(saved);
      } catch {
        localStorage.removeItem('sms_token');
        localStorage.removeItem('sms_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const persist = (t: string, u: User) => {
    localStorage.setItem('sms_token', t);
    localStorage.setItem('sms_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    persist(result.token, result.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authService.register({ name, email, password });
    persist(result.token, result.user);
  };

  const logout = () => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
