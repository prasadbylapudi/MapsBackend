const client = require('./db.js')
const express = require('express');
const app = express();
var cors = require('cors')
const bodyParser = require("body-parser");

app.use(cors())
app.use(bodyParser.json());

app.get('/home',(req,res)=>{
    console.log("inside home ")
    res.json("inside home")
})

app.post('/insertSampleData', async (req, res) => {
  try {
    const { name, latitude, longitude, address, description } = req.body;

    // Check if the required data is provided
    if (!name || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Insert the data into the database
    const query = `
      INSERT INTO locations (name, latitude, longitude, address, description)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [name, latitude, longitude, address, description];

    await client.query(query, values);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/locations', async (req, res) => {
  try {
    const query = 'SELECT * FROM locations';
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(3000, ()=>{
    console.log("Sever is now listening at port 3000");
})

client.connect();