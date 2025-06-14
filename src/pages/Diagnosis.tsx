import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import apiService from '@/services/api';
import { addPatient, addDiagnosis, patients } from '@/constants/storage';

const Diagnosis = () => {
  const [step, setStep] = useState(1);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    duration: '',
    severity: '',
    fever: '',
    nearby_cases: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10485760) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (step === 3) {
      setIsAnalyzing(true);
      
      try {
        toast({
          title: "Analyzing image...",
          description: "AI is processing your diagnosis. This may take a moment.",
        });

        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create mock analysis result
        const mockAnalysis = {
          primaryCondition: "Fungal Infection",
          confidence: 92,
          severity: "Moderate",
          riskLevel: "YELLOW",
          reasoning: "Based on the visual characteristics and symptoms described, this appears to be a common fungal skin infection.",
          treatment: "Apply antifungal cream twice daily for 2 weeks. Keep area clean and dry.",
          recommendations: [
            "Keep affected area clean and dry",
            "Avoid tight clothing over affected area", 
            "Complete full course of medication",
            "Return if symptoms worsen or don't improve in 1 week"
          ],
          warningSigns: [
            "Spreading redness or warmth",
            "Increased pain or swelling",
            "Fever or systemic symptoms",
            "No improvement after 1 week of treatment"
          ],
          followUp: "Follow-up in 1 week to assess progress. Return immediately if warning signs develop.",
          referralNeeded: false
        };

        // Check if patient already exists
        let existingPatient = patients.find(p => 
          p.name.toLowerCase() === patientData.name.toLowerCase() && 
          p.age === parseInt(patientData.age)
        );

        let patientId;
        if (!existingPatient) {
          // Add new patient
          const newPatient = addPatient({
            name: patientData.name,
            age: parseInt(patientData.age),
            gender: patientData.gender as 'male' | 'female' | 'other',
            phone: '',
            address: 'Rural Area',
            lastVisit: new Date().toISOString().split('T')[0],
            totalVisits: 1,
            conditions: [mockAnalysis.primaryCondition],
            status: 'Under Treatment',
            riskLevel: mockAnalysis.riskLevel === 'GREEN' ? 'Low' : 
                      mockAnalysis.riskLevel === 'YELLOW' ? 'Medium' : 'High'
          });
          patientId = newPatient.id;
        } else {
          patientId = existingPatient.id;
          // Update existing patient
          if (!existingPatient.conditions.includes(mockAnalysis.primaryCondition)) {
            existingPatient.conditions.push(mockAnalysis.primaryCondition);
          }
          existingPatient.lastVisit = new Date().toISOString().split('T')[0];
          existingPatient.totalVisits += 1;
        }

        // Add diagnosis
        const newDiagnosis = addDiagnosis({
          patientId,
          patientName: patientData.name,
          condition: mockAnalysis.primaryCondition,
          date: new Date().toISOString().split('T')[0],
          status: 'Completed',
          type: 'Diagnostic',
          confidence: mockAnalysis.confidence,
          severity: mockAnalysis.severity as 'Mild' | 'Moderate' | 'Severe',
          treatment: mockAnalysis.treatment,
          recommendations: mockAnalysis.recommendations,
          followUp: mockAnalysis.followUp
        });
        
        setAnalysis(mockAnalysis);
        setStep(4);
        
        toast({
          title: "Analysis Complete",
          description: `Primary diagnosis: ${mockAnalysis.primaryCondition}`,
        });
      } catch (error) {
        console.error('Diagnosis error:', error);
        toast({
          title: "Analysis Failed",
          description: "Failed to analyze image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'GREEN': return 'bg-green-100 text-green-800';
      case 'YELLOW': return 'bg-yellow-100 text-yellow-800';
      case 'RED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-xl font-semibold text-gray-900">New Diagnosis</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">Step {step} of 4</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Image Capture */}
        {step === 1 && (
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Capture or Upload Image
              </CardTitle>
              <CardDescription className="text-lg">
                Take a clear photo of the affected area for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-md bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Click to capture or upload image</p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload from Gallery
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Supported formats: JPG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Patient Information */}
        {step === 2 && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Patient Information
              </CardTitle>
              <CardDescription>
                Enter basic patient details for record keeping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {capturedImage && (
                <div className="text-center mb-6">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-32 h-32 object-cover rounded-lg mx-auto border"
                  />
                  <p className="text-sm text-gray-600 mt-2">Captured Image</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Patient Name *</Label>
                  <Input
                    id="name"
                    value={patientData.name}
                    onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => setPatientData({...patientData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!patientData.name || !patientData.age || !patientData.gender}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next: Symptoms
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Symptom Description */}
        {step === 3 && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Describe Symptoms
              </CardTitle>
              <CardDescription>
                Provide detailed information about the condition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="symptoms">Symptoms Description *</Label>
                <Textarea
                  id="symptoms"
                  value={patientData.symptoms}
                  onChange={(e) => setPatientData({...patientData, symptoms: e.target.value})}
                  placeholder="Describe the symptoms, appearance, and any pain or discomfort..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration of Condition *</Label>
                  <Select onValueChange={(value) => setPatientData({...patientData, duration: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long has this been present?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 days">1-2 days</SelectItem>
                      <SelectItem value="3-7 days">3-7 days</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                      <SelectItem value="more than month">More than 1 month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="severity">Pain/Discomfort Level</Label>
                  <Select onValueChange={(value) => setPatientData({...patientData, severity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rate the discomfort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No discomfort</SelectItem>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fever">Fever or Systemic Symptoms</Label>
                  <Select onValueChange={(value) => setPatientData({...patientData, fever: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any fever or general symptoms?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="mild fever">Mild fever</SelectItem>
                      <SelectItem value="high fever">High fever</SelectItem>
                      <SelectItem value="fatigue">Fatigue/Weakness</SelectItem>
                      <SelectItem value="multiple">Multiple symptoms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="nearby_cases">Similar Cases Nearby</Label>
                  <Select onValueChange={(value) => setPatientData({...patientData, nearby_cases: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any similar cases in the area?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None known</SelectItem>
                      <SelectItem value="family">Family members</SelectItem>
                      <SelectItem value="neighbors">Neighbors</SelectItem>
                      <SelectItem value="community">Community outbreak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!patientData.symptoms || !patientData.duration}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Analyze with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: AI Analysis Results */}
        {step === 4 && analysis && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                AI Analysis Results
              </CardTitle>
              <CardDescription>
                Review the diagnostic recommendations and next steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Diagnosis */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Diagnosis</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-medium">{analysis.primaryCondition}</span>
                  <div className="flex space-x-2">
                    <Badge className={getSeverityColor(analysis.severity)}>
                      {analysis.severity}
                    </Badge>
                    <Badge className={getRiskLevelColor(analysis.riskLevel)}>
                      {analysis.riskLevel}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">
                  Confidence: {analysis.confidence}%
                </p>
                {analysis.reasoning && (
                  <p className="text-sm text-gray-700 italic">
                    {analysis.reasoning}
                  </p>
                )}
              </div>

              {/* Treatment Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Treatment Recommendations</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-800 mb-2">Primary Treatment:</p>
                  <p className="text-green-700">{analysis.treatment}</p>
                </div>
              </div>

              {/* General Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">General Care Instructions</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warning Signs */}
              {analysis.warningSigns && analysis.warningSigns.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Warning Signs to Watch For</h3>
                  <ul className="space-y-1">
                    {analysis.warningSigns.map((sign: string, index: number) => (
                      <li key={index} className="flex items-start text-orange-700">
                        <span className="text-orange-600 mr-2">⚠️</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Follow-up</h3>
                <p className="text-yellow-700">{analysis.followUp}</p>
                {analysis.referralNeeded && (
                  <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                    <p className="text-red-800 font-medium">🏥 Referral to PHC/Hospital recommended</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    toast({
                      title: "Report Saved",
                      description: "Case report has been saved successfully.",
                    });
                    navigate('/');
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/patients')}
                  className="flex-1"
                >
                  View Patient History
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading overlay for AI analysis */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white p-8 max-w-md mx-4">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Analyzing Image...</h3>
                <p className="text-gray-600">
                  Our AI is carefully examining the image and symptoms. This may take up to 30 seconds.
                </p>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Diagnosis;
