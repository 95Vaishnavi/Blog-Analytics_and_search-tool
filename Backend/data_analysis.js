const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');

const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const headers = {
  'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
};

axios.get(apiUrl, { headers })
  .then((response) => {
    try {
      // Assuming the fetched data is not in array form and needs processing
      // You can perform your data processing here
      
      // For example, you can convert it to an array if it's an object
      const processedData = Array.isArray(response.data) ? response.data : [response.data];

      // Calculate the total number of blogs
      const totalBlogs = processedData.length;

      // Determine the number of blogs with titles containing the word "privacy"
      const privacyBlogs = processedData.filter(blog => {
        // Check if the 'title' property exists and is a string before converting to lowercase
        return blog.title && typeof blog.title === 'string' && blog.title.toLowerCase().includes('privacy');
      }).length;

      // Create an array of unique blog titles (no duplicates)
      const uniqueBlogTitles = _.uniqBy(processedData, 'title').map(blog => blog.title);

      // Convert the analytics results to an object
      const analyticsResults = {
        totalBlogs,
        privacyBlogs,
        uniqueBlogTitles,
      };

      // Convert the analytics results to JSON
      const jsonData = JSON.stringify(analyticsResults, null, 2);

      // Specify the path and filename for the JSON file
      const jsonFilePath = 'analyticsResults.json';

      // Write the JSON data to the file
      fs.writeFile(jsonFilePath, jsonData, (err) => {
        if (err) {
          console.error('Error writing JSON file:', err);
        } else {
          console.log('Analytics results have been written to', jsonFilePath);
        }
      });
    } catch (error) {
      console.error('Error processing blog data:', error);
    }
  })
  .catch((error) => {
    console.error('Error fetching blog data:', error);
  });
