const express = require('express');
const db = require('./db.js')
const app = express();
const port = 3000;

app.use(express.static('./client/html', {extensions:['html']}));
app.use(express.json());

app.listen(port, () => {
  console.log(`Zonelink listening on port ${port}`)
  db.connectToDB();
});

app.get('/api', async (req, res) => {
  res.send('Get World!')
});

app.post('/api', async (req, res) => {
  db.save(req.body);
});



