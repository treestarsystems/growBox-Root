#!/usr/bin/env node

/*
Purpose: Collects information about the running process to make it easier to stop,
	 delete, and restart.
ToDo:    Make this all async....man fuck all dat
*/

const fs = require('fs');
const fsSync = require('fs');
const path = require('path');
const core = require(path.join(__dirname, 'gbmodules/gbRootModules.js'));
const childProcess = require('child_process');
var argv = require('minimist')(process.argv.slice(2));

function instanceInfo (id,name,instance,environment) {
	var info = {};
	info.id = id;
	info.name = name;
	info.pid = fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_id-${id}.pid`).toString();
	info.instance = instance;
	info.environment = environment;

	let data = JSON.stringify(info, null, 2);
	fs.writeFile(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`, data, (err) => {
		if (err) throw err;
	});
}

var instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);

if (argv.k) {
	childProcess.execSync(`pm2 stop ${instanceId.id}`);
}
if (argv.s) {
	childProcess.execSync(`pm2 status ${instanceId.id}`);
}
if (argv.d) {
	childProcess.execSync(`pm2 delete ${instanceId.id}`);
}
if (argv.r) {
	childProcess.execSync(`pm2 restart ${instanceId.id}`);
}

module.exports = {
	instanceInfo,
}
