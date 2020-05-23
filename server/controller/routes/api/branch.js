const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const core = require('../../../gbmodules/gbRootCore.js');
var gbSystem = require(`${core.coreVars.systemConfsDir}/system_vars.json`);

// Get All from BranchData
router.get('/', async (req, res) => {
 const branch = await core.loadCollection(core.coreVars.dbBranchDataCollection);
console.log(branch);
 res.send(await branch.find({}).toArray());
});

// Get BranchData
router.get('/info/:branchName', async (req, res) => {
 const branch = await core.loadCollection(core.coreVars.dbBranchDataCollection);
 res.send(await branch.find({name:req.params.branchName}).toArray());
});

// Add BranchData
router.post('/', async (req, res) => {
 const branch = await core.loadCollection(core.coreVars.dbBranchDataCollection);
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
 const branch = await core.loadCollection(core.coreVars.dbBranchDataCollection);
 await branch.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
 res.status(200).send();
});

module.exports = router;
