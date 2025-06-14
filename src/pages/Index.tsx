
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, FileText, Users, BarChart3, Settings, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const translations = {
    en: {
      title: "Arogya Sahayak",
      subtitle: "AI-powered diagnostic assistant for ASHA workers",
      welcome: "Welcome back, ASHA Worker",
      todayCases: "Today's Cases",
      pendingReviews: "Pending Reviews",
      accuracy: "Accuracy Rate",
      newDiagnosis: "New Diagnosis",
      newDiagnosisDesc: "Capture image and analyze symptoms",
      patientHistory: "Patient History",
      patientHistoryDesc: "View previous cases and treatments",
      communityMap: "Community Map",
      communityMapDesc: "Track health patterns in your area",
      reports: "Reports",
      reportsDesc: "Generate and share diagnostic reports",
      settings: "Settings",
      settingsDesc: "Manage your profile and preferences"
    },
    hi: {
      title: "आरोग्य सहायक",
      subtitle: "आशा कार्यकर्ताओं के लिए AI-संचालित निदान सहायक",
      welcome: "वापस स्वागत है, आशा कार्यकर्ता",
      todayCases: "आज के मामले",
      pendingReviews: "लंबित समीक्षाएं",
      accuracy: "सटीकता दर",
      newDiagnosis: "नया निदान",
      newDiagnosisDesc: "छवि कैप्चर करें और लक्षणों का विश्लेषण करें",
      patientHistory: "रोगी इतिहास",
      patientHistoryDesc: "पिछले मामले और उपचार देखें",
      communityMap: "समुदायिक मानचित्र",
      communityMapDesc: "अपने क्षेत्र में स्वास्थ्य पैटर्न ट्रैक करें",
      reports: "रिपोर्ट",
      reportsDesc: "निदान रिपोर्ट बनाएं और साझा करें",
      settings: "सेटिंग्स",
      settingsDesc: "अपनी प्रोफ़ाइल और प्राथमिकताएं प्रबंधित करें"
    }
  };

  const t = translations[language as keyof typeof translations];

  const stats = [
    { label: t.todayCases, value: "12", trend: "+3" },
    { label: t.pendingReviews, value: "5", trend: "-2" },
    { label: t.accuracy, value: "94%", trend: "+2%" }
  ];

  const menuItems = [
    {
      title: t.newDiagnosis,
      description: t.newDiagnosisDesc,
      icon: Camera,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      action: () => navigate('/diagnosis')
    },
    {
      title: t.patientHistory,
      description: t.patientHistoryDesc,
      icon: Users,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      action: () => navigate('/patients')
    },
    {
      title: t.communityMap,
      description: t.communityMapDesc,
      icon: BarChart3,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      action: () => navigate('/community')
    },
    {
      title: t.reports,
      description: t.reportsDesc,
      icon: FileText,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      action: () => navigate('/reports')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">{t.title}</h1>
                <p className="text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'हिं' : 'EN'}
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.welcome}</h2>
          <p className="text-gray-600">Ready to help your community stay healthy?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Card 
              key={index} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md"
              onClick={item.action}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${item.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Quick Scan
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Last Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
