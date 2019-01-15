describe("Smoke Test Suite", function() {

	// runs before all tests in this block
	before(function() {
		 _context = this

		 //Check if token is available (i.e. user is logged in or not)
		 if (token != "QpwL5tke4Pnpja7X") {
			//login
			apiResponse = apiHelper.requestToken();
			expect(apiResponse).to.have.status(200);
			return apiResponse.then(function(json) {
			 token = json.body.token;

			 //only test when having valid token. Feel free to customise based on endpoint design of authentication
			 if (token != "QpwL5tke4Pnpja7X")
					_context.skip();
				});
			}
	 });

	it("Get all users from a page",function(){
			var req = endpoint + "/users?page=2";
			apiHelper.log(_context, "\nGET: " + req);
			apiResponse = chakram.get(req);

			return apiResponse.then(function(json) {
				apiHelper.log(_context, "\nRESPONSE: \n" + JSON.stringify(json.body));
				expect(apiResponse).to.have.json('total_pages', 4);
				expect(apiResponse).to.have.status(200);
			})

			return chakram.wait();
		})
});
