import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Admin' | 'Teacher' | 'Student';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  hasPermission: (requiredRoles: string[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isInitialized: false,
      
      login: (user, token) => set({ user, token, isLoggedIn: true }),
      
      logout: async () => {
        // Call logout API if user is logged in
        const { token, isLoggedIn } = get();
        if (isLoggedIn && token) {
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
        set({ user: null, token: null, isLoggedIn: false });
      },
      
      hasPermission: (requiredRoles) => {
        const { user } = get();
        if (!user) return false;
        
        // Role hierarchy: Developer > Admin > Teacher > Student
        if (user.role === 'Developer') return true; // Developer can do anything
        
        return requiredRoles.includes(user.role);
      },
      
      updateUser: (userData) => set(state => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      setInitialized: (initialized) => set({ isInitialized: initialized })
    }),
    {
      name: 'auth-storage',
      storage: localStorage,
    }
  )
);

export default useAuthStore; 