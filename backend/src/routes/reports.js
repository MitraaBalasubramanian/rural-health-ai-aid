const express = require('express');
const router = express.Router();

// Mock reports data
let reports = [
  {
    id: 1,
    patientName: "Rajesh Kumar",
    condition: "Fungal Infection",
    date: "2024-01-15",
    status: "Completed",
    type: "Diagnostic Report",
    confidence: 87,
    severity: "Moderate"
  },
  {
    id: 2,
    patientName: "Priya Sharma",
    condition: "Contact Dermatitis",
    date: "2024-01-14",
    status: "Under Review",
    type: "Diagnostic Report",
    confidence: 78,
    severity: "Mild"
  }
];

// GET /api/reports - Get all reports
router.get('/', (req, res) => {
  const { limit = 10, offset = 0, status, type } = req.query;
  
  let filteredReports = reports;
  
  // Apply filters
  if (status) {
    filteredReports = filteredReports.filter(r => r.status === status);
  }
  
  if (type) {
    filteredReports = filteredReports.filter(r => r.type === type);
  }
  
  // Apply pagination
  const paginatedReports = filteredReports.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit)
  );
  
  res.json({
    success: true,
    reports: paginatedReports,
    total: filteredReports.length,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// GET /api/reports/monthly - Get monthly statistics
router.get('/monthly', (req, res) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Filter reports for current month
  const monthlyReports = reports.filter(report => {
    const reportDate = new Date(report.date);
    return reportDate.getMonth() === currentMonth && 
           reportDate.getFullYear() === currentYear;
  });
  
  const stats = {
    totalReports: monthlyReports.length,
    diagnosticReports: monthlyReports.filter(r => r.type === 'Diagnostic Report').length,
    referralReports: monthlyReports.filter(r => r.type === 'Referral Report').length,
    completedCases: monthlyReports.filter(r => r.status === 'Completed').length,
    averageConfidence: monthlyReports.length > 0 
      ? Math.round(monthlyReports.reduce((sum, r) => sum + (r.confidence || 0), 0) / monthlyReports.length)
      : 0,
    severityBreakdown: {
      mild: monthlyReports.filter(r => r.severity === 'Mild').length,
      moderate: monthlyReports.filter(r => r.severity === 'Moderate').length,
      severe: monthlyReports.filter(r => r.severity === 'Severe').length
    },
    conditionBreakdown: monthlyReports.reduce((acc, report) => {
      acc[report.condition] = (acc[report.condition] || 0) + 1;
      return acc;
    }, {})
  };
  
  res.json({
    success: true,
    month: currentMonth + 1,
    year: currentYear,
    stats
  });
});

// GET /api/reports/weekly - Get weekly statistics
router.get('/weekly', (req, res) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const weeklyReports = reports.filter(report => {
    return new Date(report.date) > weekAgo;
  });
  
  const stats = {
    totalReports: weeklyReports.length,
    newCases: weeklyReports.length,
    averagePerDay: Math.round(weeklyReports.length / 7 * 10) / 10,
    mostCommonCondition: weeklyReports.length > 0 
      ? Object.entries(weeklyReports.reduce((acc, r) => {
          acc[r.condition] = (acc[r.condition] || 0) + 1;
          return acc;
        }, {})).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
      : 'None'
  };
  
  res.json({
    success: true,
    period: '7 days',
    stats
  });
});

// GET /api/reports/:id - Get specific report
router.get('/:id', (req, res) => {
  const report = reports.find(r => r.id === parseInt(req.params.id));
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  res.json({
    success: true,
    report
  });
});

// POST /api/reports/export - Export reports
router.post('/export', (req, res) => {
  const { format = 'json', dateRange, conditions } = req.body;
  
  let exportReports = reports;
  
  // Apply date range filter
  if (dateRange && dateRange.start && dateRange.end) {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    exportReports = exportReports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= startDate && reportDate <= endDate;
    });
  }
  
  // Apply condition filter
  if (conditions && conditions.length > 0) {
    exportReports = exportReports.filter(report =>
      conditions.includes(report.condition)
    );
  }
  
  // For demo, just return the data
  // In production, you'd generate actual files (PDF, Excel, etc.)
  res.json({
    success: true,
    format,
    exportedCount: exportReports.length,
    data: exportReports,
    generatedAt: new Date().toISOString()
  });
});

module.exports = router;