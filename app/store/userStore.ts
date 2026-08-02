import { create } from 'zustand';
import { MOCK_USER, MOCK_TRANSACTIONS } from '../data/mockData';

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
  signup: (data: any) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number, operation: 'add' | 'subtract') => void;
  addTransaction: (transaction: Transaction) => void;
  updateProfile: (data: Partial<typeof MOCK_USER>) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  transactions: [],
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    set({
      user: MOCK_USER,
      isAuthenticated: true,
      transactions: MOCK_TRANSACTIONS,
      isLoading: false,
    });
    return true;
  },
  
  signup: async (data: any) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    set({
      user: { ...MOCK_USER, ...data },
      isAuthenticated: true,
      transactions: MOCK_TRANSACTIONS,
      isLoading: false,
    });
    return true;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false, transactions: [] });
  },
  
  updateBalance: (amount: number, operation: 'add' | 'subtract') => {
    set(state => ({
      user: state.user ? {
        ...state.user,
        walletBalance: operation === 'add' 
          ? state.user.walletBalance + amount 
          : state.user.walletBalance - amount,
      } : null,
    }));
  },
  
  addTransaction: (transaction: Transaction) => {
    set(state => ({
      transactions: [transaction, ...state.transactions],
    }));
  },
  
  updateProfile: (data: Partial<typeof MOCK_USER>) => {
    set(state => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));
