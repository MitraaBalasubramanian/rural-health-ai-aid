const API_BASE = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://rural-health-ai-aid.onrender.com/api' 
    : 'http://localhost:3001/api');

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Diagnosis endpoints
  async createDiagnosis(formData) {
    const response = await fetch(`${API_BASE}/diagnosis`, {
      method: 'POST',
      body: formData, // FormData for file upload
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create diagnosis');
    }

    return data;
  }

  async getDiagnosis(id) {
    return this.request(`/diagnosis/${id}`);
  }

  async getAllDiagnoses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/diagnosis?${queryString}`);
  }

  async updateDiagnosisStatus(id, status) {
    return this.request(`/diagnosis/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Patient endpoints
  async getPatients(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/patients?${queryString}`);
  }

  async getPatient(id) {
    return this.request(`/patients/${id}`);
  }

  async createPatient(patientData) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id, patientData) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async getPatientHistory(id) {
    return this.request(`/patients/${id}/history`);
  }

  async getPatientStats() {
    return this.request('/patients/stats/summary');
  }

  // Reports endpoints
  async getReports(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reports?${queryString}`);
  }

  async getMonthlyStats() {
    return this.request('/reports/monthly');
  }

  async getWeeklyStats() {
    return this.request('/reports/weekly');
  }

  async exportReports(exportData) {
    return this.request('/reports/export', {
      method: 'POST',
      body: JSON.stringify(exportData),
    });
  }

  // Community endpoints
  async getCommunityStats() {
    return this.request('/community/stats');
  }

  async getOutbreaks(status = 'Active') {
    return this.request(`/community/outbreaks?status=${status}`);
  }

  async getTrends(period = 'week') {
    return this.request(`/community/trends?period=${period}`);
  }

  async getVillageData(villageName) {
    return this.request(`/community/villages/${encodeURIComponent(villageName)}`);
  }

  async reportOutbreak(outbreakData) {
    return this.request('/community/outbreaks', {
      method: 'POST',
      body: JSON.stringify(outbreakData),
    });
  }

  async updateOutbreakStatus(id, status) {
    return this.request(`/community/outbreaks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getRecommendations() {
    return this.request('/community/recommendations');
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE.replace('/api', '')}/health`);
    return response.json();
  }
}

export default new ApiService();