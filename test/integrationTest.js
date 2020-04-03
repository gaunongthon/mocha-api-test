'use strict'
const superagent = require('superagent');
const agent = superagent.agent();
const superagentAbsolute = require('superagent-absolute');
const expect = require('chai').expect;
const addContext = require('mochawesome/addContext');

describe("Integration Test Suite", function() {

	var request;
	// runs before all tests in this block
	before(function() {
			context = this;
			request = superagentAbsolute(agent)(serverUrl);
	 });

	it("Get index page",(done) => {
		request
		.get("/")
		.end((err, response) => {
			 if (err) {
		     return done(err);
		   }
			 expect(response.status).to.equal(200);
		   done();
		});
	});
});
