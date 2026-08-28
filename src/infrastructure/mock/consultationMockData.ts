/**
 * @file src/infrastructure/mock/consultationMockData.ts
 * @description Deterministic generator for 5,000 Ayurvedic Doctor profiles and dynamic appointment slots.
 *
 * Invariants:
 * - Deterministic pseudo-random number generator (PRNG) ensures fast, reproducible in-memory generation across launches.
 * - Supports realistic Ayurvedic specialties, qualifications, clinic locations, and fee structures.
 * - Generates structured 30-minute morning, afternoon, and evening slots per doctor for any selected calendar date.
 */

import { Doctor, DoctorProps } from '../../core/domain/consultation/Doctor';
import { Slot } from '../../core/domain/consultation/Slot';

export const AYURVEDIC_SPECIALTIES = [
  'All Specialties',
  'Kayachikitsa (Internal Medicine)',
  'Panchakarma (Detox & Rejuvenation)',
  'Nadi Pariksha (Pulse Diagnosis)',
  'Shalya Tantra (Marma & Ortho)',
  'Dravyaguna (Herbal Pharmacology)',
  'Prasuti & Stri Roga (Women Health)',
  'Rasayana & Longevity',
  'Manasa Roga (Ayurvedic Psychology)',
] as const;

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rajeshwar', 'Priya', 'Vikramaditya', 'Meera', 'Rohan', 'Sneha',
  'Devendra', 'Kavita', 'Siddharth', 'Gayatri', 'Harish', 'Sunita', 'Ashwin', 'Divya',
  'Gopal', 'Nandini', 'Chaitanya', 'Radhika', 'Bhaskara', 'Indira', 'Keshav', 'Pallavi',
  'Manish', 'Shalini', 'Tarun', 'Anjali', 'Vivek', 'Pooja', 'Madhav', 'Deepika',
];

const LAST_NAMES = [
  'Sharma', 'Deshmukh', 'Shastri', 'Nair', 'Patel', 'Acharya', 'Joshi', 'Bhatt',
  'Upadhyay', 'Kulkarni', 'Tripathi', 'Iyer', 'Menon', 'Chaturvedi', 'Pandey', 'Gupta',
  'Pillai', 'Rathore', 'Hegde', 'Varma', 'Mishra', 'Dubey', 'Saxena', 'Mukherjee',
];

const TITLES = ['Dr.', 'Vaidya', 'Acharya Dr.', 'Senior Vaidya'];

const DEGREES = [
  'BAMS, MD (Ayurveda)',
  'BAMS, Ph.D. (Kayachikitsa)',
  'BAMS, MS (Ayurveda), Gold Medalist',
  'BAMS, MD (Panchakarma Specialist)',
  'BAMS, CCRAS Fellow',
  'BAMS (Kerala Ayurveda Academy)',
];

const CITIES = [
  'Varanasi, UP', 'Rishikesh, UK', 'Thiruvananthapuram, KL', 'Haridwar, UK',
  'Pune, MH', 'Bengaluru, KA', 'Jaipur, RJ', 'New Delhi, DL', 'Ahmedabad, GJ', 'Udupi, KA',
];

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594824813688-662589e1b212?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=300&auto=format&fit=crop&q=80',
];

const FEES = [350, 500, 650, 750, 900, 1000, 1250, 1500, 2000, 2500];

/**
 * Simple Linear Congruential Generator (LCG) for deterministic, fast pseudo-random values.
 */
class DeterministicPRNG {
  private state: number;

  constructor(seed = 108) {
    this.state = seed % 2147483647;
    if (this.state <= 0) this.state += 2147483646;
  }

  next(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }

  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(items: readonly T[] | T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }
}

/**
 * Generates the full collection of 5,000 Ayurvedic Doctor domain entities.
 */
export function generate5kDoctors(): Doctor[] {
  const prng = new DeterministicPRNG(42);
  const doctors: Doctor[] = [];

  const rawSpecialties = AYURVEDIC_SPECIALTIES.filter((s) => s !== 'All Specialties');

  for (let i = 1; i <= 5000; i++) {
    const title = prng.pick(TITLES);
    const firstName = prng.pick(FIRST_NAMES);
    const lastName = prng.pick(LAST_NAMES);
    const degree = prng.pick(DEGREES);
    const specialty = prng.pick(rawSpecialties);
    const city = prng.pick(CITIES);
    const experience = prng.range(2, 38);
    const ratingRaw = 3.8 + prng.next() * 1.2; // 3.8 to 5.0
    const rating = Math.round(ratingRaw * 10) / 10;
    const reviewCount = prng.range(12, 1450);
    const fee = prng.pick(FEES);
    const avatarUrl = prng.pick(AVATAR_URLS);
    const isAvailableToday = prng.next() > 0.25; // 75% available today

    const doctorProps: DoctorProps = {
      id: `doc-${i}`,
      name: `${title} ${firstName} ${lastName}, ${degree}`,
      specialty,
      experienceYears: experience,
      rating,
      reviewCount,
      consultationFee: fee,
      avatarUrl,
      bio: `Renowned Ayurvedic practitioner specializing in ${specialty}. Practicing classical Vedic wellness protocols and authentic therapeutic formulations for over ${experience} years at ${city}.`,
      languages: ['English', 'Hindi', prng.pick(['Sanskrit', 'Marathi', 'Gujarati', 'Malayalam', 'Tamil'])],
      isAvailableToday,
    };

    doctors.push(new Doctor(doctorProps));
  }

  return doctors;
}

/**
 * Generates slot intervals for a given doctor and date.
 */
export function generateDoctorSlotsForDate(doctorId: string, dateStr: string): Slot[] {
  // Hash doctorId and date for consistent deterministic slots
  let seed = 0;
  for (let i = 0; i < doctorId.length; i++) {
    seed = (seed << 5) - seed + doctorId.charCodeAt(i);
  }
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed << 5) - seed + dateStr.charCodeAt(i);
  }

  const prng = new DeterministicPRNG(Math.abs(seed) + 7);

  const slotTimes = [
    // Morning Slots (09:00 - 12:00)
    { start: '09:00', end: '09:30' },
    { start: '09:30', end: '10:00' },
    { start: '10:00', end: '10:30' },
    { start: '10:30', end: '11:00' },
    { start: '11:00', end: '11:30' },
    { start: '11:30', end: '12:00' },
    // Afternoon Slots (14:00 - 17:00)
    { start: '14:00', end: '14:30' },
    { start: '14:30', end: '15:00' },
    { start: '15:00', end: '15:30' },
    { start: '16:00', end: '16:30' },
    { start: '16:30', end: '17:00' },
    // Evening Slots (18:00 - 20:30)
    { start: '18:00', end: '18:30' },
    { start: '18:30', end: '19:00' },
    { start: '19:00', end: '19:30' },
    { start: '19:30', end: '20:00' },
    { start: '20:00', end: '20:30' },
  ];

  return slotTimes.map((time, idx) => {
    const isBooked = prng.next() > 0.7; // 30% pre-booked slots
    const startIso = `${dateStr}T${time.start}:00.000Z`;
    const endIso = `${dateStr}T${time.end}:00.000Z`;

    return new Slot({
      id: `slot-${doctorId}-${dateStr}-${idx + 1}`,
      doctorId,
      startTime: startIso,
      endTime: endIso,
      isBooked,
    });
  });
}
