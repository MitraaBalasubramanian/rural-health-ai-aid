const express = require('express');
const router = express.Router();

// Mock community data
const communityData = {
  villages: [
    {
      name: "Rampur",
      population: 1200,
      activeCases: 5,
      recoveredCases: 12,
      commonCondition: "Fungal Infections",
      riskLevel: "Medium",
      lastUpdated: "2024-01-15"
    },
    {
      name: "Mohalla",
      population: 800,
      activeCases: 3,
      recoveredCases: 8,
      commonCondition: "Contact Dermatitis",
      riskLevel: "Low",
      lastUpdated: "2024-01-14"
    },
    {
      name: "Khalilabad",
      population: 950,
      activeCases: 7,
      recoveredCases: 5,
      commonCondition: "Scabies",
      riskLevel: "High",
      lastUpdated: "2024-01-15"
    }
  ],
  outbreaks: [
    {
      id: 1,
      condition: "Scabies outbreak",
      village: "Khalilabad",
      cases: 7,
      severity: "High",
      recommendation: "Immediate mass screening recommended",
      reportedDate: "2024-01-15",
      status: "Active"
    },
    {
      id: 2,
      condition: "Fungal infections cluster",
      village: "Rampur",
      cases: 4,
      severity: "Medium",
      recommendation: "Monitor hygiene practices",
      reportedDate: "2024-01-14",
      status: "Monitoring"
    }
  ],
  trends: [
    {
      condition: "Fungal Infections",
      trend: "increasing",
      change: "+15%",
      period: "This week",
      currentCases: 8,
      previousCases: 7
    },
    {
      condition: "Contact Dermatitis",
      trend: "stable",
      change: "0%",
      period: "This week",
      currentCases: 3,
      previousCases: 3
    },
    {
      condition: "Bacterial Infections",
      trend: "decreasing",
      change: "-20%",
      period: "This week",
      currentCases: 2,
      previousCases: 3
    }
  ]
};

// GET /api/community/stats - Get community health statistics
router.get('/stats', (req, res) => {
  const totalCases = communityData.villages.reduce((sum, village) => 
    sum + village.activeCases + village.recoveredCases, 0);
  const activeCases = communityData.villages.reduce((sum, village) => 
    sum + village.activeCases, 0);
  const recoveredCases = communityData.villages.reduce((sum, village) => 
    sum + village.recoveredCases, 0);

  const stats = {
    overview: {
      totalCases,
      activeCases,
      recoveredCases,
      outbreakAlerts: communityData.outbreaks.filter(o => o.status === 'Active').length,
      villagesCovered: communityData.villages.length,
      totalPopulation: communityData.villages.reduce((sum, v) => sum + v.population, 0)
    },
    villages: communityData.villages,
    riskDistribution: {
      high: communityData.villages.filter(v => v.riskLevel === 'High').length,
      medium: communityData.villages.filter(v => v.riskLevel === 'Medium').length,
      low: communityData.villages.filter(v => v.riskLevel === 'Low').length
    }
  };

  res.json({
    success: true,
    stats,
    lastUpdated: new Date().toISOString()
  });
});

// GET /api/community/outbreaks - Get active outbreak alerts
router.get('/outbreaks', (req, res) => {
  const { status = 'Active' } = req.query;
  
  const filteredOutbreaks = communityData.outbreaks.filter(outbreak =>
    status === 'all' || outbreak.status === status
  );

  res.json({
    success: true,
    outbreaks: filteredOutbreaks,
    total: filteredOutbreaks.length
  });
});

// GET /api/community/trends - Get disease trends
router.get('/trends', (req, res) => {
  const { period = 'week' } = req.query;
  
  // In a real implementation, this would calculate trends based on historical data
  res.json({
    success: true,
    trends: communityData.trends,
    period,
    calculatedAt: new Date().toISOString()
  });
});

// GET /api/community/villages/:name - Get specific village data
router.get('/villages/:name', (req, res) => {
  const villageName = req.params.name;
  const village = communityData.villages.find(v => 
    v.name.toLowerCase() === villageName.toLowerCase()
  );

  if (!village) {
    return res.status(404).json({ error: 'Village not found' });
  }

  // Get village-specific outbreaks
  const villageOutbreaks = communityData.outbreaks.filter(o => 
    o.village.toLowerCase() === villageName.toLowerCase()
  );

  res.json({
    success: true,
    village: {
      ...village,
      outbreaks: villageOutbreaks,
      riskFactors: [
        'Population density',
        'Water quality',
        'Sanitation facilities',
        'Healthcare access'
      ]
    }
  });
});

// POST /api/community/outbreaks - Report new outbreak
router.post('/outbreaks', (req, res) => {
  const { condition, village, cases, severity, recommendation } = req.body;

  if (!condition || !village || !cases) {
    return res.status(400).json({
      error: 'Missing required fields: condition, village, cases'
    });
  }

  const newOutbreak = {
    id: communityData.outbreaks.length + 1,
    condition,
    village,
    cases: parseInt(cases),
    severity: severity || 'Medium',
    recommendation: recommendation || 'Monitor situation closely',
    reportedDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  communityData.outbreaks.push(newOutbreak);

  res.status(201).json({
    success: true,
    outbreak: newOutbreak,
    message: 'Outbreak reported successfully'
  });
});

// PUT /api/community/outbreaks/:id/status - Update outbreak status
router.put('/outbreaks/:id/status', (req, res) => {
  const { status } = req.body;
  const outbreak = communityData.outbreaks.find(o => o.id === parseInt(req.params.id));

  if (!outbreak) {
    return res.status(404).json({ error: 'Outbreak not found' });
  }

  const validStatuses = ['Active', 'Monitoring', 'Resolved', 'Escalated'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  outbreak.status = status;
  outbreak.lastUpdated = new Date().toISOString();

  res.json({
    success: true,
    outbreak,
    message: 'Outbreak status updated successfully'
  });
});

// GET /api/community/recommendations - Get recommended actions
router.get('/recommendations', (req, res) => {
  const recommendations = {
    immediate: [
      'Conduct mass screening in Khalilabad for scabies',
      'Distribute hygiene education materials',
      'Follow up with high-risk patients in Rampur'
    ],
    weekly: [
      'Monitor fungal infection trends in Rampur',
      'Report weekly statistics to PHC',
      'Update community health records',
      'Conduct village health meetings'
    ],
    monthly: [
      'Review outbreak response protocols',
      'Analyze disease pattern trends',
      'Update risk assessments for all villages',
      'Coordinate with district health office'
    ]
  };

  res.json({
    success: true,
    recommendations,
    generatedAt: new Date().toISOString()
  });
});

module.exports = router;