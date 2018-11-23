var endpointBeingTested = reqres

describe("reqres.in test", function() {

	it("case 1",function(){
		var req = endpointBeingTested + "/api/users?page=2";
		apiHelper.print(this, "\nGET: " + req);
		apiResponse = chakram.get(req);
		_t = this
		return apiResponse.then(function(json) {
		    console.log(json.body);
				expect(apiResponse).to.have.status(200);
			})
		})
});
