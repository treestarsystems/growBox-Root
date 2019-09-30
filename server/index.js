const express = require('express');
const fs = require('fs');
const app = express();
const core = require('./gbmodules/gbRootCore.js');
const daemon = require('./service.js');
const emoji = require('node-emoji');
const bodyParser = require('body-parser');
const cors = require('cors');
const childProcess = require('child_process');

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

//Create required directories and change permissions if they do not exist.
//These should be mounted to a large storage pool
if (!fs.existsSync(core.coreVars.installedDir)){
	core.createDir (core.coreVars.installedDir);
}
if (!fs.existsSync(core.coreVars.dbStoreDir)){
	core.createDir (core.coreVars.dbStoreDir);
}

//Made this a function to make the start block below a bit cleaner.
function startApp () {
	app.listen(process.env.PORT, process.env.HOST, () => {
		console.log(`${emoji.emojify(':heavy_check_mark:.....:100:')}`);
		//Write daemon data as a json object to a file so it can be called later.
		daemon.instanceInfo(process.env.pm_id,process.env.name,process.env.NODE_APP_INSTANCE,process.env.NODE_ENV);
	});
}

//Check if app is runing as correct user then execute.
core.incorrectUser(process.env.USER,process.env.HOST,process.env.PORT);
if (process.env.CORRECT_USER) {
	//Check if MongoDB is running.
	childProcess.exec('ps -C mongod -o pid=', (error, stdout, stderr) => {
        	if (error) {
                	console.error(`MongoDB is not running. I will start it...`);
			//If MongoDB is not running attempt to start it.
	                childProcess.exec(`mongod -f ${core.coreVars.systemConfsDir}/mongod.conf`, (error, stdout, stderr) => {
        	                if (error) {
					//If it can not run show error and stop.
                	                console.error(`MongoDB could not start: ${error}`);
                        	        return;
	                        }
				//Start has completed.
        	                console.log(`MongoDB start complete: ${stdout.replace(/\n$/, '')}`);
	                });
	        }
		//MongoDB is running.
        	console.log(`MongoDB is running: ${stdout.replace(/\n$/, '')}`);
		//Start app.
		startApp();
	});
}

process.on('SIGINT', () => {
//	console.log('Shutting down MongoDB...');
	childProcess.exec(`mongod -f ${core.coreVars.systemConfsDir}/mongod.conf --shutdown`, (error, stdout, stderr) => {
		if (error) {
			console.error(`MongoDB error: ${error}`);
		}
		console.log('Shutting down MongoDB...');
		process.exit(error ? 1 : 0);
	});
});
