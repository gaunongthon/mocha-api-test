var jwt = require('jsonwebtoken');
var AWS = require("aws-sdk");
var passenger_id = psg3;
var apiResponse = "";
var fav_userid = 44;
var params = apiHelper.genTokenUserCreation_NotAdmin(fav_userid, passenger_id);

describe("GET_users_{user_id}_favourites", function() {

	it("should be able to call to get all fav locations",function(){
			apiResponse = chakram.get(endpointMikeqa + "/users/"+passenger_id+"/favourites", params);
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
		})

	it("should return all favourites just added",function(){
			return apiResponse.then(function(json) {
          var returned_locs = json.body.objects.map(function(loc){
          	return loc.name;
          })
					//Verify all locations returned
					for (i = 0; i < inputLocations.length; i++) {
							expect(returned_locs.indexOf(inputLocations[i].split(',')[0])).to.not.equal(-1);
					}
      });
	})

	it("should respond with data matching the expected schema", function () {
		//return expect(apiResponse).to.have.schema(expectedSchema_Locations);
	});
});
