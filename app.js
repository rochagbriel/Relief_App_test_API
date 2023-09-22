const express = require('express');
const app = express();
const port = 4800;

// Define a simple API endpoint
app.get('/', (req, res) => {
  res.send('Hello, this is your API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});