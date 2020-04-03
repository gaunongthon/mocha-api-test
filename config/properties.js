'use strict';

global.chakram = require('chakram');
global.expect = global.chakram.expect;
global.addContext = require('mochawesome/addContext');
global.apiHelper = require('./../test/helper/apiHelper.js');
global.token = "";
const TEST_ENV = ((process.env.ENV) ? process.env.ENV : "local")
require(`../env/${TEST_ENV}.js`);
console.log(`Running tests on ${TEST_ENV} environment`);
