const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to fetch and process the data
app.use('/api/blog-stats', async (req, res, next) => {
  try {
    const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const headers = {
      'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
    };

    const response = await axios.get(apiUrl, { headers });
    
    // Assuming the fetched data is not in array form and needs processing
    // You can perform your data processing here
    
    // For example, you can convert it to an array if it's an object
    const processedData = Array.isArray(response.data) ? response.data : [response.data];

    // Attach the processed data to the request object so it can be accessed in the route handler
    req.processedData = processedData;

    next(); // Continue to the route handler
  } catch (error) {
    console.error('Error fetching blog data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route handler to respond with the processed data
app.get('/api/blog-stats', (req, res) => {
  // Access the processed data from the request object
  const { processedData } = req;

  // You can now use the processedData in your response
  const output=res.json({ data: processedData });
  console.log(output);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
