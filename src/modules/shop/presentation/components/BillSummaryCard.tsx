/**
 * @file src/modules/shop/presentation/components/BillSummaryCard.tsx
 * @description Bill calculation breakdown card with coupon applicator and free shipping incentives.
 *
 * Invariants:
 * - Accurately presents subtotal, item discounts, coupon savings, delivery charges, and final payable amount.
 * - Dynamic delivery progress indicator towards free shipping (>₹500).
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CartSummary } from '../../../../core/domain/shop/CartCalculator';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import {
  TagIcon,
  CheckCircleIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

interface BillSummaryCardProps {
  summary: CartSummary;
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export const BillSummaryCard: React.FC<BillSummaryCardProps> = ({
  summary,
  appliedCoupon,
  couponDiscountPercent,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApply = () => {
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) return;

    if (
      trimmed === 'AMRUTAM10' ||
      trimmed === 'VEDIC10' ||
      trimmed === 'AYURVEDA20' ||
      trimmed === 'AMRUTAM20'
    ) {
      setCouponError(null);
      onApplyCoupon(trimmed);
      setCouponInput('');
    } else {
      setCouponError('Invalid promo code. Try AMRUTAM10 or AYURVEDA20');
    }
  };

  const amountNeededForFreeShipping = Math.max(0, 500 - summary.subtotal);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
        },
      ]}
    >
      {/* Free Shipping Alert/Banner */}
      {amountNeededForFreeShipping > 0 ? (
        <View
          style={[
            styles.deliveryBanner,
            {
              backgroundColor: isDark ? '#2C2B1C' : '#FFF9E6',
              borderColor: colors.accent,
              borderRadius: borderRadius.md,
              padding: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              styles.deliveryBannerText,
              { color: colors.accent, fontSize: typography.caption.fontSize },
            ]}
          >
            🚚 Add <Text style={styles.bold}>₹{amountNeededForFreeShipping}</Text> more to unlock <Text style={styles.bold}>FREE Delivery</Text>!
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.deliveryBanner,
            {
              backgroundColor: isDark ? '#1C3325' : '#E8F5E9',
              borderColor: colors.primary,
              borderRadius: borderRadius.md,
              padding: spacing.sm,
            },
          ]}
        >
          <View style={styles.freeRow}>
            <CheckCircleIcon size={16} color={colors.primary} />
            <Text
              style={[
                styles.deliveryBannerText,
                { color: colors.primary, fontSize: typography.caption.fontSize, marginLeft: 6 },
              ]}
            >
              🎉 You've unlocked <Text style={styles.bold}>FREE Delivery</Text> on this order!
            </Text>
          </View>
        </View>
      )}

      {/* Coupon Code Section */}
      <View style={styles.couponSection}>
        {appliedCoupon ? (
          <View
            style={[
              styles.appliedCouponRow,
              {
                backgroundColor: isDark ? '#1A3326' : '#E8F5E9',
                borderColor: colors.primary,
                borderRadius: borderRadius.md,
                padding: spacing.sm,
              },
            ]}
          >
            <View style={styles.appliedCouponInfo}>
              <TagIcon size={16} color={colors.primary} />
              <View style={styles.appliedTextCol}>
                <Text style={[styles.couponName, { color: colors.primary }]}>
                  {appliedCoupon} ({couponDiscountPercent}% OFF)
                </Text>
                <Text
                  style={[
                    styles.couponSub,
                    { color: colors.textMuted, fontSize: typography.caption.fontSize },
                  ]}
                >
                  Discount applied successfully
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onRemoveCoupon} hitSlop={8}>
              <Text style={[styles.removeCouponText, { color: colors.error }]}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.couponInputRow}>
              <TextInput
                value={couponInput}
                onChangeText={(val) => {
                  setCouponInput(val);
                  if (couponError) setCouponError(null);
                }}
                placeholder="Enter coupon (e.g. AMRUTAM10)"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: couponError ? colors.error : colors.border,
                    backgroundColor: colors.background,
                    borderRadius: borderRadius.md,
                    fontSize: typography.body.fontSize,
                  },
                ]}
              />
              <TouchableOpacity
                onPress={handleApply}
                style={[
                  styles.applyBtn,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {couponError && (
              <Text
                style={[
                  styles.errorText,
                  { color: colors.error, fontSize: typography.caption.fontSize },
                ]}
              >
                {couponError}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Bill Breakdown */}
      <Text
        style={[
          styles.sectionHeading,
          { color: colors.text, fontSize: typography.h3.fontSize },
        ]}
      >
        Bill Details
      </Text>

      <View style={styles.summaryRow}>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          Item Total ({summary.itemCount} items)
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          ₹{summary.subtotal}
        </Text>
      </View>

      {summary.discount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.label, { color: colors.primary }]}>
            Total Discount Savings
          </Text>
          <Text style={[styles.value, { color: colors.primary, fontWeight: '700' }]}>
            - ₹{summary.discount}
          </Text>
        </View>
      )}

      <View style={styles.summaryRow}>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          Delivery Fee
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {summary.deliveryFee === 0 ? (
            <Text style={{ color: colors.primary, fontWeight: '700' }}>FREE</Text>
          ) : (
            `₹${summary.deliveryFee}`
          )}
        </Text>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: colors.border, marginVertical: spacing.sm },
        ]}
      />

      <View style={styles.grandTotalRow}>
        <View>
          <Text
            style={[
              styles.grandTotalLabel,
              { color: colors.text, fontSize: typography.h3.fontSize },
            ]}
          >
            To Pay
          </Text>
          <Text
            style={[
              styles.taxInclusiveText,
              { color: colors.textMuted, fontSize: typography.caption.fontSize },
            ]}
          >
            Inclusive of all taxes
          </Text>
        </View>
        <Text
          style={[
            styles.grandTotalAmount,
            { color: colors.primary, fontSize: typography.h2.fontSize },
          ]}
        >
          ₹{summary.total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  deliveryBanner: {
    borderWidth: 1,
    marginBottom: 12,
  },
  deliveryBannerText: {
    fontWeight: '500',
  },
  freeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold: {
    fontWeight: '800',
  },
  couponSection: {
    marginBottom: 16,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  errorText: {
    marginTop: 4,
  },
  appliedCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  appliedCouponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedTextCol: {
    marginLeft: 8,
  },
  couponName: {
    fontWeight: '700',
    fontSize: 13,
  },
  couponSub: {
    marginTop: 1,
  },
  removeCouponText: {
    fontWeight: '700',
    fontSize: 12,
  },
  sectionHeading: {
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontWeight: '700',
  },
  taxInclusiveText: {
    marginTop: 2,
  },
  grandTotalAmount: {
    fontWeight: '800',
  },
});
