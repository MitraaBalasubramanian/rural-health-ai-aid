import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Plus, Calendar, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { patients, diagnoses, getDiagnosesByPatientId, refreshStorageData, type Patient } from '@/constants/storage';

const Patients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPatients, setCurrentPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    recovered: 0,
    underTreatment: 0,
    referred: 0
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Refresh data from localStorage and update state
    refreshStorageData();
    setCurrentPatients([...patients]);
    
    // Simulate loading delay
    setTimeout(() => {
      loadStats();
      setLoading(false);
    }, 1000);
  }, []);

  const loadStats = () => {
    const total = patients.length;
    const recovered = patients.filter(p => p.status === 'Recovered').length;
    const underTreatment = patients.filter(p => p.status === 'Under Treatment').length;
    const referred = patients.filter(p => p.status === 'Referred').length;
    
    setStats({
      total,
      recovered,
      underTreatment,
      referred
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Loading Patients...</h3>
              <p className="text-gray-600">Fetching patient data from storage</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const filteredPatients = currentPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.conditions.some(condition => 
      condition.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recovered': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Under Treatment': return 'bg-yellow-100 text-yellow-800';
      case 'Referred': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewHistory = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowHistory(true);
  };

  const handleViewReport = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowReport(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="mr-2 sm:mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Patient History</h1>
            </div>
            <Button
              onClick={() => navigate('/diagnosis')}
              className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-4"
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Case</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Patients</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-green-600">{stats.recovered}</div>
              <div className="text-xs sm:text-sm text-gray-600">Recovered</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-yellow-600">{stats.underTreatment}</div>
              <div className="text-xs sm:text-sm text-gray-600">Under Treatment</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-red-600">{stats.referred}</div>
              <div className="text-xs sm:text-sm text-gray-600">Referred</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="bg-white shadow-sm mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, village, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {patient.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Age:</span> {patient.age} • {patient.gender}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {patient.address}
                      </div>
                      <div>
                        <span className="font-medium">Last Visit:</span> {patient.lastVisit}
                      </div>
                      <div>
                        <span className="font-medium">Total Visits:</span> {patient.totalVisits}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Conditions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {patient.conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col lg:flex-row space-x-2 sm:space-x-0 sm:space-y-2 lg:space-y-0 lg:space-x-2 pt-3 sm:pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                      onClick={() => handleViewHistory(patient)}
                    >
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      History
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                      onClick={() => handleViewReport(patient)}
                    >
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Try adjusting your search criteria or add a new patient case.
              </p>
              <Button
                onClick={() => navigate('/diagnosis')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Case
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* History Modal */}
      {showHistory && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold">Medical History - {selectedPatient.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {getDiagnosesByPatientId(selectedPatient.id).map((diagnosis) => (
                  <div key={diagnosis.id} className="border rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <h3 className="font-medium text-gray-900">{diagnosis.condition}</h3>
                      <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">{diagnosis.date}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Status:</span> {diagnosis.status}</p>
                      <p><span className="font-medium">Treatment:</span> {diagnosis.treatment}</p>
                      <p><span className="font-medium">Confidence:</span> {diagnosis.confidence}%</p>
                    </div>
                  </div>
                ))}
                {getDiagnosesByPatientId(selectedPatient.id).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No diagnosis history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold">Medical Report - {selectedPatient.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowReport(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Patient ID:</span> {selectedPatient.id}
                  </div>
                  <div>
                    <span className="font-medium">Name:</span> {selectedPatient.name}
                  </div>
                  <div>
                    <span className="font-medium">Age:</span> {selectedPatient.age}
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span> {selectedPatient.gender}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {selectedPatient.phone}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> {selectedPatient.address}
                  </div>
                  <div>
                    <span className="font-medium">Last Visit:</span> {selectedPatient.lastVisit}
                  </div>
                  <div>
                    <span className="font-medium">Total Visits:</span> {selectedPatient.totalVisits}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Current Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Status & Risk Level</h3>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(selectedPatient.status)}>
                      {selectedPatient.status}
                    </Badge>
                    <Badge variant="outline">
                      {selectedPatient.riskLevel} Risk
                    </Badge>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <p className="text-sm text-gray-600">
                    Continue current treatment plan. Follow up in 2 weeks if symptoms persist.
                    Maintain good hygiene and avoid known allergens. Monitor for any changes in condition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
