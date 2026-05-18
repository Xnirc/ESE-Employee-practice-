const axios = require('axios');
const Employee = require('../models/Employee');

exports.getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;
    
    // Support either employeeId or passing full data directly for testing
    let employeeData = req.body.employeeData;
    
    if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      employeeData = employee;
    } else if (!employeeData) {
      // For general multiple employees ranking if no id is provided
      employeeData = await Employee.find();
    }

    const prompt = `Analyze the following employee data and provide AI-based recommendations.
    Include Promotion Recommendation, Employee Ranking (if multiple), Training Suggestions, and Feedback.
    Data: ${JSON.stringify(employeeData)}
    
    Format the response clearly.`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      // Fallback Mock Data for demo purposes if no API key is set
      return sendMockRecommendation(employeeData, res);
    }

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: "openai/gpt-3.5-turbo", // Or any free model available on OpenRouter
        messages: [{ role: "user", content: prompt }]
      }, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      res.json({ recommendation: response.data.choices[0].message.content });
    } catch (apiError) {
      console.log('API Error, falling back to mock data:', apiError.message);
      return sendMockRecommendation(employeeData, res);
    }
    
  } catch (err) {
    next(err);
  }
};

function sendMockRecommendation(data, res) {
  let rec = "";
  if (Array.isArray(data)) {
    rec = "1. Aman Verma - Promotion suggested (High Score)\n2. Other Employee - Needs Training (Low Score)";
  } else {
    if (data.performanceScore >= 80) {
      rec = "Promotion suggestion: High performance, ready for next level. Training: Leadership skills.";
    } else if (data.performanceScore < 50) {
      rec = "Improvement feedback: Needs focus on core tasks. Training: Basics and time management.";
    } else if (!data.skills || data.skills.length < 2) {
      rec = "Skill enhancement recommendation: Needs to learn new technologies.";
    } else {
      rec = "Good performance. Keep it up.";
    }
  }
  res.json({ recommendation: "MOCK AI RESPONSE:\n" + rec });
}
