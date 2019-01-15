describe("Functional testing GET method", function() {

	// runs before all tests in this block
	before(function() {
		 _context = this

		 //Check if token is available (i.e. user is logged in or not)
		 //Feel free to customise based on endpoint design of authentication
		 if (token == "") {
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

	it("Template 1 - Get all users from a page",function(){
		var req = endpoint + "/users";
		var params = {
						headers:{
							'Authorization': token,
						}
				}

		//apiHelper.log is a customised method to (1) print the String to console and (2) to log that String into the html report.
		apiHelper.log(_context, "\nGET: " + req);
		apiResponse = chakram.get(req, params);
		//Verify apiResponse

		//Assert response code
		expect(apiResponse).to.have.status(200);

		//Assert value of `page` (2)
		expect(apiResponse).to.have.json('page', 1);

		//Assert per_page (3)
		expect(apiResponse).to.have.json('per_page', 3);

		//Assert total total pages
		expect(apiResponse).to.have.json('total_pages', 4);

		//Assert the schema of the response
		//See definition of expectedUserPageSchema at `/data/user_page_schema.js`
 		expect(apiResponse).to.have.schema(expectedUserPageSchema);

		//Verify json.body of the response
		totalUsersPerPage = 3 * 4;
		return apiResponse.then(function(json) {
			apiHelper.log(_context, "\nRESPONSE: \n" + JSON.stringify(json.body));

			//Assert total users (this is the demostrage another way to assert a value - different to assert #2, #3)
			totalUsers = json.body.total;

			//Assert number of returned results per page. Those returned users are stored as a list in json.body.data
			numberOfUsers = json.body.data.length;

			//7. Assert details in the list of returned users
			//I am going to verify the list of returned users should have user.last_name = Weaver
			isWeaverReturned = false;
			json.body.data.map(function(user_details){
						if (user_details.last_name == "Weaver") {
							isWeaverReturned = true;
						}
	    })
			expect(totalUsers).to.equal(totalUsersPerPage);
			expect(numberOfUsers).to.equal(3);
			expect(isWeaverReturned).to.be.true;
		})

		//mocha is designed for testing asynchronous requests. wait() here will do the trick to make sure the request is complete before all the assertions can be proceeded.
		return chakram.wait();
	})

});
