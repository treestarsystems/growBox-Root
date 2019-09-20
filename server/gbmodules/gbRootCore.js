const mongodb = require('mongodb');
const os = require('os');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const emoji = require('node-emoji');
var gbSystem = require('../../system_confs/system_vars.json');

//Variables and Constants
var coreVars = {
	"systemUser": '../../system_confs/system_vars.json',
	"systemConfsDir": path.join(__dirname, '../../system_confs'),
	"projectName": "growBox-Root",
	"installedDir": path.join(__dirname, '../..'),
	"dbStoreDir": path.join(__dirname, '../../db_storage'),
	"logStoreDir": path.join(__dirname, '../../log_storage'),
	"dbServer": "localhost",
	"dbName": "gbRoot",
	"dbRootDataCollection": "rootData",
	"dbStemDataCollection": "stemData",
	"dbBranchDataCollection": "branchData",
	"dbFlowerDataCollection": "flowerData",
	"dbSoilDataCollection": "soilData",
	"dbPetalDataCollection": "petalData",
	"dbSensorDataCollection": "sensorData",
	"dbCertsDataCollection": "certsData",
}

//Selfsigned certificate attributes
coreVars.certAttrs = [
	{name: 'commonName', value: `${gbSystem.systemId}.${gbSystem.systemDomain}`},
	{name: 'organizationName', value: 'TreeStarSystems'},
	{name: 'organizationalUnitName', value: 'growBox Project'}
];

//coreVars.instanceId = path.join(__dirname, `../../log_storage/pid/${coreVars.projectName}_Instance.id`);
coreVars.instanceId = `../../log_storage/pid/${coreVars.projectName}_Instance.id`;
coreVars.userInfo = getUserInfo();

//Functions
//Get numeric id for the gb user from system_confs/system_user.json file.
function getUserInfo() {
	uid = parseInt(childProcess.execSync(`id -u ${gbSystem.username}`).toString().replace(/\n$/, ''));
	gid = parseInt(childProcess.execSync(`id -g ${gbSystem.username}`).toString().replace(/\n$/, ''));
        return {"uid": uid,"gid": gid,"userName": gbSystem.username};
}

//Generate a random alphanumeric string
function genRegular(x) {
        var regularchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";

        for (var i = 0; i < x; i++)
                text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
        return text;
}

//Generate a random alphanumeric string with special characters
function genSpecial(x) {
	var specialchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%_-(),;:.*"
	var text = "";

	for (var i = 0; i < x; i++)
		text += specialchar.charAt(Math.floor(Math.random() * specialchar.length));
	return text;
}

//Generate a random number within defined range
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//Connection to MongoDB
async function loadCollection(server,dbName,collectionName) {
  const client = await mongodb.MongoClient.connect(
    'mongodb://' + server,
    {
      useNewUrlParser: true
    }
  );
  return client.db(dbName).collection(collectionName);
}

function changePerm (path) {
        fs.chown(path,coreVars.userInfo.uid,coreVars.userInfo.gid, (err) => {
		if(err) throw err;
	});
        fs.chmod(path, 0o770, (err) => {
		if(err) throw err;
	});
}

function createDir (path) {
        fs.mkdir(path, (err) => {
		if(err) throw err;
	});
	changePerm (path);
        console.log(`Dir Created: ${path}`);
}

//Used to check if the app is started as the correct user (www-data) due to permissions requirements.
function incorrectUser (user,host,port) {
	if (process.env.USER != coreVars.userInfo.userName) {
		console.log(`\nCurrent User: ${emoji.emojify(`:x::scream: ${user} :scream::x:`)}`);
		console.log(`This process must be ran as the ${coreVars.userInfo.userName} user or else permission errors will impede functionality.\n`);
		process.exit(0);
	} else {
		var startMessage = console.log(`\nServer started by ${user} on ${host}:${port} in ${process.env.NODE_ENV} mode`);
		//Sets a new process environment variable that the app will use to run the start script.
		process.env['CORRECT_USER'] = true;
	}
}

module.exports = {
	genRegular,
	genSpecial,
	getRandomNumber,
	loadCollection,
	createDir,
	changePerm,
	incorrectUser,
	coreVars
}
