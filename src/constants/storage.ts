// Storage for hardcoded data to make UI functional
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
  lastVisit: string;
  totalVisits: number;
  conditions: string[];
  status: 'Active' | 'Recovered' | 'Under Treatment' | 'Referred';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Diagnosis {
  id: string;
  patientId: string;
  patientName: string;
  condition: string;
  date: string;
  status: 'Completed' | 'Under Review' | 'Referred' | 'Pending';
  type: 'Diagnostic' | 'Follow-up' | 'Referral';
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  treatment: string;
  recommendations: string[];
  followUp: string;
  imageUrl?: string;
}

export interface CommunityCase {
  id: string;
  condition: string;
  location: string;
  coordinates: [number, number];
  reportedDate: string;
  status: 'Active' | 'Resolved' | 'Under Investigation';
  severity: 'Low' | 'Medium' | 'High';
  affectedCount: number;
  description: string;
}

export interface MonthlyStats {
  totalReports: number;
  diagnosticReports: number;
  referralReports: number;
  completedCases: number;
  diagnosticAccuracy: number;
  avgCasesPerDay: number;
  followUpCompletion: number;
}

// Initialize data from localStorage or use defaults
const getStoredData = <T>(key: string, defaultData: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Default data
const defaultPatients: Patient[] = [
  {
    id: 'P001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'male',
    phone: '+91 9876543210',
    address: 'Village Rampur, Block A',
    lastVisit: '2024-01-15',
    totalVisits: 3,
    conditions: ['Fungal Infection', 'Diabetes'],
    status: 'Under Treatment',
    riskLevel: 'Medium'
  },
  {
    id: 'P002',
    name: 'Priya Sharma',
    age: 32,
    gender: 'female',
    phone: '+91 9876543211',
    address: 'Village Sundarpur, Block B',
    lastVisit: '2024-01-14',
    totalVisits: 2,
    conditions: ['Contact Dermatitis'],
    status: 'Recovered',
    riskLevel: 'Low'
  },
  {
    id: 'P003',
    name: 'Amit Singh',
    age: 28,
    gender: 'male',
    phone: '+91 9876543212',
    address: 'Village Greenfield, Block A',
    lastVisit: '2024-01-13',
    totalVisits: 1,
    conditions: ['Bacterial Infection'],
    status: 'Active',
    riskLevel: 'High'
  },
  {
    id: 'P004',
    name: 'Sunita Devi',
    age: 55,
    gender: 'female',
    phone: '+91 9876543213',
    address: 'Village Rampur, Block A',
    lastVisit: '2024-01-12',
    totalVisits: 4,
    conditions: ['Eczema', 'Hypertension'],
    status: 'Under Treatment',
    riskLevel: 'Medium'
  },
  {
    id: 'P005',
    name: 'Ravi Patel',
    age: 38,
    gender: 'male',
    phone: '+91 9876543214',
    address: 'Village Newtown, Block C',
    lastVisit: '2024-01-11',
    totalVisits: 2,
    conditions: ['Skin Rash'],
    status: 'Referred',
    riskLevel: 'Medium'
  }
];

const defaultDiagnoses: Diagnosis[] = [
  {
    id: 'D001',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    condition: 'Fungal Infection',
    date: '2024-01-15',
    status: 'Completed',
    type: 'Diagnostic',
    confidence: 94,
    severity: 'Moderate',
    treatment: 'Antifungal cream application twice daily for 2 weeks',
    recommendations: [
      'Keep affected area clean and dry',
      'Avoid tight clothing',
      'Complete full course of medication',
      'Return if symptoms worsen'
    ],
    followUp: 'Follow-up in 1 week to assess progress'
  },
  {
    id: 'D002',
    patientId: 'P002',
    patientName: 'Priya Sharma',
    condition: 'Contact Dermatitis',
    date: '2024-01-14',
    status: 'Under Review',
    type: 'Diagnostic',
    confidence: 87,
    severity: 'Mild',
    treatment: 'Topical corticosteroid and antihistamine',
    recommendations: [
      'Identify and avoid allergen',
      'Use mild soap and moisturizer',
      'Apply cold compress for relief',
      'Take antihistamine as needed'
    ],
    followUp: 'Return in 3-5 days if no improvement'
  },
  {
    id: 'D003',
    patientId: 'P003',
    patientName: 'Amit Singh',
    condition: 'Bacterial Infection',
    date: '2024-01-13',
    status: 'Referred',
    type: 'Referral',
    confidence: 91,
    severity: 'Severe',
    treatment: 'Oral antibiotics and wound care',
    recommendations: [
      'Take antibiotics as prescribed',
      'Keep wound clean and covered',
      'Monitor for signs of spreading',
      'Seek immediate care if fever develops'
    ],
    followUp: 'Referred to PHC for advanced treatment'
  }
];

// Load data from localStorage or use defaults
export let patients: Patient[] = getStoredData('patients', defaultPatients);
export let diagnoses: Diagnosis[] = getStoredData('diagnoses', defaultDiagnoses);

// Hardcoded community cases
export const communityCases: CommunityCase[] = [
  {
    id: 'C001',
    condition: 'Fungal Outbreak',
    location: 'Village Rampur',
    coordinates: [28.6139, 77.2090],
    reportedDate: '2024-01-10',
    status: 'Under Investigation',
    severity: 'Medium',
    affectedCount: 8,
    description: 'Multiple cases of similar fungal infections reported in the village'
  },
  {
    id: 'C002',
    condition: 'Water-borne Illness',
    location: 'Village Sundarpur',
    coordinates: [28.6200, 77.2150],
    reportedDate: '2024-01-08',
    status: 'Active',
    severity: 'High',
    affectedCount: 15,
    description: 'Suspected contaminated water source causing skin irritations'
  },
  {
    id: 'C003',
    condition: 'Allergic Reactions',
    location: 'Village Greenfield',
    coordinates: [28.6100, 77.2000],
    reportedDate: '2024-01-05',
    status: 'Resolved',
    severity: 'Low',
    affectedCount: 3,
    description: 'Seasonal allergic reactions, resolved with treatment'
  }
];

// Monthly statistics
export const monthlyStats: MonthlyStats = {
  totalReports: 45,
  diagnosticReports: 38,
  referralReports: 7,
  completedCases: 35,
  diagnosticAccuracy: 94,
  avgCasesPerDay: 2.3,
  followUpCompletion: 85
};

// Helper functions to simulate API operations with localStorage persistence
export const addPatient = (patient: Omit<Patient, 'id'>): Patient => {
  const newPatient: Patient = {
    ...patient,
    id: `P${String(patients.length + 1).padStart(3, '0')}`
  };
  patients.push(newPatient);
  saveToStorage('patients', patients);
  return newPatient;
};

export const addDiagnosis = (diagnosis: Omit<Diagnosis, 'id'>): Diagnosis => {
  const newDiagnosis: Diagnosis = {
    ...diagnosis,
    id: `D${String(diagnoses.length + 1).padStart(3, '0')}`
  };
  diagnoses.push(newDiagnosis);
  saveToStorage('diagnoses', diagnoses);
  return newDiagnosis;
};

export const addCommunityCase = (communityCase: Omit<CommunityCase, 'id'>): CommunityCase => {
  const newCase: CommunityCase = {
    ...communityCase,
    id: `C${String(communityCases.length + 1).padStart(3, '0')}`
  };
  communityCases.push(newCase);
  return newCase;
};

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export const getDiagnosesByPatientId = (patientId: string): Diagnosis[] => {
  return diagnoses.filter(diagnosis => diagnosis.patientId === patientId);
};

export const updatePatientStatus = (id: string, status: Patient['status']): boolean => {
  const patient = patients.find(p => p.id === id);
  if (patient) {
    patient.status = status;
    saveToStorage('patients', patients);
    return true;
  }
  return false;
};

// Function to refresh data from localStorage (useful for components)
export const refreshStorageData = () => {
  patients.length = 0;
  patients.push(...getStoredData('patients', defaultPatients));
  diagnoses.length = 0;
  diagnoses.push(...getStoredData('diagnoses', defaultDiagnoses));
};
