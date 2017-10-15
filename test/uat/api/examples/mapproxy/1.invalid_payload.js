var jwt = require('jsonwebtoken');
var AWS = require("aws-sdk");
var apiResponse = "";
var fav_userid = 44;
var params = apiHelper.genTokenUserCreation_NotAdmin(fav_userid, psg1);
var input_string = "123 Main";//"100 Queen";//"440 King";
var fromLatitude = 45.961088;
var fromLongitude = -66.644633;
var locationJson = "";
var custom_limit = 3;

describe("POST_map-proxy_places_autocomplete_invalid_json", function() {

	it("case1: should not be able to post /autocomplete with less than 5 chars of input_string",function(){
			locationJson = {
					"input_string": "29 a",
					"location":{
						"lat": fromLatitude,
						"lng": fromLongitude
					}
			}
			console.log(locationJson)
			console.log(endpointMikeqa + "/map-proxy/places/autocomplete")
			apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete", locationJson, params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.status(422);
			expect(apiResponse).to.have.json('messages.input_string[0]','Input must be at least 5 characters long');
			return chakram.wait();
		});

	it("case2: should not be able to post /autocomplete without longitude",function(){
		locationJson = {
				"input_string": "29 abbott",
				"location":{
					"lat": fromLatitude
				}
		}
		console.log(locationJson)
		console.log(endpointMikeqa + "/map-proxy/places/autocomplete")
		apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete", locationJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(422);
		expect(apiResponse).to.have.json('messages.location.lng[0]','Missing data for required field.');
		return chakram.wait();
	});

	it("case3: should not be able to post /autocomplete without latitude",function(){
			locationJson = {
					"input_string": "29 abbott",
					"location":{
						"lng": fromLongitude
					}
			}
			console.log(locationJson)
			console.log(endpointMikeqa + "/map-proxy/places/autocomplete")
			apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete", locationJson, params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.status(422);
			expect(apiResponse).to.have.json('messages.location.lat[0]','Missing data for required field.');
			return chakram.wait();
		});

	it("case4: should not be able to post /autocomplete without longitude nor latitude",function(){
			locationJson = {
					"input_string": "29 abbott"
			}
			console.log(locationJson)
			console.log(endpointMikeqa + "/map-proxy/places/autocomplete")
			apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete", locationJson, params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.status(422);
			expect(apiResponse).to.have.json('messages.location.lat[0]','Missing data for required field.');
			expect(apiResponse).to.have.json('messages.location.lng[0]','Missing data for required field.');
			return chakram.wait();
		});
});
