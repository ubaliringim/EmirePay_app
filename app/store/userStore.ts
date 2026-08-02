import { create } from 'zustand';
import { MOCK_USER, MOCK_TRANSACTIONS } from '../data/mockData';
import { firebaseAuth } from '../services/firebase';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: 'Successful' | 'Pending' | 'Failed';
  date: string;
  recipient: string;
  reference: string;
}

interface UserState {
  user: typeof MOCK_USER | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  isLoading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateBalance: (amount: number, operation: 'add' | 'subtract') => void;
  addTransaction: (transaction: Transaction) => void;
  updateProfile: (data: Partial<typeof MOCK_USER>) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  transactions: [],
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const fbUser = await firebaseAuth.signIn(email, password);
      set({
        user: {
          ...MOCK_USER,
          email,
          fullName: fbUser.displayName || MOCK_USER.fullName,
        },
        isAuthenticated: true,
        transactions: MOCK_TRANSACTIONS,
      });
      return true;
    } catch {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (data) => {
    set({ isLoading: true });
    try {
      await firebaseAuth.signUp(data.email, data.password, data.fullName);
      set({
        user: {
          ...MOCK_USER,
          fullName: data.fullName || MOCK_USER.fullName,
          email: data.email,
          phone: data.phone || MOCK_USER.phone,
        },
        isAuthenticated: true,
        transactions: MOCK_TRANSACTIONS,
      });
      return true;
    } catch {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await firebaseAuth.signOut();
    } catch {
      // ignore
    }
    set({ user: null, isAuthenticated: false, transactions: [] });
  },

  updateBalance: (amount, operation) => {
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            walletBalance:
              operation === 'add'
                ? state.user.walletBalance + amount
                : state.user.walletBalance - amount,
          }
        : null,
    }));
  },

  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
  },

  updateProfile: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));