const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();

var collectionName = "stemData";

// Get StemData
router.get('/', async (req, res) => {
  const stem = await useCollection(collectionName);
  res.send(await stem.find({}).toArray());
});

// Get BranchData
router.get('/info/:stemName', async (req, res) => {
  const stem = await useCollection(collectionName);
  res.send(await stem.find({name:req.params.stemName}).toArray());
});

// Add StemData
router.post('/', async (req, res) => {
  const stem = await useCollection(collectionName);
  var stemDataInput = req.body;
      //Add timestamp to entry
      stemDataInput.timeStamp = Date.now();
	console.log(stemDataInput);
  await stem.insertOne(
	//Please note that the {} are not in this request because
	//it is included in the POST request.
        stemDataInput
  );
  res.status(201).send();
});

// Delete StemData
router.delete('/:id', async (req, res) => {
  const stem = await useCollection(collectionName);
  await stem.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

//Connection to MongoDB
async function useCollection(collectionName) {
  const client = await mongodb.MongoClient.connect(
    'mongodb://localhost',
    {
      useNewUrlParser: true
    }
  );

  return client.db('gbRoot').collection(collectionName);
}

module.exports = router;
