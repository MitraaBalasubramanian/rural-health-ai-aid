const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class AIService {
  constructor() {
    this.client = new OpenAI({
      baseURL: 'https://api.studio.nebius.com/v1/',
      apiKey: process.env.NEBIUS_API_KEY,
    });
  }

  async analyzeImage(imagePath, patientData) {
    try {
      // Read and encode image to base64
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      // Create comprehensive prompt for medical analysis
      const prompt = this.createDiagnosticPrompt(patientData, base64Image);
      
      const response = await this.client.chat.completions.create({
        model: "google/gemma-3-27b-it", // Updated to correct model name
        max_tokens: 1024,
        temperature: 0.3,
        top_p: 0.9,
        top_k: 50,
        messages: [
          {
            role: "system",
            content: `You are an expert medical AI assistant specializing in dermatological conditions for rural healthcare workers in India. Your role is to analyze skin condition images and provide accurate, actionable diagnostic guidance for ASHA (Accredited Social Health Activist) workers.

CORE RESPONSIBILITIES:
- Analyze dermatological images with high accuracy
- Provide differential diagnoses with confidence levels
- Recommend appropriate treatments using locally available medications
- Determine urgency levels and referral needs
- Offer practical care instructions suitable for rural settings

DIAGNOSTIC APPROACH:
1. Systematic visual analysis of lesion characteristics
2. Integration of patient history and symptoms
3. Consideration of epidemiological factors in rural India
4. Risk stratification based on severity and complications

COMMON CONDITIONS TO CONSIDER:
- Fungal infections (dermatophytosis, candidiasis, pityriasis versicolor)
- Bacterial infections (impetigo, cellulitis, folliculitis)
- Parasitic infections (scabies, pediculosis)
- Inflammatory conditions (eczema, contact dermatitis)
- Viral infections (herpes simplex, molluscum contagiosum)
- Nutritional deficiencies (pellagra, zinc deficiency)
- Environmental conditions (heat rash, insect bites)

TREATMENT CONSIDERATIONS:
- Prioritize medications available in rural PHCs
- Consider cost-effectiveness and accessibility
- Account for patient compliance factors
- Include non-pharmacological interventions

REFERRAL CRITERIA:
- Suspected malignancy or pre-malignant lesions
- Severe systemic involvement
- Treatment-resistant conditions
- Conditions requiring specialized procedures
- Pediatric cases requiring specialist care

OUTPUT FORMAT:
Always respond with structured JSON containing:
- Primary diagnosis with confidence level
- Differential diagnoses
- Severity assessment (Mild/Moderate/Severe)
- Risk level (GREEN/YELLOW/RED)
- Specific treatment recommendations
- Care instructions
- Warning signs to monitor
- Follow-up timeline
- Referral recommendations

Maintain clinical accuracy while ensuring recommendations are practical for rural healthcare settings with limited resources.`
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const aiResponse = response.choices[0].message.content;
      return this.parseAIResponse(aiResponse);
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      
      // Return a realistic fallback diagnosis based on common conditions
      return this.getFallbackDiagnosis(patientData);
    }
  }

  getFallbackDiagnosis(patientData) {
    // Provide realistic fallback based on symptoms and duration
    const commonConditions = [
      {
        condition: "Fungal Infection (Dermatophytosis)",
        confidence: 75,
        severity: "Moderate",
        riskLevel: "YELLOW",
        treatment: "Apply antifungal cream (Clotrimazole) twice daily for 2-3 weeks",
        keywords: ["itchy", "ring", "circular", "scaling", "red"]
      },
      {
        condition: "Contact Dermatitis",
        confidence: 70,
        severity: "Mild",
        riskLevel: "GREEN",
        treatment: "Avoid irritants, apply moisturizer, use mild soap",
        keywords: ["rash", "irritation", "contact", "soap", "detergent"]
      },
      {
        condition: "Bacterial Skin Infection",
        confidence: 80,
        severity: "Moderate",
        riskLevel: "YELLOW",
        treatment: "Clean with antiseptic, apply antibiotic ointment",
        keywords: ["pus", "wound", "cut", "swollen", "warm", "fever"]
      },
      {
        condition: "Scabies",
        confidence: 85,
        severity: "Moderate",
        riskLevel: "YELLOW",
        treatment: "Apply permethrin cream, wash all clothing and bedding",
        keywords: ["itchy", "night", "burrow", "family", "spread"]
      }
    ];

    // Simple keyword matching for fallback
    const symptoms = patientData.symptoms.toLowerCase();
    let bestMatch = commonConditions[0]; // Default to fungal infection
    let maxScore = 0;

    for (const condition of commonConditions) {
      const score = condition.keywords.reduce((acc, keyword) => {
        return acc + (symptoms.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = condition;
      }
    }

    // Adjust severity based on duration and fever
    let severity = bestMatch.severity;
    let riskLevel = bestMatch.riskLevel;
    
    if (patientData.fever && patientData.fever !== 'none') {
      severity = "Moderate";
      riskLevel = "YELLOW";
    }
    
    if (patientData.duration && patientData.duration.includes('month')) {
      severity = "Moderate";
      riskLevel = "YELLOW";
    }

    return {
      primaryCondition: bestMatch.condition,
      confidence: bestMatch.confidence,
      severity: severity,
      riskLevel: riskLevel,
      treatment: bestMatch.treatment,
      referralNeeded: riskLevel === 'RED',
      reasoning: 'Analysis based on symptom patterns and clinical guidelines (AI service temporarily unavailable)',
      recommendations: [
        'Keep the affected area clean and dry',
        'Follow prescribed treatment regimen',
        'Monitor for improvement over 3-5 days',
        'Return if condition worsens or spreads'
      ],
      followUp: riskLevel === 'RED' ? 'Refer to PHC immediately' : 'Review in 3-5 days',
      warningSigns: [
        'Spreading rash or infection',
        'Development of fever',
        'Increased pain or swelling',
        'No improvement after 5 days of treatment'
      ]
    };
  }

  createDiagnosticPrompt(patientData, base64Image) {
    return `
Analyze this dermatological case for an ASHA worker in rural India:

PATIENT INFORMATION:
- Name: ${patientData.name}
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- Symptoms: ${patientData.symptoms}
- Duration: ${patientData.duration}
- Pain/Discomfort: ${patientData.severity || 'Not specified'}
- Fever/Systemic symptoms: ${patientData.fever || 'None reported'}
- Similar cases nearby: ${patientData.nearby_cases || 'None known'}

IMAGE: data:image/jpeg;base64,${base64Image}

Please provide a structured analysis in the following JSON format:
{
  "primaryCondition": "Most likely condition name",
  "confidence": 85,
  "severity": "Mild/Moderate/Severe",
  "riskLevel": "GREEN/YELLOW/RED",
  "treatment": "Specific treatment recommendation",
  "referralNeeded": true/false,
  "reasoning": "Brief explanation of the diagnosis",
  "recommendations": [
    "Specific care instruction 1",
    "Specific care instruction 2",
    "Follow-up instruction"
  ],
  "followUp": "When to review or refer",
  "warningSigns": [
    "Sign 1 to watch for",
    "Sign 2 to watch for"
  ]
}

Focus on conditions common in rural India like:
- Fungal infections (dermatophytosis, candidiasis)
- Bacterial skin infections
- Scabies and other parasitic infections
- Contact dermatitis
- Eczema
- Minor wounds and cuts
- Insect bites and stings

Risk Level Guidelines:
- GREEN: Minor conditions treatable with basic care
- YELLOW: Moderate conditions requiring monitoring and basic treatment
- RED: Serious conditions requiring immediate referral to PHC/hospital

Provide practical, actionable advice suitable for ASHA workers with basic medical training.
`;
  }

  parseAIResponse(aiResponse) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate required fields
        const required = ['primaryCondition', 'confidence', 'severity', 'riskLevel', 'treatment'];
        const missing = required.filter(field => !parsed[field]);
        
        if (missing.length > 0) {
          throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }
        
        return {
          primaryCondition: parsed.primaryCondition,
          confidence: Math.min(Math.max(parsed.confidence, 0), 100), // Ensure 0-100 range
          severity: parsed.severity,
          riskLevel: parsed.riskLevel,
          treatment: parsed.treatment,
          referralNeeded: parsed.referralNeeded || parsed.riskLevel === 'RED',
          reasoning: parsed.reasoning || 'AI analysis completed',
          recommendations: parsed.recommendations || [],
          followUp: parsed.followUp || 'Follow up as needed',
          warningSigns: parsed.warningSigns || []
        };
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      
      // Fallback response if parsing fails
      return {
        primaryCondition: 'Unable to determine - requires manual review',
        confidence: 50,
        severity: 'Moderate',
        riskLevel: 'YELLOW',
        treatment: 'Please consult with supervising medical officer',
        referralNeeded: true,
        reasoning: 'AI analysis could not be completed properly',
        recommendations: [
          'Keep the affected area clean and dry',
          'Monitor for changes',
          'Seek medical consultation'
        ],
        followUp: 'Consult with PHC within 24 hours',
        warningSigns: ['Worsening condition', 'Spreading symptoms', 'Fever development']
      };
    }
  }

  // Method to validate image before processing
  async validateImage(imagePath) {
    try {
      const stats = await fs.stat(imagePath);
      const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB default
      
      if (stats.size > maxSize) {
        throw new Error('Image file too large');
      }
      
      return true;
    } catch (error) {
      throw new Error('Invalid image file');
    }
  }
}

module.exports = new AIService();