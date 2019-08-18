'use strict'
const superagent = require('superagent');
const superagentAbsolute = require('superagent-absolute');
const agent = superagent.agent();
const expect = require('chai').expect;
const addContext = require('mochawesome/addContext');

describe("Smoke Test Suite", function() {

	var request;
	// runs before all tests in this block
	before(function() {
			context = this;
			request = superagentAbsolute(agent)(endpoint);
	 });

	it("Get all users from a page",(done) => {
		request
		.get("/users?page=2")
		.end((err, response) => {
			 if (err) {
		     return done(err);
		   }
			 expect(response.status).to.equal(200);
			 addContext(context, {
				 title: "response.body",
				 value: response.body
			 });
			 const totalPages = response.body.total_pages;
			 expect(totalPages).to.equal(4);
		   done();
		});
	});
});
