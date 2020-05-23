const fs = require('fs');
const express = require('express');
const router = express.Router();
const core = require('../../../gbmodules/gbRootCore.js');
var gbSystem = require(`${core.coreVars.systemConfsDir}/system_vars.json`);

// Get API Key Object
router.post('/retrieve/:clientId', async (req, res) => {
 //Read Certificate to object to DB
// const loadCollection = core.loadCollection(core.coreVars.dbServer,core.coreVars.dbName,core.coreVars.dbKeysDataCollection);
// await loadCollection.insertOne(keyObject);
// res.status(200).send(await loadCollection.find({clientFullName:req.params.clientId}).toArray());
// res.status(200).send(await loadCollection.find({clientFullName:req.params.clientId}));
 res.status(200).send(req.params.clientId);
});

// Generate random Client API Key Object
router.post('/generate', async (req, res) => {
 res.redirect(307, `/api/keys/generate/gbdevice-${core.genRegular(5).toLowerCase()}`);
});

// Generate Client API Key Object
router.post('/generate/:clientId', async (req, res) => {
 keyObject = {"timeStamp": Date.now(), "status": "success", "clientName": `${req.params.clientId}`,  "clientFullName": `${req.params.clientId}.${gbSystem.systemDomain}`, "clientAPIKey": core.genRegular(50), "gbAuth": req.headers.gbauth};
 //Add API Key to object to DB
// const loadCollection = core.loadCollection(core.coreVars.dbServer,core.coreVars.dbName,core.coreVars.dbKeysDataCollection);
// await loadCollection.insertOne(keyObject);
 //Send Client API Key data object
 console.log(req.headers);
 res.status(200).json(keyObject);
});

module.exports = router;
