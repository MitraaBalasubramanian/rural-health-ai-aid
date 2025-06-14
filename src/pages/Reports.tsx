import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share, Eye, FileText, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import apiService from '@/services/api';

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({
    totalReports: 0,
    diagnosticReports: 0,
    referralReports: 0,
    completedCases: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
    loadMonthlyStats();
  }, []);

  const loadReports = async () => {
    try {
      const response = await apiService.getReports({ limit: 10 });
      if (response.success) {
        setReports(response.reports);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports. Using demo data.",
        variant: "destructive"
      });
      // Fallback to demo data
      setReports([
        {
          id: 1,
          patientName: "Rajesh Kumar",
          condition: "Fungal Infection",
          date: "2024-01-15",
          status: "Completed",
          type: "Diagnostic Report"
        }
      ]);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      const response = await apiService.getMonthlyStats();
      if (response.success) {
        setMonthlyStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to load monthly stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReports = async (format: string) => {
    try {
      const response = await apiService.exportReports({ format });
      if (response.success) {
        toast({
          title: "Export Successful",
          description: `${response.exportedCount} reports exported as ${format.toUpperCase()}`,
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export reports. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Referred': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Loading Reports...</h3>
              <p className="text-gray-600">Fetching report data from server</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-xl font-semibold text-gray-900">Reports & Analytics</h1>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleExportReports('pdf')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Monthly Report
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Monthly Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">{monthlyStats.totalReports}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{monthlyStats.diagnosticReports}</div>
              <div className="text-sm text-gray-600">Diagnostic Reports</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">{monthlyStats.referralReports}</div>
              <div className="text-sm text-gray-600">Referral Reports</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{monthlyStats.completedCases}</div>
              <div className="text-sm text-gray-600">Completed Cases</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Generate and manage your reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col"
                onClick={() => handleExportReports('weekly')}
              >
                <Calendar className="h-8 w-8 mb-2 text-blue-600" />
                <span className="font-semibold">Weekly Summary</span>
                <span className="text-sm text-gray-600">Generate this week's report</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col"
                onClick={() => handleExportReports('monthly')}
              >
                <BarChart3 className="h-8 w-8 mb-2 text-green-600" />
                <span className="font-semibold">Monthly Analytics</span>
                <span className="text-sm text-gray-600">Detailed monthly insights</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col"
                onClick={() => handleExportReports('custom')}
              >
                <FileText className="h-8 w-8 mb-2 text-purple-600" />
                <span className="font-semibold">Custom Report</span>
                <span className="text-sm text-gray-600">Create custom date range</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>View and manage your latest diagnostic reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{report.patientName}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Condition:</span> {report.condition}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {report.date}
                        </div>
                        <div>
                          <span className="font-medium">Report ID:</span> RPT-{report.id.toString().padStart(4, '0')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExportReports('pdf')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 mt-8">
          <CardHeader>
            <CardTitle className="text-blue-900">This Month's Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
                <div className="text-sm text-blue-800">Diagnostic Accuracy</div>
                <div className="text-xs text-blue-600 mt-1">+2% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">2.3</div>
                <div className="text-sm text-green-800">Avg. Cases per Day</div>
                <div className="text-xs text-green-600 mt-1">+0.5 from last month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-sm text-purple-800">Follow-up Completion</div>
                <div className="text-xs text-purple-600 mt-1">+10% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="bg-white shadow-sm mt-8">
          <CardHeader>
            <CardTitle>Export & Share</CardTitle>
            <CardDescription>Download reports in different formats for sharing with supervisors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline"
                onClick={() => handleExportReports('pdf')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleExportReports('excel')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as Excel
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share via WhatsApp
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Print Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
