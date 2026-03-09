const express = require('express');
const axios = require('axios');   // <-- add axios for external API calls
const app = express();
const port = 4000;

app.use(express.json());

// Location endpoint (static fallback)
app.get('/api/getLocation', (req, res) => {
  res.json({ city: "Los Banos", country: "Philippines" });
});

// GeoLinker endpoint (live GPS data)
app.get('/api/geolinker', async (req, res) => {
  try {
    const response = await axios.get('https://cloud.circuitdigest.com/api/deviceData', {
      headers: { 'Authorization': 'cd_che_060326_COD-na' }  
    });
    res.json(response.data); // expected { lat: ..., lon: ... }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GeoLinker data' });
  }
});

// Save user endpoint
app.post('/api/saveUser', (req, res) => {
  const user = req.body;
  if (!user.name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.json({ message: "User saved successfully", user });
});

// Route finder endpoint
app.get('/api/getRoute', (req, res) => {
  const dest = req.query.dest;
  if (!dest) {
    return res.status(400).json({ error: "Destination is required" });
  }
  res.json({ route: `Sample route to ${dest}` });
});

// Saved places endpoint
app.get('/api/savedPlaces', (req, res) => {
  res.json({ places: ["Home", "Work", "Central Park"] });
});

// Root route
app.get('/', (req, res) => {
  res.send('EchoRoute server is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
