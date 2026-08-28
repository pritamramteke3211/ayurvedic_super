/**
 * @file src/app/navigation/ShopNavigator.tsx
 * @description React Navigation Stack Navigator for the Ayurvedic Shop module.
 *
 * Invariants:
 * - Employs @react-navigation/stack with native gesture handler integration and card transitions.
 * - Wraps the stack inside an ErrorBoundary for bulletproof error trapping.
 */

import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { ShopStackParamList } from './type';
import { ProductListScreen } from '../../modules/shop/presentation/screens/ProductListScreen';
import { ProductDetailScreen } from '../../modules/shop/presentation/screens/ProductDetailScreen';
import { CartScreen } from '../../modules/shop/presentation/screens/CartScreen';
import { useAppTheme } from '../theme/useAppTheme';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';

const Stack = createStackNavigator<ShopStackParamList>();

export const ShopNavigator: React.FC = () => {
  const { colors } = useAppTheme();

  return (
    <ErrorBoundary>
      <Stack.Navigator
        initialRouteName="ProductList"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailScreen}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
        />
      </Stack.Navigator>
    </ErrorBoundary>
  );
};
