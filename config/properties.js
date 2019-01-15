global.fetch = require('node-fetch')
global.chakram = require('./../lib/chakram.js');
global.uuidV4 = require('uuid/v4');
global.apiHelper = require('./../lib/utils/apiHelper.js');
global.addContext = require('mochawesome/addContext');
global.expect = global.chakram.expect;
global.token = "";
