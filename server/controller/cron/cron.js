const core = require('../../gbmodules/gbRootCore.js');

//Define Job
/*
async function unfinishedPortsImport () {
 var options = {
  "type": 'network',
  "listPorts": 'y',
  "filter": 'y',
  "callback": function (data) {
   writeToDB(data,'unfinishedPorts','daily');
  }
 }
 console.log('CRON Job Start: unfinishedPortsImport');
 await observium.fetchDevicesType(options);

 async function writeToDB (obj,type,period) {
  let report = obj;
  report['type'] = type;
  report['period'] = period;
  report['timeStamp'] = Date.now();
  report['pollUUID'] = core.genRegular(30);
  const q = await core.loadCollection(core.coreVars.dbReportsCollection);
  //Replaces previous record if it exists. I only need one instance of this document in the collection.
  q.replaceOne({type: 'unfinishedPorts'}, report, {upsert: true});
//  q.insertOne(report);
  console.log('CRON Job Finish: unfinishedPortsImport');
 }
}
*/

//Test
//unfinishedPortsImport();

module.exports = {
// unfinishedPortsImport
}
