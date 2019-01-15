describe("Functional testing PUT method", function() {

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

	it("Template 3 - Put user",function(){
		//set up endpoint
		var req = endpoint + "/users/2";

		//set up request payload
		var jsonPayload = {
		    "name": "morpheus rodriguez",
		    "job": "acting leader"
		}

		//set up headers
		var params = {
						headers:{
							'Authorization': token,
						}
				}

		//apiHelper.log is a customised method to (1) print the String to console and (2) to log that String into the html report.
		apiHelper.log(_context, "\nPUT: " + req);

		//request signing happens here
		apiResponse = chakram.put(req, jsonPayload, params);

		//Verify apiResponse
		//Assert response code
		expect(apiResponse).to.have.status(200);

		//Assert the schema of the response
		//See definition of expectedPutUserSchema at `/data/put_user_schema.js`
 		expect(apiResponse).to.have.schema(expectedPutUserSchema);

		//Verify json.body of the response
		return apiResponse.then(function(json) {
				apiHelper.log(_context, "\nRESPONSE: \n" + JSON.stringify(json.body));
				expect(json.body.name).to.equal("morpheus rodriguez");
				expect(json.body.job).to.equal("acting leader");
		})

			//mocha is designed for testing asynchronous requests. wait() here will do the trick to make sure the request is complete before all the assertions can be proceeded.
		return chakram.wait();
	})

	//This is just for demo. In real work, we would need to verify user's details to make sure all the updated information were updated
	it("Template 3 - Get user",function(){
		//set up endpoint
		var req = endpoint + "/users/2";

		//set up headers
		var params = {
						headers:{
							'Authorization': token,
						}
				}

		//apiHelper.log is a customised method to (1) print the String to console and (2) to log that String into the html report.
		apiHelper.log(_context, "\nGET: " + req);

		//request signing happens here
		apiResponse = chakram.get(req, params);

		//Verify apiResponse
		//Assert response code
		expect(apiResponse).to.have.status(200);
		expect(apiResponse).to.have.json('data.id', 2);
		expect(apiResponse).to.have.json('data.first_name', "Janet");
		expect(apiResponse).to.have.json('data.last_name', "Weaver");
		expect(apiResponse).to.have.json('data.avatar', "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg");

		//Assert the schema of the response
		//See definition of expectedGetUserSchema at `/data/get_user_schema.js`
 		expect(apiResponse).to.have.schema(expectedGetUserSchema);

		//Verify json.body of the response
		return apiResponse.then(function(json) {
				apiHelper.log(_context, "\nRESPONSE: \n" + JSON.stringify(json.body));
		})

			//mocha is designed for testing asynchronous requests. wait() here will do the trick to make sure the request is complete before all the assertions can be proceeded.
		return chakram.wait();
	})
});
