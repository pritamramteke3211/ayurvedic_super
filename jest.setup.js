/**
 * @file jest.setup.js
 * @description Global Jest environment setup and mocks for React Native modules.
 */

// React Native Gesture Handler Jest setup
require('react-native-gesture-handler/jestSetup');

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const View = require('react-native').View;
  const MockIcon = (props) => React.createElement(View, props);
  return new Proxy(
    {},
    {
      get: () => MockIcon,
    },
  );
});

// Mock React Native MMKV
jest.mock('react-native-mmkv', () => {
  const store = new Map();
  return {
    createMMKV: jest.fn(() => ({
      getString: jest.fn((key) => store.get(key)),
      set: jest.fn((key, value) => store.set(key, value)),
      remove: jest.fn((key) => store.delete(key)),
      clearAll: jest.fn(() => store.clear()),
      contains: jest.fn((key) => store.has(key)),
    })),
  };
});

// Mock react-native-keychain
jest.mock('react-native-keychain', () => {
  let credentials = null;
  return {
    setGenericPassword: jest.fn((username, password) => {
      credentials = { username, password };
      return Promise.resolve(true);
    }),
    getGenericPassword: jest.fn(() => Promise.resolve(credentials)),
    resetGenericPassword: jest.fn(() => {
      credentials = null;
      return Promise.resolve(true);
    }),
    ACCESS_CONTROL: {},
    ACCESSIBLE: {},
    AUTHENTICATION_TYPE: {},
  };
});

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const React = require('react');
  const View = require('react-native').View;
  return {
    enableScreens: jest.fn(),
    ScreenContainer: View,
    Screen: View,
    NativeScreen: View,
    NativeScreenContainer: View,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const View = require('react-native').View;
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  const SafeAreaInsetsContext = React.createContext(insets);
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children, style }) => React.createElement(View, { style }, children),
    SafeAreaConsumer: SafeAreaInsetsContext.Consumer,
    SafeAreaInsetsContext: SafeAreaInsetsContext,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
  };
});

// Mock FlashList
jest.mock('@shopify/flash-list', () => {
  const React = require('react');
  const FlatList = require('react-native').FlatList;
  return {
    FlashList: FlatList,
  };
});
