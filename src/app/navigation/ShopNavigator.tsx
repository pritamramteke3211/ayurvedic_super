/**
 * @file src/app/navigation/ShopNavigator.tsx
 * @description React Navigation Stack Navigator for the Ayurvedic Shop module.
 *
 * Invariants:
 * - Employs @react-navigation/stack with native gesture handler integration.
 * - Displays a Coming Soon / Focus placeholder during Consultation auditing with dev preview mode.
 * - Wraps the stack inside an ErrorBoundary for bulletproof error trapping.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { ShopStackParamList } from './type';
import { ProductListScreen } from '../../modules/shop/presentation/screens/ProductListScreen';
import { ProductDetailScreen } from '../../modules/shop/presentation/screens/ProductDetailScreen';
import { CartScreen } from '../../modules/shop/presentation/screens/CartScreen';
import { useAppTheme } from '../theme/useAppTheme';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';
import { ComingSoonView } from '../../shared/components/FeatureStatusPlaceholder';

const Stack = createStackNavigator<ShopStackParamList>();

/**
 * Shop Module placeholder screen displaying Coming Soon status during Consultation audit.
 */
const ShopComingSoonScreen: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  return (
    <ComingSoonView
      featureName="Amrutam Herbal Marketplace"
      title="Herbal Shop Coming Soon"
      description="The Ayurvedic store module is currently parked while you focus on auditing and mastering the Consultation Module."
      estimatedRelease="Phase 2 Feature Scope"
      highlights={[
        '20,000+ Classical Ayurvedic formulations & herbs',
        'Direct prescription-to-cart medicine ordering',
        'Vaidya-recommended herbal immunity stacks',
      ]}
      primaryActionTitle="🌿 Focus on Consultation Module"
      secondaryActionTitle="👁️ Preview Shop Screen (Dev Mode)"
      onSecondaryActionPress={onPreview}
    />
  );
};

export const ShopNavigator: React.FC = () => {
  const { colors, spacing } = useAppTheme();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <ErrorBoundary>
      {isPreviewMode ? (
        <View style={styles.previewContainer}>
          <View style={[styles.devBanner, { backgroundColor: colors.accent + '22', borderColor: colors.accent }]}>
            <Text style={[styles.devBannerText, { color: colors.accent }]}>
              🛠️ DEV PREVIEW MODE ACTIVE
            </Text>
            <TouchableOpacity onPress={() => setIsPreviewMode(false)}>
              <Text style={[styles.devBannerAction, { color: colors.primary }]}>
                Back to Coming Soon
              </Text>
            </TouchableOpacity>
          </View>
          <Stack.Navigator
            initialRouteName="ProductList"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: colors.background },
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
          </Stack.Navigator>
        </View>
      ) : (
        <ShopComingSoonScreen onPreview={() => setIsPreviewMode(true)} />
      )}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  devBannerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  devBannerAction: {
    fontSize: 11,
    fontWeight: '700',
  },
});
