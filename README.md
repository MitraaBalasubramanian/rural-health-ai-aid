# Arogya Sahayak - Rural Health AI Aid

An AI-powered diagnostic assistant designed for ASHA (Accredited Social Health Activist) workers to support healthcare delivery in rural communities.

## Overview

Arogya Sahayak helps ASHA workers with:
- **AI-Powered Diagnosis**: Upload images and describe symptoms for instant AI analysis
- **Patient Management**: Comprehensive patient records and medical history tracking
- **Community Health Monitoring**: Village-level health statistics and outbreak alerts
- **Report Generation**: Automated diagnostic and health reports
- **Multilingual Support**: Available in English and Hindi

## Features

### 🔬 New Diagnosis
- Image capture/upload for affected areas
- Symptom description and analysis
- AI-generated diagnosis with confidence levels
- Treatment recommendations and follow-up instructions
- Risk assessment and severity classification

### 👥 Patient History
- Complete patient demographics and medical records
- Visit tracking and history management
- Individual patient report generation
- Search and filter capabilities

### 🗺️ Community Health Map
- Real-time community health statistics
- Village-specific health status monitoring
- Disease trend analysis and outbreak alerts
- Common condition tracking by region

### 📊 Reports
- Automated diagnostic report generation
- Monthly and weekly health statistics
- Export capabilities for health authorities
- Data visualization and insights

## Technology Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library

### Backend
- **Node.js** with Express
- **OpenAI API** (via Nebius) for AI diagnostics
- **Multer** for image upload handling
- **Sharp** for image processing

## Getting Started

### Prerequisites
- Node.js (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**
   - Configure AI service API keys in backend environment
   - Set up image upload directories

4. **Start the application**
   ```bash
   # Start frontend (from project root)
   npm run dev
   
   # Start backend (in separate terminal)
   cd backend
   npm start
   ```

## API Endpoints

- `POST /api/diagnosis` - Create new diagnosis with AI analysis
- `GET /api/patients` - Retrieve patient records
- `GET /api/community/stats` - Community health statistics
- `GET /api/reports` - Generate health reports

## Contributing

This project supports rural healthcare initiatives. Contributions are welcome to improve AI accuracy, add new features, or enhance user experience for ASHA workers.

## Deployment

Deploy using [Lovable](https://lovable.dev/projects/09245f87-f3e3-47c9-9e65-a7de89f4e4c0) platform:
1. Open your Lovable project
2. Click Share → Publish
3. Configure custom domain if needed in Project → Settings → Domains

## License

Built for rural healthcare support and community health improvement.
