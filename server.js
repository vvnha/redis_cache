const express = require('express');
const redis = require('redis');
const fetch = require('node-fetch');

// create express application instance
const app = express();

const client = redis.createClient(6379);
client.connect();

// echo redis errors to the console
client.on('error', (err) => {
  console.log('Error ' + err);
});

// get photos list
app.get('/photos', async (req, res) => {
  // key to store results in Redis store
  const photosRedisKey = 'user:photos';
  client;
  try {
    // Try fetching the result from Redis first in case we have it cached
    const photos = await client.get(photosRedisKey);

    // If that key exists in Redis store
    if (photos) {
      return res.json({ source: 'cache', data: JSON.parse(photos) });
    } else {
      // Key does not exist in Redis store

      // Fetch directly from remote api
      fetch('https://jsonplaceholder.typicode.com/photos')
        .then((response) => response.json())
        .then((photos) => {
          // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
          client.setEx(photosRedisKey, 5, JSON.stringify(photos));

          // Send JSON response to client
          return res.json({ source: 'api', data: photos });
        })
        .catch((error) => {
          // log error message
          console.log(error);
          // send error to the client
          return res.json(error.toString());
        });
    }
  } catch (error) {
    // log error message
    console.log(error);
    // send error to the client
    return res.json(error.toString());
  }
});

// start express server at 3000 port
app.listen(3000, () => {
  console.log('Server listening on port: ', 3000);
});
