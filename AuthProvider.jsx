import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  useMemo,
} from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  console.log("localstorage", token);

  useEffect(() => {
    const updateAxiosHeaders = () => {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
      }
    };

    updateAxiosHeaders(); // Initial setup

    return () => {
      // Cleanup function
      delete axios.defaults.headers.common["Authorization"];
    };
  }, [token]);

  const contextValue = useMemo(() => ({ token, setToken }), [token]);
  console.log(token, setToken);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
