import { api } from './src/services/api.js';

// We need to mock import.meta.env for Node.js environment
globalThis.import = {
  meta: {
    env: {
      VITE_API_BASE_URL: 'http://127.0.0.1:8000'
    }
  }
};

async function runTests() {
  const endpoints = ['getHealth', 'getDistricts', 'getDemographics', 'getInfrastructure'];
  
  console.log('Testing API endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting ${endpoint}():`);
      const result = await api[endpoint]();
      console.log(`✅ Success:`, result);
    } catch (error) {
      console.error(`❌ Error found:`, error.message);
      if (error.status) {
        console.error(`Status code:`, error.status);
      }
      if (error.data) {
        console.error(`Error data:`, error.data);
      }
    }
  }
}

runTests();
