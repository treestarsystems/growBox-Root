const express = require('express');
const fs = require('fs');
const app = express();
const core = require('./gbmodules/gbRootCore.js');
const daemon = require('./service.js');
const emoji = require('node-emoji');
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(bodyParser.json());
app.use(cors());

const root = require('./routes/api/root');
const stem = require('./routes/api/stem');
const branch = require('./routes/api/branch');
const flower = require('./routes/api/flower');
const soil = require('./routes/api/soil');
const petal = require('./routes/api/petal');
const certs = require('./routes/api/certs');

app.use('/api/root', root);
app.use('/api/stem', stem);
app.use('/api/branch', branch);
app.use('/api/flower', flower);
app.use('/api/soil', soil);
app.use('/api/petal', petal);
app.use('/api/certs', certs);

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
