const express = require('express');
const router = express.Router();

// Mock patient data (replace with database in production)
let patients = [
  {
    id: 1,
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    village: "Rampur",
    phone: "+91-9876543210",
    cases: [],
    createdAt: "2024-01-10T10:00:00.000Z",
    updatedAt: "2024-01-15T14:30:00.000Z"
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 32,
    gender: "Female",
    village: "Rampur",
    phone: "+91-9876543211",
    cases: [],
    createdAt: "2024-01-12T09:15:00.000Z",
    updatedAt: "2024-01-14T16:45:00.000Z"
  }
];

let patientCounter = patients.length + 1;

// GET /api/patients - Get all patients
router.get('/', (req, res) => {
  const { search, village, limit = 10, offset = 0 } = req.query;
  
  let filteredPatients = patients;
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPatients = filteredPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchLower) ||
      patient.village.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply village filter
  if (village) {
    filteredPatients = filteredPatients.filter(patient =>
      patient.village.toLowerCase() === village.toLowerCase()
    );
  }
  
  // Apply pagination
  const paginatedPatients = filteredPatients.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit)
  );
  
  res.json({
    success: true,
    patients: paginatedPatients,
    total: filteredPatients.length,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// GET /api/patients/:id - Get specific patient
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  res.json({
    success: true,
    patient
  });
});

// POST /api/patients - Create new patient
router.post('/', (req, res) => {
  const { name, age, gender, village, phone } = req.body;
  
  // Validate required fields
  if (!name || !age || !gender || !village) {
    return res.status(400).json({
      error: 'Missing required fields: name, age, gender, village'
    });
  }
  
  // Check if patient already exists
  const existingPatient = patients.find(p =>
    p.name.toLowerCase() === name.toLowerCase() &&
    p.village.toLowerCase() === village.toLowerCase()
  );
  
  if (existingPatient) {
    return res.status(409).json({
      error: 'Patient with this name already exists in the village'
    });
  }
  
  const newPatient = {
    id: patientCounter++,
    name,
    age: parseInt(age),
    gender,
    village,
    phone: phone || null,
    cases: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  patients.push(newPatient);
  
  res.status(201).json({
    success: true,
    patient: newPatient
  });
});

// PUT /api/patients/:id - Update patient
router.put('/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  const { name, age, gender, village, phone } = req.body;
  
  // Update fields if provided
  if (name) patient.name = name;
  if (age) patient.age = parseInt(age);
  if (gender) patient.gender = gender;
  if (village) patient.village = village;
  if (phone !== undefined) patient.phone = phone;
  
  patient.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    patient
  });
});

// GET /api/patients/:id/history - Get patient case history
router.get('/:id/history', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  // In a real implementation, this would fetch from diagnoses collection
  // For now, return mock history
  const mockHistory = [
    {
      id: 1,
      condition: "Fungal Infection",
      date: "2024-01-15",
      status: "Recovered",
      severity: "Moderate"
    }
  ];
  
  res.json({
    success: true,
    patient: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      village: patient.village
    },
    history: mockHistory
  });
});

// GET /api/patients/stats - Get patient statistics
router.get('/stats/summary', (req, res) => {
  const stats = {
    total: patients.length,
    byGender: {
      male: patients.filter(p => p.gender.toLowerCase() === 'male').length,
      female: patients.filter(p => p.gender.toLowerCase() === 'female').length
    },
    byVillage: patients.reduce((acc, patient) => {
      acc[patient.village] = (acc[patient.village] || 0) + 1;
      return acc;
    }, {}),
    recentlyAdded: patients.filter(p => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(p.createdAt) > weekAgo;
    }).length
  };
  
  res.json({
    success: true,
    stats
  });
});

module.exports = router;