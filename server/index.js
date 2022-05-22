const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('./client'));
app.use(express.json());

app.get('/api', async (req, res) => {
  res.send('Get World!')
});

app.post('/api', async (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
  console.log(`Zonelink listening on port ${port}`)
});

