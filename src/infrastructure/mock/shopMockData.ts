/**
 * @file src/infrastructure/mock/shopMockData.ts
 * @description Authentic mock data generator for 20,000 Ayurvedic products.
 *
 * Invariants:
 * - Deterministic procedural generation supporting 20,000 items with zero startup penalty.
 * - Realistic Ayurvedic formulations, dosha mappings, herbal ingredients, and price distributions.
 */

import { ProductProps } from '../../core/domain/shop/Product';

export const SHOP_CATEGORIES = [
  'All',
  'Chyawanprash & Immunity',
  'Hair Care & Oils',
  'Digestion & Gut Health',
  'Skin Glow & Face Serums',
  'Herbal Teas & Tonics',
  'Joint Care & Pain Relief',
  'Stress Relief & Sleep',
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

const HERBS = [
  'Ashwagandha',
  'Triphala',
  'Brahmi',
  'Shatavari',
  'Neem',
  'Kumkumadi',
  'Bhringraj',
  'Amla',
  'Tulsi',
  'Giloy',
  'Turmeric',
  'Shilajit',
  'Guggulu',
  'Manjistha',
  'Mulethi',
  'Haritaki',
];

const PRODUCT_PREFIXES = [
  'Amrutam Gold',
  'Vedic Pure',
  'AyurSutra',
  'Divya Herbal',
  'Sanjeevani',
  'Patanjaliya',
  'Rasayana',
  'Kalyan',
  'Ojas Bio',
  'Prakriti',
];

const CATEGORY_TEMPLATES: Record<
  string,
  {
    nouns: string[];
    benefits: string[];
    images: string[];
    basePriceMin: number;
    basePriceMax: number;
  }
> = {
  'Chyawanprash & Immunity': {
    nouns: [
      'Chyawanprash Malt',
      'Immunity Booster Syrup',
      'Giloy Tulsi Kwath',
      'Swamla Compound',
      'Gold Rasayana Paste',
      'Prash Amrit Daily Tonic',
    ],
    benefits: [
      'Boosts natural killer cells & WBCs',
      'Enhances vital respiratory strength',
      'Rich in natural Vitamin C & antioxidants',
      'Balances Tridoshas (Vata, Pitta, Kapha)',
    ],
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    ],
    basePriceMin: 399,
    basePriceMax: 1299,
  },
  'Hair Care & Oils': {
    nouns: [
      'Kuntal Care Hair Spa Mask',
      'Maha Bhringraj Scalp Oil',
      'Neem Dandruff Defense Cleanser',
      'Brahmi Hair Growth Elixir',
      'Amla Reetha Shikakai Shampoo',
      'Herbal Follicle Revitalizer',
    ],
    benefits: [
      'Reduces hair thinning & strengthens follicles',
      'Relieves scalp irritation and cooling Pitta heat',
      'Enriched with cold-pressed virgin sesame oil',
      'Prevents premature greying naturally',
    ],
    images: [
      'https://images.unsplash.com/photo-1608248597359-5f25725d2c20?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    ],
    basePriceMin: 299,
    basePriceMax: 999,
  },
  'Digestion & Gut Health': {
    nouns: [
      'Triphala Churna Digestive Powder',
      'Pachak Amrit Digestive Syrup',
      'Hingwashtak Gut Balancer',
      'Abhayarishta Herbal Tonic',
      'Ajwain Ark Constipation Relief',
      'Isabgol Detox Husk Blend',
    ],
    benefits: [
      'Ignites Agni (digestive digestive fire)',
      'Relieves bloating, acidity & sluggish bowels',
      'Promotes healthy gut microbiome',
      'Gentle non-habit-forming detoxifier',
    ],
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
    ],
    basePriceMin: 199,
    basePriceMax: 699,
  },
  'Skin Glow & Face Serums': {
    nouns: [
      'Kumkumadi Tailam Miraculous Serum',
      'Nari Sondarya Skin Glow Cream',
      'Manjistha Blood Purifying Elixir',
      'Sandalwood Rose Petal Face Ubtan',
      'Turmeric Gold Radiance Oil',
      'Aloe Vera Kesar Hydrating Gel',
    ],
    benefits: [
      'Restores luminous natural complexion',
      'Fades hyperpigmentation & dark spots',
      'Rich in 24K Kashmiri saffron and goat milk',
      'Calms redness and acne-prone skin',
    ],
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    ],
    basePriceMin: 499,
    basePriceMax: 1899,
  },
  'Herbal Teas & Tonics': {
    nouns: [
      'Shanti Herbal Chamomile Tulsi Tea',
      'Ashwagandha Stress Balance Kadha',
      'Arjunarishta Cardio Health Tonic',
      'Mulethi Licorice Cough Syrup',
      'Moringa Detox Green Infusion',
      'Vedic Spiced Masala Chai Herb',
    ],
    benefits: [
      'Calms nervous system and anxious mind',
      'Zero caffeine, 100% whole leaf dried botanicals',
      'Soothes throat inflammation and cough',
      'Rich in bioflavonoids & polyphenols',
    ],
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
    ],
    basePriceMin: 249,
    basePriceMax: 799,
  },
  'Joint Care & Pain Relief': {
    nouns: [
      'Orthokey Gold Pain Relief Oil',
      'Shallaki Joint Mobility Tablets',
      'Maha Narayan Tailam Hot Compress',
      'Yograj Guggulu Cartilage Balm',
      'Nirgundi Arthritis Soothing Liniment',
      'Camphor Eucalyptus Muscle Roll-on',
    ],
    benefits: [
      'Relieves chronic stiffness & joint aches',
      'Enhances flexibility and synovial lubrication',
      'Deep penetrating warm herbal formula',
      'Fast-acting anti-inflammatory botanicals',
    ],
    images: [
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    ],
    basePriceMin: 349,
    basePriceMax: 1199,
  },
  'Stress Relief & Sleep': {
    nouns: [
      'Brahmi Shankhpushpi Mind Tonic',
      'Nidra Amrit Deep Sleep Syrup',
      'Ashwagandha KSM-66 Veg Capsules',
      'Tagara Calming Night Drops',
      'Jatamansi Anxiety Relief Elixir',
      'Medhya Rasayana Focus Blend',
    ],
    benefits: [
      'Encourages non-sedative restorative REM sleep',
      'Reduces cortisol and chronic physical tension',
      'Enhances memory recall and cognitive clarity',
      'Stabilizes restless Vata neuro-pathways',
    ],
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
    ],
    basePriceMin: 399,
    basePriceMax: 1499,
  },
};

const CATEGORY_KEYS = Object.keys(CATEGORY_TEMPLATES);

/**
 * Generate a single product deterministically by index.
 * Allows instant index-based lookup without storing 20,000 objects in memory upfront.
 */
export const generateProductByIndex = (index: number): ProductProps => {
  const categoryIndex = index % CATEGORY_KEYS.length;
  const category = CATEGORY_KEYS[categoryIndex];
  const template = CATEGORY_TEMPLATES[category];

  const prefixIndex = (index * 3) % PRODUCT_PREFIXES.length;
  const nounIndex = (index * 7) % template.nouns.length;
  const herb1Index = (index * 5) % HERBS.length;
  const herb2Index = (index * 11) % HERBS.length;

  const prefix = PRODUCT_PREFIXES[prefixIndex];
  const noun = template.nouns[nounIndex];
  const herb1 = HERBS[herb1Index];
  const herb2 = HERBS[herb2Index === herb1Index ? (herb2Index + 1) % HERBS.length : herb2Index];

  const name = `${prefix} ${noun} with ${herb1} & ${herb2}`;

  // Price calculation
  const priceRange = template.basePriceMax - template.basePriceMin;
  const price = template.basePriceMin + ((index * 37) % priceRange);

  // 60% of items have discounts
  const hasDiscount = (index % 5) !== 0;
  const discountPercent = hasDiscount ? 10 + ((index * 13) % 25) : 0; // 10% to 34%
  const discountPrice = hasDiscount
    ? Math.round((price * (100 - discountPercent)) / 100)
    : undefined;

  // Rating 4.0 to 5.0
  const rating = Number((4.0 + ((index * 17) % 11) * 0.1).toFixed(1));
  const reviewCount = 20 + ((index * 79) % 2400);

  // In stock 92% of the time
  const inStock = index % 12 !== 0;
  const stockCount = inStock ? 5 + ((index * 23) % 45) : 0;

  const imageIndex = index % template.images.length;
  const imageUrl = template.images[imageIndex];

  const description =
    `Authentic Ayurvedic therapeutic preparation infused with hand-harvested ${herb1} and ${herb2}. ` +
    `Specially formulated according to traditional Charaka Samhita guidelines to restore balance and vitality.`;

  return {
    id: `prod_${index + 1}`,
    name,
    category,
    price,
    discountPrice,
    rating,
    reviewCount,
    imageUrl,
    description,
    inStock,
    stockCount,
    ingredients: [herb1, herb2, 'Purified Cow Ghee (Ghrita)', 'Natural Rock Sugar'],
    benefits: template.benefits,
  };
};

export const TOTAL_MOCK_PRODUCTS_COUNT = 20000;
