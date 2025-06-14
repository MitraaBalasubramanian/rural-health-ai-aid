const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { upload, processImage, cleanupOnError } = require('../middleware/upload');

// In-memory storage for demo (replace with database in production)
let diagnoses = [];
let diagnosisCounter = 1;

// POST /api/diagnosis - Create new diagnosis
router.post('/', cleanupOnError, upload, processImage, async (req, res) => {
  try {
    const { name, age, gender, symptoms, duration, severity, fever, nearby_cases } = req.body;
    
    // Validate required fields
    if (!name || !age || !gender || !symptoms || !duration) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, age, gender, symptoms, duration' 
      });
    }

    if (!req.processedFile) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Prepare patient data for AI analysis
    const patientData = {
      name,
      age: parseInt(age),
      gender,
      symptoms,
      duration,
      severity,
      fever,
      nearby_cases
    };

    // Analyze image with AI
    console.log('Starting AI analysis for patient:', name);
    const aiAnalysis = await aiService.analyzeImage(req.processedFile.path, patientData);
    
    // Create diagnosis record
    const diagnosis = {
      id: diagnosisCounter++,
      patientData,
      imageUrl: `/uploads/${req.processedFile.filename}`,
      aiAnalysis,
      status: aiAnalysis.referralNeeded ? 'Referred' : 'Completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    diagnoses.push(diagnosis);

    console.log('Diagnosis completed for patient:', name, 'Condition:', aiAnalysis.primaryCondition);

    res.status(201).json({
      success: true,
      diagnosis: {
        id: diagnosis.id,
        patientName: diagnosis.patientData.name,
        primaryCondition: aiAnalysis.primaryCondition,
        confidence: aiAnalysis.confidence,
        severity: aiAnalysis.severity,
        riskLevel: aiAnalysis.riskLevel,
        treatment: aiAnalysis.treatment,
        referralNeeded: aiAnalysis.referralNeeded,
        recommendations: aiAnalysis.recommendations,
        followUp: aiAnalysis.followUp,
        warningSigns: aiAnalysis.warningSigns,
        reasoning: aiAnalysis.reasoning,
        imageUrl: diagnosis.imageUrl,
        createdAt: diagnosis.createdAt
      }
    });

  } catch (error) {
    console.error('Diagnosis creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create diagnosis',
      message: error.message 
    });
  }
});

// GET /api/diagnosis/:id - Get specific diagnosis
router.get('/:id', (req, res) => {
  const diagnosis = diagnoses.find(d => d.id === parseInt(req.params.id));
  
  if (!diagnosis) {
    return res.status(404).json({ error: 'Diagnosis not found' });
  }

  res.json({
    success: true,
    diagnosis
  });
});

// GET /api/diagnosis - Get all diagnoses
router.get('/', (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  
  const paginatedDiagnoses = diagnoses
    .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
    .map(d => ({
      id: d.id,
      patientName: d.patientData.name,
      primaryCondition: d.aiAnalysis.primaryCondition,
      severity: d.aiAnalysis.severity,
      riskLevel: d.aiAnalysis.riskLevel,
      status: d.status,
      createdAt: d.createdAt
    }));

  res.json({
    success: true,
    diagnoses: paginatedDiagnoses,
    total: diagnoses.length,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// PUT /api/diagnosis/:id/status - Update diagnosis status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const diagnosis = diagnoses.find(d => d.id === parseInt(req.params.id));
  
  if (!diagnosis) {
    return res.status(404).json({ error: 'Diagnosis not found' });
  }

  const validStatuses = ['Pending', 'Completed', 'Referred', 'Under Treatment'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  diagnosis.status = status;
  diagnosis.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Status updated successfully',
    diagnosis: {
      id: diagnosis.id,
      status: diagnosis.status,
      updatedAt: diagnosis.updatedAt
    }
  });
});

module.exports = router;