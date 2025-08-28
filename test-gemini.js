// Simple test script to verify Gemini API connection
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './ad-mockup-generator/.env' });

async function testGeminiConnection() {
  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      console.error('❌ No API key found in .env file');
      return;
    }
    
    console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Say 'API Connected!' if you can read this");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API Response:', text);
    console.log('\n🎉 AI_MEE is connected to Gemini API!');
    
  } catch (error) {
    console.error('❌ Failed to connect to Gemini API:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('   Check that your API key in .env is valid');
    }
  }
}

testGeminiConnection();