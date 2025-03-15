/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "@/types/user";
import { setCookie, deleteCookie } from "cookies-next";
import axios from "axios";
import { encryptData, decryptData } from "@/utils/encryption";
import { userService } from "@/services/userService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in when the app loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Cek dulu apakah ada data user terenkripsi di localStorage
        const encryptedUserData = localStorage.getItem("user_data");
        if (encryptedUserData) {
          // Dekripsi data user
          const decryptedUser = decryptData(encryptedUserData);
          console.log("Decrypted user data:", decryptedUser);

          if (decryptedUser) {
            setUser(decryptedUser);
            setIsAuthenticated(true);
            setLoading(false);
            return; // Keluar dari fungsi jika berhasil mendapatkan data dari localStorage
          }
        }

        // Jika tidak ada data di localStorage atau gagal dekripsi, coba ambil dari API
        const userData = await userService.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Login function - stores token and user data
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/admin/login",
        {
          email,
          password,
        }
      );

      // Simpan token di cookies (bisa diakses oleh middleware)
      setCookie("token", response.data.token, {
        maxAge: 60 * 60 * 9, // 9 jam dalam detik
        path: "/",
      });

      // Tetap simpan user data di localStorage untuk referensi client-side
      const encryptedUserData = encryptData(response.data.user);
      localStorage.setItem("user_data", encryptedUserData);

      // Update state
      setUser(response.data.user);
      setIsAuthenticated(true);

      console.log("Login berhasil:", response.data);
    } catch (error) {
      console.error("Login gagal:", error);
      throw error;
    }
  };

  // Dalam fungsi logout:
  const logout = () => {
    // Hapus cookie token
    deleteCookie("token");
    // Hapus data localStorage
    localStorage.removeItem("user_data");
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    // Redirect ke halaman login
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
