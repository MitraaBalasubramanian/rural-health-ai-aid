import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Plus, Calendar, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import apiService from '@/services/api';

const Patients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    recovered: 0,
    underTreatment: 0,
    referred: 0
  });

  useEffect(() => {
    loadPatients();
    loadStats();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await apiService.getPatients({ limit: 20 });
      if (response.success) {
        // Add mock status and condition data for display
        const patientsWithStatus = response.patients.map(patient => ({
          ...patient,
          lastVisit: patient.updatedAt.split('T')[0],
          lastCondition: "Skin Condition",
          status: Math.random() > 0.5 ? "Recovered" : "Under Treatment",
          cases: Math.floor(Math.random() * 5) + 1
        }));
        setPatients(patientsWithStatus);
      }
    } catch (error) {
      console.error('Failed to load patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients. Using demo data.",
        variant: "destructive"
      });
      // Fallback to demo data
      setPatients([
        {
          id: 1,
          name: "Rajesh Kumar",
          age: 45,
          gender: "Male",
          village: "Rampur",
          lastVisit: "2024-01-15",
          lastCondition: "Fungal Infection",
          status: "Recovered",
          cases: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getPatientStats();
      if (response.success) {
        setStats({
          total: response.stats.total,
          recovered: Math.floor(response.stats.total * 0.6),
          underTreatment: Math.floor(response.stats.total * 0.3),
          referred: Math.floor(response.stats.total * 0.1)
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Loading Patients...</h3>
              <p className="text-gray-600">Fetching patient data from server</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.lastCondition && patient.lastCondition.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recovered': return 'bg-green-100 text-green-800';
      case 'Improved': return 'bg-blue-100 text-blue-800';
      case 'Under Treatment': return 'bg-yellow-100 text-yellow-800';
      case 'Referred': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Patient History</h1>
            </div>
            <Button
              onClick={() => navigate('/diagnosis')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.recovered}</div>
              <div className="text-sm text-gray-600">Recovered</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.underTreatment}</div>
              <div className="text-sm text-gray-600">Under Treatment</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600">{stats.referred}</div>
              <div className="text-sm text-gray-600">Referred</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, village, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Age:</span> {patient.age} • {patient.gender}
                      </div>
                      <div>
                        <span className="font-medium">Village:</span> {patient.village}
                      </div>
                      <div>
                        <span className="font-medium">Last Visit:</span> {patient.lastVisit}
                      </div>
                      <div>
                        <span className="font-medium">Total Cases:</span> {patient.cases}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Last Condition:</span>
                      <span className="text-sm text-gray-600 ml-2">{patient.lastCondition}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      History
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
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
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600 mb-4">
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
    </div>
  );
};

export default Patients;
