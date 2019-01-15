describe("Functional testing POST method", function() {

	before(function() {
     // runs before all tests in this block
		 _context = this

		 //Check if token is available (i.e. user is logged in or not)
		 //Feel free to customise based on endpoint design of authentication
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

	it("Template 2 - Post user",function(){
		//set up endpoint
		var req = endpoint + "/users";

		//set up request payload
		var jsonPayload = {
		    "name": "morpheus",
		    "job": "leader"
		}

		//set up headers
		var params = {
						headers:{
							'Authorization': token,
						}
				}

		//apiHelper.log is a customised method to (1) print the String to console and (2) to log that String into the html report.
		apiHelper.log(_context, "\nPOST: " + req);

		//request signing happens here
		apiResponse = chakram.post(req, jsonPayload, params);

		//Verify apiResponse
		//Assert response code
		expect(apiResponse).to.have.status(201);

		//Assert the schema of the response
		//See definition of expectedPostUserSchema at `/data/post_user_schema.js`
 		expect(apiResponse).to.have.schema(expectedPostUserSchema);

		//Verify json.body of the response
		return apiResponse.then(function(json) {
				apiHelper.log(_context, "\nRESPONSE: \n" + JSON.stringify(json.body));
				expect(json.body.name).to.equal("morpheus");
				expect(json.body.job).to.equal("leader");
			})

			//mocha is designed for testing asynchronous requests. wait() here will do the trick to make sure the request is complete before all the assertions can be proceeded.
			return chakram.wait();
		})
});
