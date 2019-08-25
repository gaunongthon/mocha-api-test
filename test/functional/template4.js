describe("Functional testing DELETE method", function() {

	before(function() {
     // runs before all tests in this block
		 _context = this

		 //Check if token is available (i.e. user is logged in or not)
		 //Feel free to customise based on serverUrl design of authentication
			if (token != "QpwL5tke4Pnpja7X") {
				//login
				apiResponse = apiHelper.requestToken();
				expect(apiResponse).to.have.status(200);
				return apiResponse.then(function(json) {
				 token = json.body.token;
					});
			}

   });

	it("Template 4 - Delete user",function(){
		//set up serverUrl
		var req = serverUrl + "/users/2";

		//set up request payload
		var jsonPayload = {}

		//set up headers
		var params = {
						headers:{
							'Authorization': token,
						}
				}

		//apiHelper.log is a customised method to (1) print the String to console and (2) to log that String into the html report.
		apiHelper.log(_context, "\nDELETE: " + req);

		//request signing happens here
		apiResponse = chakram.delete(req, jsonPayload, params);

		//Verify apiResponse
		//Assert response code
		expect(apiResponse).to.have.status(204);

		//Verify json.body of the response
		return apiResponse.then(function(json) {
				apiHelper.log(_context, "\nRESPONSE: \n" + JSON.stringify(json.body));
		})
	})
});
