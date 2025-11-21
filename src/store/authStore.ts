import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as apiLogin, register as apiRegister } from "@/services/authService";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password2: string;
  }) => Promise<void>;

  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access: null,
      refresh: null,
      isAuthenticated: false,

      // LOGIN
      async login(email, password) {
        const res = await apiLogin(email, password);

        set({
          user: res.user,
          access: res.tokens.access,
          refresh: res.tokens.refresh,
          isAuthenticated: true,
        });
      },

      // REGISTER
      async register(data) {
        const res = await apiRegister(data);

        set({
          user: res.user,
          access: res.tokens.access,
          refresh: res.tokens.refresh,
          isAuthenticated: true,
        });
      },

      // ACTUALIZAR PERFIL
      updateUser(user) {
        set({ user });
      },

      // LOGOUT
      logout() {
        set({
          user: null,
          access: null,
          refresh: null,
          isAuthenticated: false,
        });

        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        access: state.access,
        refresh: state.refresh,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);