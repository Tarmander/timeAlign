const express = require('express');
const db = require('./db.js')
const app = express();
const port = 3000;

app.use(express.static('client'));
app.use(express.json());

app.listen(port, () => {
  console.log(`Zonelink listening on port ${port}`)
  db.connectToDB();
});

app.post('/retrieve', async (req, res) => {
  const data = await db.grabGroupInfo(req.body);
  overlapTimes = getOverlap(data);
  res.send(overlapTimes);
});

app.post('/update', async (req, res) => {
  console.log(req.body.data, 'Received Body');
  db.save(req.body);
});


//takes 2D array of "data" mappings and bitwise and the values into a single 1D array of times
function getOverlap(dataArray){
  if (dataArray.length == 0){
      throw "No data";
  }
  var result = dataArray[0];
  for (var user = 1; user < dataArray.length; user++){
      for (var index = 0; index < NUMDAYS; index++){
          result[index] = result[index] & dataArray[user][index];
      }
  }

  return result;
}