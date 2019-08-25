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
				});
			}
	 });

	it("Get all users from a page",function(){
			var req = serverUrl + "/users?page=2";
			apiHelper.log(_context, "\nGET: " + req);
			apiResponse = chakram.get(req);

			return apiResponse.then(function(json) {
				expect(apiResponse).to.have.status(200);
				apiHelper.log(_context, "\nRESPONSE: \n" + JSON.stringify(json.body));
				expect(json).to.have.json('total_pages', 2);
			})
		})
});
