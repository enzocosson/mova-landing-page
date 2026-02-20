import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { verifyToken } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("mova_token", accessToken);
    localStorage.setItem("mova_user", JSON.stringify(userData));
  }, []);

  const loginVisitor = useCallback((userData) => {
    // Session visiteur non persistée (ne stocke pas de token)
    setUser(userData);
    setToken(null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("mova_token");
    localStorage.removeItem("mova_user");
  }, []);

  // Vérification du token au montage
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("mova_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await verifyToken(storedToken);
        if (data.isValid) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginVisitor,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
};
