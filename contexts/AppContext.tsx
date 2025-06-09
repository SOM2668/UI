import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  type: 'paste' | 'screenshot';
  imageUri?: string;
  wittyReply?: string;
  isProcessing?: boolean;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  chatHistory: ChatMessage[];
  currentChat: string;
  isLoading: boolean;
  showAds: boolean;
}

// Actions
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_CHAT_MESSAGE'; payload: { id: string; updates: Partial<ChatMessage> } }
  | { type: 'DELETE_CHAT_MESSAGE'; payload: string }
  | { type: 'SET_CURRENT_CHAT'; payload: string }
  | { type: 'CLEAR_CHAT_HISTORY' }
  | { type: 'SET_PREMIUM'; payload: boolean }
  | { type: 'LOAD_PERSISTED_DATA'; payload: Partial<AppState> };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  chatHistory: [],
  currentChat: '',
  isLoading: false,
  showAds: true,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        showAds: !action.payload.isPremium,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [action.payload, ...state.chatHistory],
      };
    case 'UPDATE_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: state.chatHistory.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg
        ),
      };
    case 'DELETE_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: state.chatHistory.filter(msg => msg.id !== action.payload),
      };
    case 'SET_CURRENT_CHAT':
      return {
        ...state,
        currentChat: action.payload,
      };
    case 'CLEAR_CHAT_HISTORY':
      return {
        ...state,
        chatHistory: [],
      };
    case 'SET_PREMIUM':
      return {
        ...state,
        user: state.user ? { ...state.user, isPremium: action.payload } : null,
        showAds: !action.payload,
      };
    case 'LOAD_PERSISTED_DATA':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    addChatMessage: (text: string, type: 'paste' | 'screenshot', imageUri?: string) => Promise<string>;
    generateWittyReply: (messageId: string) => Promise<void>;
    extractTextFromImage: (imageUri: string) => Promise<string>;
    upgradeToPremium: () => Promise<void>;
  };
} | null>(null);

// Mock API functions
const mockAPI = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Mock user data
    return {
      id: '1',
      email,
      name: email.split('@')[0],
      isPremium: email.includes('premium'),
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    };
  },

  signup: async (email: string, password: string, name: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      id: Date.now().toString(),
      email,
      name,
      isPremium: false,
    };
  },

  extractTextFromImage: async (imageUri: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate OCR processing
    
    const mockTexts = [
      "Hey! Loved your profile. Would love to get to know you better 😊",
      "Your photos are amazing! Would love to take you out for coffee ☕",
      "That movie was incredible! We should definitely watch the sequel together",
      "You seem like such an interesting person. Tell me more about yourself!",
      "I had such a great time today. Can't wait to see you again 💕",
    ];
    
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  },

  generateWittyReply: async (text: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing
    
    const wittyReplies = [
      "Yeh toh full rizz mode on hai 😎",
      "Smooth operator detected! 🔥",
      "Kya baat hai, charm level 💯",
      "Arre waah, flirting game strong! 💪",
      "Yeh toh next level charm hai bhai 🚀",
      "Rizz master in the house! 👑",
      "Smooth like butter, hot like fire 🔥",
      "Yeh toh professional flirter lag raha hai 😏",
      "Charm overload detected! ⚡",
      "Flirting level: Expert mode activated 🎯",
    ];
    
    return wittyReplies[Math.floor(Math.random() * wittyReplies.length)];
  },
};

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on app start
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Persist data when state changes
  useEffect(() => {
    if (state.isAuthenticated) {
      persistData();
    }
  }, [state.user, state.chatHistory]);

  const loadPersistedData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const chatData = await AsyncStorage.getItem('chatHistory');
      
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'SET_USER', payload: user });
      }
      
      if (chatData) {
        const chatHistory = JSON.parse(chatData).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        dispatch({ type: 'LOAD_PERSISTED_DATA', payload: { chatHistory } });
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const persistData = async () => {
    try {
      if (state.user) {
        await AsyncStorage.setItem('user', JSON.stringify(state.user));
      }
      await AsyncStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
    } catch (error) {
      console.error('Error persisting data:', error);
    }
  };

  const actions = {
    login: async (email: string, password: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const user = await mockAPI.login(email, password);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    signup: async (email: string, password: string, name: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const user = await mockAPI.signup(email, password, name);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    logout: async () => {
      await AsyncStorage.multiRemove(['user', 'chatHistory']);
      dispatch({ type: 'LOGOUT' });
    },

    addChatMessage: async (text: string, type: 'paste' | 'screenshot', imageUri?: string): Promise<string> => {
      const messageId = Date.now().toString();
      const message: ChatMessage = {
        id: messageId,
        text,
        timestamp: new Date(),
        type,
        imageUri,
        isProcessing: false,
      };
      
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message });
      return messageId;
    },

    generateWittyReply: async (messageId: string) => {
      const message = state.chatHistory.find(msg => msg.id === messageId);
      if (!message) return;

      dispatch({ 
        type: 'UPDATE_CHAT_MESSAGE', 
        payload: { id: messageId, updates: { isProcessing: true } }
      });

      try {
        const wittyReply = await mockAPI.generateWittyReply(message.text);
        dispatch({ 
          type: 'UPDATE_CHAT_MESSAGE', 
          payload: { 
            id: messageId, 
            updates: { wittyReply, isProcessing: false }
          }
        });
      } catch (error) {
        dispatch({ 
          type: 'UPDATE_CHAT_MESSAGE', 
          payload: { id: messageId, updates: { isProcessing: false } }
        });
        throw error;
      }
    },

    extractTextFromImage: async (imageUri: string): Promise<string> => {
      return await mockAPI.extractTextFromImage(imageUri);
    },

    upgradeToPremium: async () => {
      // Mock premium upgrade
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: 'SET_PREMIUM', payload: true });
    },
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}