const mongodb = require('mongodb');
i = 0;
var deviceArray = ['stem-', 'branch-'];
var pickDevice = deviceArray[Math.floor(Math.random() * deviceArray.length)];
var sensorTypeArray = ['temperature', 'humidity', 'moisture', 'waterlevel', 'gas', 'airpressure', 'rain', 'motion', 'waterflow'];
var pickType = sensorTypeArray[Math.floor(Math.random() * sensorTypeArray.length)];
/*
function loadCollection() {
	mongodb.MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function (err, client) {
		var db = client.db('gbRoot');
		db.collection('sensorData').insertOne(sensorDataInput);
	});
}
*/
function genRegular(x) {
 var regularchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 var text = "";

 for (var i = 0; i < x; i++)
  text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
  return text;
}

function getRandomNumber(min, max) {
 return Math.round(Math.random() * (max - min) + min);
}

//mongodb.MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true})
function addSensorData (dbName,colName,dbOperation,data) {
 mongodb.MongoClient.connect("mongodb://localhost:27017/dbName", {useNewUrlParser: true}, (err, client) => {
  // Client returned
  var db = client.db(dbName);
/*
    db.collection(colName).dbOperation(
	data
	{
		deviceId : pickDevice + genRegular(10),
  		containerId : "container-" + genRegular(10),
		readingType : pickType,
		readingRaw : getRandomNumber(-32, 3700),
		timeStamp : Date.now()
    	}
*/
  , function (findErr, result) {
   client.close();
  });
 });
}

//This genrates and inserts the random data
//Increase to 10,000 when using a more powerful machine to see if it works. Dies on VM.
while (i < 1000) {
 mongodb.MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client)).db();
 i++;
}

