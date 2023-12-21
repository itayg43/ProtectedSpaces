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

const SafeAreaInsetsContext = createContext<SafeAreaInsetsContextParams | null>(
  null,
);

export const SafeAreaInsetsContextProvider = (props: PropsWithChildren) => {
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
      {props.children}
    </SafeAreaInsetsContext.Provider>
  );
};

export const useSafeAreaInsetsContext = () => useContext(SafeAreaInsetsContext);
