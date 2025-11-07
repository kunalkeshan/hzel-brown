import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "firebase/auth";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: "hzel-brown-user", // Unique name for sessionStorage key
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);

