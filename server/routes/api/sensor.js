const express = require('express');
const router = express.Router();
const loadCollection = require('../../gbmodules/gbRootModules').loadCollection;

// Get SensorData
router.get('/', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
res.send([{count: String(await sensor.find().count())}, {data: await sensor.find().sort({timeStamp:-1}).limit(100).toArray()}]);
});

router.get('/:skip', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  var skip = req.params.skip * 100;
  if (req.params.skip < 1) {
	res.send([{count: String(await sensor.find().count())}, {data: await sensor.find().sort({timeStamp:-1}).limit(100).toArray()}]);
   } else {
	res.send([{count: String(await sensor.find().count())}, {data: await sensor.find().sort({timeStamp:-1}).limit(100).skip(skip).toArray()}]);
   }
});

router.get('/device/:device', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  res.send(await sensor.find({deviceId:req.params.device}).sort({timeStamp:-1}).limit(100).toArray());
});

router.get('/device/:device/:skip', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  var skip = req.params.skip * 100;
  if (req.params.skip < 1) {
	res.send(await sensor.find({deviceId:req.params.device}).sort({timeStamp:-1}).limit(100).toArray());
   } else {
	res.send(await sensor.find({deviceId:req.params.device}).sort({timeStamp:-1}).limit(100).skip(skip).toArray());
   }
});

router.get('/type/:type', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  res.send(await sensor.find({readingType:req.params.type}).sort({timeStamp:-1}).limit(100).toArray());
});

router.get('/type/:type/:skip', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  var skip = req.params.skip * 100;
  if (req.params.skip < 1) {
	res.send(await sensor.find({readingType:req.params.type}).sort({timeStamp:-1}).limit(100).toArray());
   } else {
	res.send(await sensor.find({readingType:req.params.type}).sort({timeStamp:-1}).limit(100).skip(skip).toArray());
   }
});

router.get('/:device/:type', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  res.send(await sensor.find({deviceId:req.params.device,readingType:req.params.type}).sort({timeStamp:-1}).limit(100).toArray());
});

router.get('/:device/:type/:skip', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  var skip = req.params.skip * 100;
  if (req.params.skip < 1) {
	res.send(await sensor.find({deviceId:req.params.device,readingType:req.params.type}).sort({timeStamp:-1}).limit(100).toArray());
   } else {
	res.send(await sensor.find({deviceId:req.params.device,readingType:req.params.type}).sort({timeStamp:-1}).limit(100).skip(skip).toArray());
   }
});

// Add SensorData
//Single
router.post('/', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  var sensorDataInput = req.body;
      //Add timestamp to entry
      sensorDataInput.timeStamp = Date.now();
  await sensor.insertOne(
	//Please note that the {} are not in this request because
	//it is included in the POST.
        sensorDataInput
  );
  res.status(201).send();
});

//Many
router.post('/many', async (req, res) => {
  const sensor = await loadCollection('localhost','gbRoot','sensorData');
  var sensorDataInput = req.body;
  await sensor.insertMany(
	//Please note that the [{}] are not in this request because
	//it is included in the POST.
        sensorDataInput
  );
  res.status(201).send();
});

module.exports = router;
