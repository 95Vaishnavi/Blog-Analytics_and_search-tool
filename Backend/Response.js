const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const headers = {
  'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
};


app.get('/api/blog-stats', (req, res) => {
  axios.get(apiUrl, { headers })
    .then((response) => {
      try {
        // Assuming the fetched data is not in array form and needs processing
        // You can perform your data processing here
        
        // For example, you can convert it to an array if it's an object
        const processedData = Array.isArray(response.data) ? response.data : [response.data];

        // Calculate the total number of blogs
        const totalBlogs = processedData.length;

        // Find the title of the longest blog
        const longestBlog = _.maxBy(processedData, blog => {
          // Check if the 'content' property exists and is a string before determining its length
          return blog.content && typeof blog.content === 'string' ? blog.content.length : 0;
        });
        const longestBlogTitle = longestBlog ? longestBlog.title : '';

        // Determine the number of blogs with titles containing the word "privacy" (case-insensitive)
        const privacyBlogs = processedData.filter(blog => {
          // Check if the 'title' property exists, is a string, and contains "privacy" (case-insensitive)
          return (
            blog.title &&
            typeof blog.title === 'string' &&
            blog.title.toLowerCase().includes('privacy')
          );
        }).length;

        // Create an array of unique blog titles (no duplicates)
        const uniqueBlogTitles = _.uniqBy(processedData, 'title').map(blog => blog.title);

        // Create a JSON response object containing the statistics
        const jsonResponse = {
          totalBlogs,
          longestBlogTitle,
          privacyBlogs,
          uniqueBlogTitles,
        };

        const resp=res.json(jsonResponse);
        console.log(resp);
      } catch (error) {
        console.error('Error processing blog data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })
    .catch((error) => {
      console.error('Error fetching blog data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/api/blog-search', async (req, res) => {
    try {
      const response = await axios.get(apiUrl, { headers });
      
      // Assuming the fetched data is not in array form and needs processing
      // You can perform your data processing here
      const processedData = Array.isArray(response.data) ? response.data : [response.data];
  
      // Extract the search query from the request query parameters
      const query = req.query.query;
  
      // Perform the custom search based on the query (case-insensitive)
      const searchResults = processedData.filter(blog => {
        // Check if the 'title' property exists, is a string, and is not undefined before converting to lowercase
        return (
          blog.title &&
          typeof blog.title === 'string' &&
          typeof query === 'string' &&
          blog.title.toLowerCase().includes(query.toLowerCase())
        );
      });
  
      // Respond with the search results
      res.json({ results: searchResults });
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
app.get('/api/blog-search', async (req, res) => {
  try {
    const response = await axios.get(apiUrl, { headers });
    
    // Assuming the fetched data is not in array form and needs processing
    // You can perform your data processing here
    const processedData = Array.isArray(response.data) ? response.data : [response.data];

    // Extract the search query from the request query parameters
    const query = req.query.query;

    // Perform the custom search based on the query (case-insensitive)
    const searchResults = processedData.filter(blog => {
      // Check if the 'title' property exists, is a string, and is not undefined before converting to lowercase
      return (
        blog.title &&
        typeof blog.title === 'string' &&
        typeof query === 'string' &&
        blog.title.toLowerCase().includes(query.toLowerCase())
      );
    });

    // Respond with the search results
    res.json({ results: searchResults });
  } catch (error) {
    console.error('Error fetching or processing blog data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
