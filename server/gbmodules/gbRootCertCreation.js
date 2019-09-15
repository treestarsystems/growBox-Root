#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
var argv = require('minimist')(process.argv.slice(2));
const core = require('./gbRootCore.js');
var gbSystem = require('../../system_confs/system_vars.json');
//This is a lightly modified version of the selfsigned project.
//Source: https://github.com/jfromaniello/selfsigned
var selfsigned = require('./selfsigned.js');
var attrs = [
	{name: 'commonName', value: `${gbSystem.systemId}.${gbSystem.systemDomain}`},
	{name: 'organizationName', value: 'TreeStarSystems'},
	{name: 'organizationalUnitName', value: 'growBox Project'}
];

function generateRootCert() {
	selfsigned.generate(attrs, function (err, pems) {
			if (err) throw err;

			if (!fs.existsSync(`${core.coreVars.systemConfsDir}/certs`)){
				core.createDir (`${core.coreVars.systemConfsDir}/certs`);
			}

			certObject = {"private": pems.private, "public": pems.public, "cert": pems.cert};
			console.log (certObject.cert);

			fs.writeFile(`${core.coreVars.systemConfsDir}/certs/gbRootCert.json`, JSON.stringify(certObject), (err) => {
				if (err) throw err;
			});
	});
}

function generateClientCert(clientId) {
	fs.access(`${core.coreVars.systemConfsDir}/certs/gbRootCert.json`, error => {
		if (!error) {
			var gbRootCert = require(`${core.coreVars.systemConfsDir}/certs/gbRootCert.json`);
			var pems = selfsigned.generate(attrs, {
				clientCertificate: true,
				clientCertificateCN: `${clientId}.${gbSystem.systemDomain}`,
				keyPair: {
					//Require the key file data that is generated by the root cert creation
					publicKey: gbRootCert.public,
					privateKey: gbRootCert.private
				}
			 });

			certObject = {"clientprivate": pems.clientprivate, "clientpublic": pems.clientpublic, "clientcert": pems.clientcert};
			console.log (certObject.clientcert);
			return certObject;
		} else {
			console.log("growBox-Root CA does not exist. Please create a growBox-Root CA first");
			return {"status": "growBox-Root CA does not exist. Please create a growBox-Root CA first"};
		}
	});
}

if (argv.r) {
	console.log('Generating Root Certificate\n');
	generateRootCert();
}

if (argv.c) {
	console.log('Generating Client Certificate\n');
	if (argv.c[0]) {
		generateClientCert(argv.c);
	} else {
		generateClientCert(`gbdevice-${core.genRegular(5).toLowerCase()}`);
	}
}
