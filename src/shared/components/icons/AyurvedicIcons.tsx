/**
 * @file src/shared/components/icons/AyurvedicIcons.tsx
 * @description Standard vector icons built on top of lucide-react-native for the Ayurvedic Super App.
 *
 * Invariants:
 * - Employs official lucide-react-native components for crisp rendering across iOS & Android.
 * - Exposes backward-compatible component names and size/color props.
 */

import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  FileText,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Filter,
  Search,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowUpDown,
  CheckCircle2,
  Pill,
  FlaskConical,
  Syringe,
  AlertCircle,
  FileSpreadsheet,
  ArrowLeft,
  ChevronRight,
  Share2,
  UploadCloud,
  X,
  Activity,
  Globe,
} from 'lucide-react-native';

export interface IconProps {
  size?: number;
  color?: string;
}

export const LeafIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <Sparkles size={size} color={color} />
);

export const StarIcon: React.FC<IconProps> = ({ size = 16, color = '#D4A373' }) => (
  <Star size={size} color={color} fill={color} />
);

export const ShieldVerifiedIcon: React.FC<IconProps> = ({ size = 16, color = '#2D6A4F' }) => (
  <ShieldCheck size={size} color={color} />
);

export const CalendarSlotIcon: React.FC<IconProps> = ({ size = 16, color = '#52B788' }) => (
  <Calendar size={size} color={color} />
);

export const ClockTimeIcon: React.FC<IconProps> = ({ size = 16, color = '#6B7280' }) => (
  <Clock size={size} color={color} />
);

export const FilterIcon: React.FC<IconProps> = ({ size = 18, color = '#2D6A4F' }) => (
  <Filter size={size} color={color} />
);

export const SearchLensIcon: React.FC<IconProps> = ({ size = 18, color = '#6B7280' }) => (
  <Search size={size} color={color} />
);

export const ShoppingBagIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <ShoppingBag size={size} color={color} />
);

export const HealthRecordsIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <FileText size={size} color={color} />
);

export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 20,
  color = '#E63946',
  filled = false,
}) => (
  <Heart size={size} color={color} fill={filled ? color : 'transparent'} />
);

export const CartIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <ShoppingCart size={size} color={color} />
);

export const PlusIcon: React.FC<IconProps> = ({ size = 18, color = '#2D6A4F' }) => (
  <Plus size={size} color={color} strokeWidth={2.5} />
);

export const MinusIcon: React.FC<IconProps> = ({ size = 18, color = '#2D6A4F' }) => (
  <Minus size={size} color={color} strokeWidth={2.5} />
);

export const TrashIcon: React.FC<IconProps> = ({ size = 18, color = '#E63946' }) => (
  <Trash2 size={size} color={color} />
);

export const TagIcon: React.FC<IconProps> = ({ size = 18, color = '#D4A373' }) => (
  <Tag size={size} color={color} />
);

export const SortAscIcon: React.FC<IconProps> = ({ size = 18, color = '#2D6A4F' }) => (
  <ArrowUpDown size={size} color={color} />
);

export const CheckCircleIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <CheckCircle2 size={size} color={color} />
);

export const PillMedicineIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <Pill size={size} color={color} />
);

export const FlaskLabIcon: React.FC<IconProps> = ({ size = 20, color = '#0077B6' }) => (
  <FlaskConical size={size} color={color} />
);

export const SyringeIcon: React.FC<IconProps> = ({ size = 20, color = '#F77F00' }) => (
  <Syringe size={size} color={color} />
);

export const AlertCircleIcon: React.FC<IconProps> = ({ size = 20, color = '#E63946' }) => (
  <AlertCircle size={size} color={color} />
);

export const PdfFileIcon: React.FC<IconProps> = ({ size = 20, color = '#E63946' }) => (
  <FileSpreadsheet size={size} color={color} />
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 22, color = '#1B4332' }) => (
  <ArrowLeft size={size} color={color} />
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 18, color = '#6B7280' }) => (
  <ChevronRight size={size} color={color} />
);

export const ShareIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <Share2 size={size} color={color} />
);

export const UploadCloudIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <UploadCloud size={size} color={color} />
);

export const CloseIcon: React.FC<IconProps> = ({ size = 20, color = '#6B7280' }) => (
  <X size={size} color={color} />
);

export const ActivityPulseIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <Activity size={size} color={color} />
);

export const GlobeIcon: React.FC<IconProps> = ({ size = 20, color = '#2D6A4F' }) => (
  <Globe size={size} color={color} />
);
