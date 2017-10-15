var jwt = require('jsonwebtoken');
var AWS = require("aws-sdk");
var passenger_id = psg3;
var apiResponse = "";
var fav_userid = 44;
var params = apiHelper.genTokenUserCreation_NotAdmin(fav_userid, passenger_id);


describe("POST_users_{user_id}_favourites_filter", function() {

	it("should return fav locations not further than 30 kms",function(){
		this.timeout(10000);
		var multipleResponses = [];
		for (i = 0; i < testLocations.length ; i++) {
		    var locationDetails = testLocations[i].split(',')
				console.log("Get favourite locations when user is at:" + locationDetails[0]);
				var locationJson = {
						"lat": parseFloat(locationDetails[1]),
						"lng": parseFloat(locationDetails[2])
				}
				multipleResponses.push(chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites/filter",locationJson, params));
		}
		return chakram.all(multipleResponses).then(function(responses) {
			var returnedLocations = responses.map(function(response) {
					console.log(response.body)
					return response.body;
			});
			for (i = 0 ; i < returnedLocations.length; i++){
					var returned_locs = returnedLocations[i].map(function(loc){
						//console.log(loc)
           	return loc;
           })
					console.log("      Found:" + returned_locs.length + " favorite locations near "+testLocations[i].split(',')[0])
					for (j = 0; j < returned_locs.length; j++) {
					  		console.log("         > "+returned_locs[j].name+" ("+returned_locs[j].id+")")
								//test location
								var latitude1 = parseFloat(testLocations[i].split(',')[1]);
								var longitude1 = parseFloat(testLocations[i].split(',')[2]);;

								//returned location
								var latitude2 = returned_locs[j].location.lat;
								var longitude2 = returned_locs[j].location.lng;

								var distanceInMeters = Math.round(apiHelper.getDistance(latitude1, longitude1, latitude2, longitude2));
								console.log("           "+distanceInMeters+" meter(s)");

								//Assertion
								expect(distanceInMeters).to.be.below(favourite_list_radius);
					}
					console.log(" ")
					console.log(" ")
			}
		});
	})

	it("should return 2 favorite locations if user is at Fredericton Downtown POST /filter",function(){
			//Fredericton Downtown
			var locationJson = {
					"lat": 45.961910,
					"lng": -66.643229
			}
			console.log(endpointMikeqa + "/users/"+passenger_id+"/favourites/filter");
			apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites/filter", locationJson, params);
			expect(apiResponse).to.have.status(200);
			return apiResponse.then(function(json) {
					var returned_locs = json.body.map(function(loc){
						return loc;
					})
					expect(returned_locs.length).to.equal(2);
			});
	})

});
