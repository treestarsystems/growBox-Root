#!/usr/bin/env node

/*
Purpose: Collects information about the running process to make it easier to stop,
	 delete, and restart.
ToDo:    Make this all async.
*/

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const core = require(path.join(__dirname, 'gbmodules/gbRootModules.js'));
const childProcess = require('child_process');
var argv = require('minimist')(process.argv.slice(2));

async function readFile (file) {
	const contents = await fs.readFile(file);
	return contents.toString();
}

async function instanceInfo (id,name,instance,environment) {
	var info = {};
	info.id = id;
	info.name = name;
	//This is not working as an async function call.
//	info.pid = await readFile(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_id-${id}.pid`);
	info.pid = fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_id-${id}.pid`).toString();
	//I believe this is the same as the id but I will keep it since it is another env variable.
	info.instance = instance;
	info.environment = environment;

	let data = JSON.stringify(info, null, 2);

	fsSync.writeFile(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}Kill.json`, data, (err) => {
		if (err) throw err;
	});
}

if (argv.k) {
	let contents = JSON.parse(fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}Kill.json`));
	childProcess.execSync(`pm2 stop ${contents.id}`);
}
if (argv.s) {
	let contents = JSON.parse(fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}Kill.json`));
	childProcess.execSync(`pm2 status ${contents.id}`);
}
if (argv.d) {
	let contents = JSON.parse(fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}Kill.json`));
	childProcess.execSync(`pm2 delete ${contents.id}`);
}
if (argv.r) {
	let contents = JSON.parse(fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}Kill.json`));
	childProcess.execSync(`pm2 restart ${contents.id}`);
}

module.exports = {
	instanceInfo,
}
