const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const gbRootModules = require('../../gbmodules/gbRootModules');

// Get All from BranchData
router.get('/', async (req, res) => {
  const branch = await loadBranchCollection();
  res.send(await branch.find({}).toArray());
});

// Get BranchData
router.get('/info/:branchName', async (req, res) => {
  const branch = await loadBranchCollection();
  res.send(await branch.find({name:req.params.branchName}).toArray());
});

// Add BranchData
router.post('/', async (req, res) => {
  const branch = await loadBranchCollection();
  var branchDataInput = req.body;
      //Add timestamp to entry
      branchDataInput.timeStamp = Date.now();
	console.log(branchDataInput);
  await branch.insertOne(
	//Please note that the {} are not in this request because
	//it is included in the POST.
        branchDataInput
  );
  res.status(201).send();
});

// Delete BranchData
router.delete('/:id', async (req, res) => {
  const branch = await loadBranchCollection();
  await branch.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

//Connection to MongoDB
async function loadBranchCollection() {
  const client = await mongodb.MongoClient.connect(
    'mongodb://localhost',
    {
      useNewUrlParser: true
    }
  );

  return client.db('gbRoot').collection('branchData');
}

module.exports = router;
