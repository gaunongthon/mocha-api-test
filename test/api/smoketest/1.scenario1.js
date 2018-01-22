var jwt = require('jsonwebtoken');

var params = "";

describe("Google Geocode", function() {

	it("case 1",function(){
		var endpointBeingTested = google_places
		var types = "food";
		var location ="-33.8670,151.1957";
		var name = "cruise";
		var radius = "500";
		var key = google_api_key;
		var queries = "&location=" + location
									+ "&types=" + types
									+ "&name=" + name
									+ "&radius=" + radius
									+ "&key=" + key;
		var req = endpointBeingTested + "?" + queries;
		apiHelper.print(this, "\nGET: " + req);
		apiResponse = chakram.get(req, params);
		_t = this
		return apiResponse.then(function(json) {
				_counter = json.body.results.length;
				apiHelper.print(_t, "Result counter: " + _counter);
		 		expect(_counter).to.equal(7);
				expect(apiResponse).to.have.status(200);
			})
		})
});
