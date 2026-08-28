/**
 * @file src/infrastructure/mock/healthRecordsMockData.ts
 * @description High-performance deterministic generator for 10,000 realistic Ayurvedic medical records.
 *
 * Invariants:
 * - Deterministic Linear Congruential Generator (LCG) produces reproducible mock datasets in < 50ms.
 * - Generates 5 distinct record types (Prescription, Lab Report, Consultation, Vaccination, Allergy).
 * - Distributes dates across 2023–2026 for chronological timeline grouping and deep infinite scrolling.
 * - Each record contains authentic Ayurvedic clinical notes, dosha profiles, tags, and mock diagnostic attachments.
 */

import { HealthRecordProps } from '../../core/domain/healthRecords/HealthRecord';
import { RecordType, Attachment } from '../../core/domain/healthRecords/RecordType';

export const TOTAL_MOCK_RECORDS_COUNT = 10000;

export const AVAILABLE_RECORD_TAGS = [
  'All Tags',
  'Panchakarma',
  'Prakriti Dosha',
  'Digestive Agni',
  'Immunity & Ojas',
  'Vata Balancing',
  'Pitta Balancing',
  'Kapha Balancing',
  'Joint & Marma',
  'Skin Care (Kushta)',
  'Stress & Sleep',
  'Detox (Shodhana)',
  'Metabolism & Liver',
  'Cardio Health',
  'Respiratory (Pranavaha)',
  'Herbal Formulations',
] as const;

const DOCTOR_NAMES = [
  'Dr. Rajeshwar Shastri, BAMS, MD',
  'Vaidya Ananya Deshmukh, BAMS, Ph.D.',
  'Dr. Vikramaditya Nair, BAMS, Gold Medalist',
  'Vaidya Meera Joshi, BAMS (Panchakarma Specialist)',
  'Dr. Gopal Hegde, BAMS, CCRAS Fellow',
  'Vaidya Chaitanya Tripathi, BAMS, MS',
  'Dr. Sneha Upadhyay, BAMS, MD (Kayachikitsa)',
  'Vaidya Bhaskara Acharya, Senior Vaidya',
  'Dr. Gayatri Bhatt, BAMS, D.Ay.M',
  'Vaidya Keshav Varma, BAMS, Fellowship in Nadi Pariksha',
];

const FACILITIES = [
  'Amrutam Global Ayurvedic Hospital & Wellness Center',
  'Kerala Ayurveda Sanatorium & Research Institute',
  'Kottakkal Arya Vaidya Sala Clinical Branch',
  'National Institute of Ayurveda (NIA) Hospital',
  'All India Institute of Ayurveda (AIIA), New Delhi',
  'Vaidyaratnam Oushadhasala Speciality Clinic',
  'Charaka Ayurvedic Clinical Care & Marma Center',
  'Amrutam Virtual Tele-Consultation Clinic',
];

const PRESCRIPTION_TITLES = [
  'Ashwagandharishta & Brahmi Vati Rasayana Protocol',
  'Panchakarma Virechana Post-Care Herbal Prescription',
  'Triphala Guggulu & Dashmularishta Rejuvenation Regimen',
  'Amrutam Skinkey Ayurvedic Elixir & Lepa Formulation',
  'Chyawanprash & Suvarna Bhasma Vitality Course',
  'Khadiradi Vati & Manjisthadi Kwath Blood Purifier',
  'Yogaraj Guggulu & Mahanarayan Taila Joint Care Protocol',
  'Saraswatarishta Cognitive & Nerve Calming Tonic',
  'Mahasudarshan Ghan Vati & Giloy Satva Febrifuge Rx',
  'Ksheerabala 101 Taila Abhyanga & Matra Basti Protocol',
  'Avipattikar Churna & Shankh Bhasma Agni Stabilizer',
  'Chandraprabha Vati & Gokshuradi Guggulu Renal Course',
];

const LAB_REPORT_TITLES = [
  'Comprehensive Prakriti Dosha Profile (Nadi & Bio-Markers)',
  'Liver Function & Dhatu Metabolism Diagnostic Panel',
  'Serum Lipid Profile & Meda Dhatu Biomarkers',
  'Complete Hemogram (CBC) & Ojas Resistance Index',
  'Fasting Blood Sugar & HbA1c Glycemic Evaluation',
  'Thyroid Stimulating Hormone & Metabolic Balance Report',
  'Renal Function & Mutravaha Srotas Diagnostic Assay',
  'Vitamin D3 & B12 Micronutrient & Agni Balance Assay',
  'Pulse Wave Velocity & Digital Nadi Reading Report',
  'Ayurvedic Urine Examination (Taila Bindu Pariksha Report)',
];

const CONSULTATION_TITLES = [
  'Initial Nadi Pariksha & Constitutional Dosha Diagnosis',
  'Follow-up Kayachikitsa & Dosha Harmonization Review',
  'Seasonal Ritucharya Lifestyle & Dietetics Guidance Session',
  'Panchakarma Detox Progress & Shodhana Evaluation',
  'Ayurvedic Stress, Sleep & Manasa Swasthya Consultation',
  'Digestive Agni & Gut Health Comprehensive Evaluation',
  'Spine, Posture & Joint Marma Therapy Clinical Review',
  'Women Health (Prasuti Tantra) & Hormonal Balance Review',
];

const VACCINATION_TITLES = [
  'Suvarna Prashan (Ayurvedic Pediatric Gold Drops) Dose #1',
  'Suvarna Prashan Pushya Nakshatra Immunity Dose #2',
  'Suvarna Prashan Annual Ojas Booster Protocol',
  'Tetanus Toxoid (TT) Immunization Record',
  'Seasonal Swasavaha Preventive Herbal Booster Shot',
  'Ayurvedic Rasayana Preventive Prophylaxis Certificate',
];

const ALLERGY_TITLES = [
  'Skin Intolerance to Mustard Seed & Katu Rasa Formulations',
  'Lactose Intolerance & Heavy Dairy Srotas Sensitivity',
  'Nut Allergy (Peanuts & Almond Paste Hypersensitivity)',
  'Pollen & Fine Dust Swasavaha Bronchial Reactivity',
  'Artificial Preservative & Synthetic Coloring Dermatitis',
  'Sesame Seed Oil (Tila Taila) Contact Erythema Note',
];

const CLINICAL_NOTES_SNIPPETS = [
  'Patient exhibits elevated Pitta with moderate Agni-mandya. Recommended cooling diet (Sheeta Guna), Pathya meal timings, and avoiding sour/spicy fermented items. Follow-up in 14 days.',
  'Nadi Pariksha indicates predominant Vata-Pitta pulse (Sarpa-Mandooka Gati). Commenced classical snehana (oleation) and daily gentle Abhyanga before bath. Vitals stable.',
  'Significant improvement noted in joint flexibility and morning stiffness. Reduced inflammatory markers. Continuing Yogaraj Guggulu with warm water post meals.',
  'Digestive fire (Jatharagni) stabilized. No hyperacidity reported over past 3 weeks. Advised continuing Avipattikar Churna with lukewarm water before bedtime.',
  'Ojas parameters and energy vitality levels improved by 35%. Good adherence to Dinacharya and morning meditation. Recommended seasonal Rasayana therapy.',
  'Seasonal allergy symptoms fully managed with Haridra Khanda and Anu Taila Nasya. Respiratory airways clear with no wheezing noted.',
];

/**
 * Deterministic Linear Congruential Generator (LCG)
 */
class DeterministicPRNG {
  private state: number;

  constructor(seed = 1008) {
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
 * Generates a mock attachment list for a given record.
 */
function generateAttachments(prng: DeterministicPRNG, recordId: string, type: RecordType): Attachment[] {
  const count = prng.range(1, 3);
  const attachments: Attachment[] = [];

  for (let i = 1; i <= count; i++) {
    const isPdf = type === RecordType.LAB_REPORT || type === RecordType.PRESCRIPTION || prng.next() > 0.5;
    const mimeType = isPdf ? 'application/pdf' : 'image/jpeg';
    const ext = isPdf ? 'pdf' : 'jpg';
    const sizeBytes = prng.range(145000, 3850000); // 145 KB to 3.85 MB

    attachments.push({
      id: `att-${recordId}-${i}`,
      name: `${type.toLowerCase()}_document_${i}.${ext}`,
      mimeType,
      url: `https://storage.amrutam.co.in/ehr/${recordId}/file_${i}.${ext}`,
      thumbnailUrl: !isPdf
        ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80'
        : undefined,
      sizeBytes,
    });
  }

  return attachments;
}

/**
 * Generates a single HealthRecordProps object by index deterministically.
 */
export function generateHealthRecordByIndex(index: number): HealthRecordProps {
  const prng = new DeterministicPRNG(index * 73 + 42);

  // Type Distribution:
  // 0.00 - 0.35: PRESCRIPTION
  // 0.35 - 0.60: LAB_REPORT
  // 0.60 - 0.80: CONSULTATION
  // 0.80 - 0.90: VACCINATION
  // 0.90 - 1.00: ALLERGY
  const typeRand = prng.next();
  let type: RecordType;
  let title: string;

  if (typeRand < 0.35) {
    type = RecordType.PRESCRIPTION;
    title = prng.pick(PRESCRIPTION_TITLES);
  } else if (typeRand < 0.60) {
    type = RecordType.LAB_REPORT;
    title = prng.pick(LAB_REPORT_TITLES);
  } else if (typeRand < 0.80) {
    type = RecordType.CONSULTATION;
    title = prng.pick(CONSULTATION_TITLES);
  } else if (typeRand < 0.90) {
    type = RecordType.VACCINATION;
    title = prng.pick(VACCINATION_TITLES);
  } else {
    type = RecordType.ALLERGY;
    title = prng.pick(ALLERGY_TITLES);
  }

  // Generate date spreading across ~1200 days (2023-01 to 2026-08)
  const baseTimestamp = new Date('2026-08-28T12:00:00.000Z').getTime();
  const dayOffset = Math.floor((index / TOTAL_MOCK_RECORDS_COUNT) * 1200) + prng.range(0, 3);
  const recordDate = new Date(baseTimestamp - dayOffset * 24 * 60 * 60 * 1000);
  const dateIso = recordDate.toISOString();

  // Generate tags (1 to 3 tags per record)
  const availableTagsWithoutAll = AVAILABLE_RECORD_TAGS.filter((t) => t !== 'All Tags');
  const tagCount = prng.range(1, 3);
  const tags: string[] = [];
  for (let t = 0; t < tagCount; t++) {
    const picked = prng.pick(availableTagsWithoutAll);
    if (!tags.includes(picked)) {
      tags.push(picked);
    }
  }

  const doctorName = type !== RecordType.ALLERGY ? prng.pick(DOCTOR_NAMES) : undefined;
  const facility = prng.pick(FACILITIES);
  const notes = prng.pick(CLINICAL_NOTES_SNIPPETS);
  const id = `REC-${String(index + 1).padStart(6, '0')}`;
  const attachments = generateAttachments(prng, id, type);

  return {
    id,
    title,
    type,
    date: dateIso,
    doctorName,
    facility,
    notes,
    tags,
    attachments,
    createdAt: dateIso,
  };
}

/**
 * Generates the full 10,000 HealthRecordProps collection deterministically.
 */
export function generate10kHealthRecordsProps(): HealthRecordProps[] {
  const records: HealthRecordProps[] = new Array(TOTAL_MOCK_RECORDS_COUNT);
  for (let i = 0; i < TOTAL_MOCK_RECORDS_COUNT; i++) {
    records[i] = generateHealthRecordByIndex(i);
  }
  return records;
}
