import axios from 'axios';

export const fetchCheapest8ths = async () => {
  try {
    console.log("Fetching from API...");
    const response = await axios.get('https://drtav4h7ai.execute-api.us-east-2.amazonaws.com/prod');
    
    console.log("API Full Response:", response.data); // ✅ Debugging step

    if (response.data.body) {
      const parsedData = JSON.parse(response.data.body); // ✅ Parse JSON inside "body"
      return parsedData; // ✅ Returns { cheapestEighths: [...], highestThcEighth: {...} }
    }

    return null;
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error);
    return null;
  }
};
