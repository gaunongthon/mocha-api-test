var jwt = require('jsonwebtoken');
var AWS = require("aws-sdk");
var apiResponse = "";
var fav_userid = 44;
var Walmart_id = Oromocto_id = "";
var passenger_id = psg3;
var params = apiHelper.genTokenUserCreation_NotAdmin(fav_userid, passenger_id);
// var locationPatchJson = {
// 		"name": "Walmart Uptown Supermarket, NB, Canada",
// 		"location":{
// 			"lat": 45.934019,
// 			"lng": -66.664138
// 		}
// }
//
var locationPutJson = {
		"name": "Oromocto Landscape, NB, Canada",
		"location":{
			"lat": 45.858237,
			"lng": -66.481083
		}
}

var locationPatchJson = {
		"name": "Walmart Uptown Supermarket, NB, Canada"
}


describe("GET_PATCH_PUT_DELETE_users_{user_id}_favourites_{favourite_id}", function() {

	it("should be able to call to get all fav locations",function(){
			console.log(endpointMikeqa + "/users/"+passenger_id+"/favourites")
			apiResponse = chakram.get(endpointMikeqa + "/users/"+passenger_id+"/favourites", params);
			apiResponse.then(function(json) {
			 		console.log(json.body)
	    })
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
		})

	it("should return Walmart and Oromocto",function(){
			return apiResponse.then(function(json) {
          var returned_locs = json.body.objects.map(function(loc){
						console.log(loc);
          	return loc;
          })
					//Get ids of Walmart and Oromocto for other tests
					var found = 0;
					for (i = 0; i < returned_locs.length; i++) {
					    if (returned_locs[i].name.includes("Walmart")) {
									Walmart_id = returned_locs[i].id;
									found++;
					    } else if (returned_locs[i].name.includes("Oromocto")) {
									Oromocto_id = returned_locs[i].id;
									found++;
					    }
					}
					expect(found).to.equal(2);
      });
	})

	it("should allow to update location of Walmart via PATCH",function(){
			var req = endpointMikeqa + "/users/"+passenger_id+"/favourites/"+Walmart_id;
			console.log(req)
			apiResponse = chakram.patch(req, locationPatchJson, params);
			apiResponse.then(function(json) {
			 		console.log(json.body)
	    })
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("should return updated Walmart via GET",function(){
			apiHelper.sleep(google_api_wait)
			var req = endpointMikeqa + "/users/"+passenger_id+"/favourites/"+Walmart_id;
			console.log(req)
			apiResponse = chakram.get(req, params);
			apiResponse.then(function(json) {
			 		console.log(json.body)
	    })
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("should allow to update location of Oromocto via PUT",function(){
			apiHelper.sleep(google_api_wait)
			var req = endpointMikeqa + "/users/"+passenger_id+"/favourites/"+Oromocto_id;
			console.log(req)
			apiResponse = chakram.put(req, locationPutJson, params);
			apiResponse.then(function(json) {
			 		console.log(json.body)
	    })
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("should return updated Oromocto via GET",function(){
			apiHelper.sleep(google_api_wait)
			apiResponse = chakram.get(endpointMikeqa + "/users/"+passenger_id+"/favourites/"+Oromocto_id, params);
			expect(apiResponse).to.have.json('name', locationPutJson["name"]);
			expect(apiResponse).to.have.json('id', Oromocto_id);
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("should allow to delete location of Oromocto via DELETE",function(){
			locationDelJson = {}
			apiResponse = chakram.delete(endpointMikeqa + "/users/"+passenger_id+"/favourites/"+Oromocto_id, locationDelJson, params);
			expect(apiResponse).to.have.status(204);
			return chakram.wait();
	})

	it("should not return Oromocto via GET",function(){
			apiHelper.sleep(google_api_wait)
			apiResponse = chakram.get(endpointMikeqa + "/users/"+passenger_id+"/favourites/"+Oromocto_id, params);
			expect(apiResponse).to.have.json('code', ResourceNotFound_ErrorCode);
			expect(apiResponse).to.have.json('message', ResourceNotFound_Message);
			expect(apiResponse).to.have.status(404);
			return chakram.wait();
	})

});
