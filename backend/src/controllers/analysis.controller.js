import Analysis from '../models/analysis.model.js';
import ProBono from '../models/probono.model.js';
import axios from 'axios';

// Create a new case analysis
export const createAnalysis = async (req, res) => {
  try {
    const { problemDescription, areaOfLaw } = req.body;

    if (!problemDescription || !areaOfLaw) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both problem description and area of law'
      });
    }

    // Generate AI-powered analysis metrics
    const analysis = await generateAnalysisMetrics(problemDescription, areaOfLaw);

    // Find suitable lawyers based on area of law and risk level
    const suggestedLawyers = await ProBono.find({
      areasOfPractice: areaOfLaw,
      isActive: true
    }).sort('-rating').limit(3);

    // Generate steps based on the problem
    const steps = generateSteps(areaOfLaw);

    // Generate relevant articles
    const relevantArticles = generateRelevantArticles(areaOfLaw);

    const newAnalysis = await Analysis.create({
      user: req.user._id,
      problemDescription,
      areaOfLaw,
      analysis,
      suggestedLawyers: suggestedLawyers.map(lawyer => lawyer._id),
      steps,
      relevantArticles
    });

    // Populate the lawyers' information
    await newAnalysis.populate({
      path: 'suggestedLawyers',
      select: 'lawyer rating experience areasOfPractice',
      populate: {
        path: 'lawyer',
        select: 'name email'
      }
    });

    res.status(201).json({
      status: 'success',
      data: { analysis: newAnalysis }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get analysis by ID
export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id)
      .populate({
        path: 'suggestedLawyers',
        select: 'lawyer rating experience areasOfPractice',
        populate: {
          path: 'lawyer',
          select: 'name email'
        }
      });

    if (!analysis) {
      return res.status(404).json({
        status: 'fail',
        message: 'Analysis not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { analysis }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all analyses for a user
export const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .populate({
        path: 'suggestedLawyers',
        select: 'lawyer rating experience areasOfPractice',
        populate: {
          path: 'lawyer',
          select: 'name email'
        }
      })
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: analyses.length,
      data: { analyses }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Helper functions
const generateTimeEstimate = () => {
  const estimates = ['1-2 weeks', '2-4 weeks', '1-3 months', '3-6 months', '6-12 months'];
  return estimates[Math.floor(Math.random() * estimates.length)];
};

const generateSteps = (areaOfLaw) => {
  // In a real application, these steps would be generated by AI based on the specific case
  const baseSteps = [
    { stepNumber: 1, description: 'Initial consultation with lawyer', estimatedTime: '1-2 days' },
    { stepNumber: 2, description: 'Document collection and review', estimatedTime: '3-5 days' },
    { stepNumber: 3, description: 'Legal strategy development', estimatedTime: '1 week' },
    { stepNumber: 4, description: 'Filing necessary paperwork', estimatedTime: '2-3 days' },
    { stepNumber: 5, description: 'Initial hearing or mediation', estimatedTime: '2-4 weeks' }
  ];
  return baseSteps;
};

const generateRelevantArticles = (areaOfLaw) => {
  // In a real application, these would be fetched from a legal database
  const articles = [
    {
      articleNumber: 'Art. 15',
      title: 'Rights and Obligations',
      description: 'Fundamental rights in legal proceedings',
      relevance: 95
    },
    {
      articleNumber: 'Art. 22',
      title: 'Due Process',
      description: 'Procedural requirements and timelines',
      relevance: 85
    },
    {
      articleNumber: 'Art. 45',
      title: 'Remedies',
      description: 'Available legal remedies and compensation',
      relevance: 75
    }
  ];
  return articles;
};

// Generate analysis metrics using MistralAI and specialized algorithms
const generateAnalysisMetrics = async (problemDescription, areaOfLaw) => {
  try {
    // Get initial analysis from MistralAI
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are a legal risk assessment expert. Analyze the following legal problem and provide three metrics on a scale of 0-100. Your response must be EXACTLY three numbers between 0-100, separated by commas, with no other text or characters. Example valid response: "75,60,85"\n\nMetrics to analyze:\n1. Risk Level (potential consequences and legal exposure)\n2. Resolution Probability (likelihood of favorable resolution)\n3. Case Complexity (legal intricacies and procedural requirements)'
          },
          {
            role: 'user',
            content: `Problem: ${problemDescription}\nArea of Law: ${areaOfLaw}`
          }
        ],
        max_tokens: 100,
        temperature: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral AI API');
    }

    // Parse and validate AI response
    const content = response.data.choices[0].message.content.trim();
    // Extract numbers using regex pattern that matches numbers between 0-100
    const matches = content.match(/\b([0-9]|[1-9][0-9]|100)\b/g);
    
    if (!matches || matches.length < 3) {
      console.error('Invalid AI response format:', content);
      throw new Error('AI response does not contain the required metrics');
    }

    const metrics = matches.slice(0, 3).map(num => {
      const parsed = parseInt(num);
      if (parsed < 0 || parsed > 100) {
        console.error('Invalid metric value:', parsed);
        throw new Error('Metric value out of range (0-100)');
      }
      return parsed;
    });

    if (metrics.length !== 3) {
      throw new Error('Invalid number of metrics received from AI');
    }

    const [aiRiskLevel, aiResolutionProb, aiComplexity] = metrics;

    // Apply specialized legal risk assessment algorithms
    const riskLevel = calculateFinalRiskLevel(aiRiskLevel, areaOfLaw);
    const resolutionProbability = calculateResolutionProbability(aiResolutionProb, aiComplexity, areaOfLaw);
    const complexity = calculateComplexityScore(aiComplexity, areaOfLaw);

    return {
      riskLevel,
      resolutionProbability,
      complexity,
      timeEstimate: generateTimeEstimate(complexity)
    };
  } catch (error) {
    console.error('Error generating analysis metrics:', error);
    throw new Error('Failed to generate analysis metrics');
  }
};

// Calculate final risk level using domain-specific factors
const calculateFinalRiskLevel = (aiRiskLevel, areaOfLaw) => {
  const areaWeights = {
    'Criminal': 1.2,
    'Corporate': 1.1,
    'Intellectual Property': 1.05,
    'Tax': 1.15,
    'Civil': 0.95,
    'Family': 0.9,
    'Other': 1.0
  };

  let finalRisk = aiRiskLevel * (areaWeights[areaOfLaw] || 1.0);
  
  // Apply risk modifiers based on legal domain best practices
  if (finalRisk > 80) finalRisk *= 1.1; // High-risk cases need extra attention
  if (finalRisk < 20) finalRisk *= 0.9; // Low-risk cases might be overestimated

  return Math.min(Math.max(Math.round(finalRisk), 0), 100);
};

// Calculate resolution probability considering multiple factors
const calculateResolutionProbability = (aiProb, aiComplexity, areaOfLaw) => {
  const baseProb = aiProb;
  const complexityImpact = Math.max(0, 100 - aiComplexity) / 100;
  
  // Domain-specific success rates (based on legal statistics)
  const domainSuccessRates = {
    'Criminal': 0.65,
    'Civil': 0.75,
    'Corporate': 0.8,
    'Family': 0.85,
    'Intellectual Property': 0.7,
    'Tax': 0.6,
    'Other': 0.7
  };

  const finalProb = baseProb * complexityImpact * (domainSuccessRates[areaOfLaw] || 0.7);
  return Math.min(Math.max(Math.round(finalProb), 0), 100);
};

// Calculate complexity score using multiple indicators
const calculateComplexityScore = (aiComplexity, areaOfLaw) => {
  const domainComplexityFactors = {
    'Criminal': 1.15,
    'Corporate': 1.2,
    'Intellectual Property': 1.25,
    'Tax': 1.3,
    'Civil': 1.0,
    'Family': 0.95,
    'Other': 1.1
  };

  const finalComplexity = aiComplexity * (domainComplexityFactors[areaOfLaw] || 1.1);
  return Math.min(Math.max(Math.round(finalComplexity), 0), 100);
};