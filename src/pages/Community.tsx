
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, TrendingUp, Users, MapPin } from 'lucide-react';

const Community = () => {
  const navigate = useNavigate();

  const communityData = {
    totalCases: 24,
    activeCases: 8,
    recoveredCases: 16,
    outbreakAlerts: 2
  };

  const villageStats = [
    {
      name: "Rampur",
      population: 1200,
      activeCases: 5,
      commonCondition: "Fungal Infections",
      riskLevel: "Medium",
      lastUpdated: "2024-01-15"
    },
    {
      name: "Mohalla",
      population: 800,
      activeCases: 3,
      commonCondition: "Contact Dermatitis",
      riskLevel: "Low",
      lastUpdated: "2024-01-14"
    },
    {
      name: "Khalilabad",
      population: 950,
      activeCases: 7,
      commonCondition: "Scabies",
      riskLevel: "High",
      lastUpdated: "2024-01-15"
    }
  ];

  const outbreakAlerts = [
    {
      condition: "Scabies outbreak",
      village: "Khalilabad",
      cases: 7,
      severity: "High",
      recommendation: "Immediate mass screening recommended"
    },
    {
      condition: "Fungal infections cluster",
      village: "Rampur",
      cases: 4,
      severity: "Medium",
      recommendation: "Monitor hygiene practices"
    }
  ];

  const recentTrends = [
    {
      condition: "Fungal Infections",
      trend: "increasing",
      change: "+15%",
      period: "This week"
    },
    {
      condition: "Contact Dermatitis",
      trend: "stable",
      change: "0%",
      period: "This week"
    },
    {
      condition: "Bacterial Infections",
      trend: "decreasing",
      change: "-20%",
      period: "This week"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
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
              <h1 className="text-xl font-semibold text-gray-900">Community Health Map</h1>
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">{communityData.totalCases}</div>
              <div className="text-sm text-gray-600">Total Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">{communityData.activeCases}</div>
              <div className="text-sm text-gray-600">Active Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{communityData.recoveredCases}</div>
              <div className="text-sm text-gray-600">Recovered</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">{communityData.outbreakAlerts}</div>
              <div className="text-sm text-gray-600">Outbreak Alerts</div>
            </CardContent>
          </Card>
        </div>

        {/* Outbreak Alerts */}
        {outbreakAlerts.length > 0 && (
          <Card className="bg-red-50 border-red-200 mb-8">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Active Outbreak Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outbreakAlerts.map((alert, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-red-900">{alert.condition}</h3>
                      <Badge className="bg-red-100 text-red-800">{alert.severity} Risk</Badge>
                    </div>
                    <div className="text-sm text-red-700">
                      <p><MapPin className="h-4 w-4 inline mr-1" />{alert.village} • {alert.cases} cases</p>
                      <p className="mt-1 font-medium">Action: {alert.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Village Statistics */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Village Health Status</CardTitle>
              <CardDescription>Current health situation by village</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {villageStats.map((village, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{village.name}</h3>
                      <Badge className={getRiskColor(village.riskLevel)}>
                        {village.riskLevel} Risk
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Population:</span>
                        <span className="ml-2 font-medium">{village.population.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Active Cases:</span>
                        <span className="ml-2 font-medium">{village.activeCases}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Common Condition:</span>
                      <span className="ml-2 font-medium text-blue-600">{village.commonCondition}</span>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Last updated: {village.lastUpdated}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disease Trends */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Disease Trends</CardTitle>
              <CardDescription>Weekly trends in common conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{trend.condition}</h4>
                      <p className="text-sm text-gray-600">{trend.period}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getTrendIcon(trend.trend)}</span>
                      <span className={`font-semibold ${
                        trend.trend === 'increasing' ? 'text-red-600' :
                        trend.trend === 'decreasing' ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {trend.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="bg-blue-50 mt-8">
          <CardHeader>
            <CardTitle className="text-blue-900">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Immediate</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Conduct mass screening in Khalilabad for scabies</li>
                  <li>• Distribute hygiene education materials</li>
                  <li>• Follow up with high-risk patients</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">This Week</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Monitor fungal infection trends in Rampur</li>
                  <li>• Report weekly statistics to PHC</li>
                  <li>• Update community health records</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Community;
