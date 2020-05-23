const express = require('express');
const router = express.Router();
const core = require('../../../gbmodules/gbRootCore.js');
var gbSystem = require(`${core.coreVars.systemConfsDir}/system_vars.json`);

module.exports = router;
