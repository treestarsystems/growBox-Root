const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const sensor = require('./routes/api/sensor');
const branch = require('./routes/api/branch');
const stem = require('./routes/api/stem');
//const gbRootModules = require('./modules/gbRootModules');

app.use('/api/sensor', sensor);
app.use('/api/branch', branch);
app.use('/api/stem', stem);

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
