describe("Functional testing GET method", function() {

	// runs before all tests in this block
	before(function() {
		 _context = this

		 //Check if token is available (i.e. user is logged in or not)
		 //Feel free to customise based on serverUrl design of authentication
		 if (token == "") {
 			//login
	 			return apiHelper.requestToken()
	 			.then(function(apiResponse) {
		 			expect(apiResponse).to.have.status(200);
					token = apiResponse.body.token;
 				});
 			}
   });

	it("Template 1 - Get all users from a page",function(){
		var req = serverUrl + "/users";
		var params = {
						headers:{
							'Authorization': token,
						}
				}

		//apiHelper.log is a customised method to (1) print the String to console and (2) to log that String into the html report.
		apiHelper.log(_context, "\nGET: " + req);
		return chakram.get(req, params)
		.then(function(apiResponse) {
			apiHelper.log(_context, "\nRESPONSE: \n" + JSON.stringify(apiResponse.body));
			//Assert response code
			expect(apiResponse).to.have.status(200);
			//Assert value of `page` (2)
			expect(apiResponse).to.have.json('page', 1);
			//Assert per_page (3)
			expect(apiResponse).to.have.json('per_page', 6);
			//Assert total total pages
			expect(apiResponse).to.have.json('total_pages', 2);
			//Assert the schema of the response
			//See definition of expectedUserPageSchema at `/data/user_page_schema.js`
	 		expect(apiResponse).to.have.schema(expectedUserPageSchema);
		});
	});
});
