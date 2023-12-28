import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type SafeAreaInsetsContextParams = {
  top: number;
  bottom: number;
};

const initialContextParams: SafeAreaInsetsContextParams = {
  top: 0,
  bottom: 0,
};

const SafeAreaInsetsContext =
  createContext<SafeAreaInsetsContextParams>(initialContextParams);

export const SafeAreaInsetsContextProvider = ({
  children,
}: PropsWithChildren) => {
  const insets = useSafeAreaInsets();

  const contextValues = useMemo(
    () => ({
      top: insets.top > 20 ? insets.top : 30,
      bottom: insets.bottom > 0 ? insets.bottom : 20,
    }),
    [insets],
  );

  return (
    <SafeAreaInsetsContext.Provider value={contextValues}>
      {children}
    </SafeAreaInsetsContext.Provider>
  );
};

export const useSafeAreaInsetsContext = () => useContext(SafeAreaInsetsContext);
