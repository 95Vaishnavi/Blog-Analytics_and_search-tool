const axios = require('axios');
const fs = require('fs');

const apiUrl = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const headers = {
  'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
};

axios.get(apiUrl, { headers })
  .then((response) => {
    // Assuming the fetched data is not in array form and needs processing
    // You can perform your data processing here
    
    // For example, you can convert it to an array if it's an object
    const processedData = Array.isArray(response.data) ? response.data : [response.data];

    // Convert the processed data to JSON
    const jsonData = JSON.stringify({ data: processedData }, null, 2);

    // Specify the path and filename for the JSON file
    const jsonFilePath = 'blogData.json';

    // Write the JSON data to the file
    fs.writeFile(jsonFilePath, jsonData, (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Data has been written to', jsonFilePath);
      }
    });
  })
  .catch((error) => {
    console.error('Error fetching blog data:', error);
  });
