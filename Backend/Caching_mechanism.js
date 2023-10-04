const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const PORT = process.env.PORT || 3000;

const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const headers = {
  'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
};

// Configure memoization with caching options (e.g., cache results for 60 seconds)
const cacheOptions = { maxAge: 60000 }; // Cache for 60 seconds

// Create a custom cache key generator function
const cacheKeyGenerator = (query, params) => {
  return `${query}-${JSON.stringify(params)}`;
};

// Memoize the search function with caching
const memoizedSearch = _.memoize(
  async (query, params) => {
    try {
      const response = await axios.get(apiUrl, { headers });

      // Assuming the fetched data is not in array form and needs processing
      // You can perform your data processing here
      const processedData = Array.isArray(response.data) ? response.data : [response.data];

      // Perform the custom search based on the query (case-insensitive)
      const searchResults = processedData.filter(blog => {
        return (
          blog.title &&
          typeof blog.title === 'string' &&
          blog.title.toLowerCase().includes(query.toLowerCase())
        );
      });

      return { results: searchResults };
    } catch (error) {
      console.error('Error fetching or processing blog data:', error);
      throw error; // Re-throw the error to allow error handling for this function
    }
  },
  cacheKeyGenerator, // Use the custom cache key generator
  cacheOptions // Use the cache options
);

// Middleware to fetch blog data and perform search using memoization
app.get('/api/blog-search', async (req, res) => {
  try {
    // Extract the search query from the request query parameters
    const query = req.query.query;

    // Check if the 'query' parameter is provided and is a non-empty string
    if (!query || typeof query !== 'string' || query.trim() === '') {
      res.status(400).json({ error: 'Invalid search query' });
      return;
    }

    // Use the memoized search function with the query and query parameters
    const results = await memoizedSearch(query, {});

    // Respond with the search results
    res.json(results);
  } catch (error) {
    console.error('Error fetching or processing blog data:', error);
    
    // Handle specific error cases
    if (error.response) {
      // The third-party API returned an error response
      res.status(error.response.status).json({ error: 'Third-party API error' });
    } else {
      // Other unexpected errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
