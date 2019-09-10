const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const core = require(path.join(__dirname, 'gbmodules/gbRootModules.js'));
const daemon = require(path.join(__dirname, 'service.js'));
const emoji = require('node-emoji');
const bodyParser = require('body-parser');
const cors = require('cors');

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

//Ensure the correct permissions are applied to the scripts
core.changePerm(core.coreVars.installedDir);

//Create Storage Directories if they do not exist.
//These should be mounted to a large storage pool
if (!fs.existsSync(core.coreVars.installedDir)){
	core.createDir (core.coreVars.installedDir);
}
if (!fs.existsSync(core.coreVars.dbStoreDir)){
	core.createDir (core.coreVars.dbStoreDir);
}

//Check if app is run in dev or prod mode.
core.incorrectUser(process.env.USER,process.env.HOST,process.env.PORT);

if (process.env.CORRECT_USER) {
	app.listen(process.env.PORT, process.env.HOST, () => {
		console.log(`${emoji.emojify(':heavy_check_mark:.....:100:')}`);
		//Write daemon data as a json object to a file so it can be called later.
		daemon.instanceInfo(process.env.pm_id,process.env.name,process.env.NODE_APP_INSTANCE,process.env.NODE_ENV);
	});
}
