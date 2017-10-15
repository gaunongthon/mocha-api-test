var jwt = require('jsonwebtoken');
var AWS = require("aws-sdk");
var apiResponse = "";
var passenger_id = psg3;
var fav_userid = 44;
var Walmart_id = Oromocto_id = "";
var params = apiHelper.genTokenUserCreation_NotAdmin(fav_userid, passenger_id);
var locationPatchJson = {
	"name": "Walmart Uptown Supermarket, NB, Canada",
	"location": {
	}
}

var locationPutJson = {
	"name": "Oromocto Landscape, NB, Canada",
	"location": {
	}
}

describe("POST_users_{user_id}_favourites", function() {

	it("should add a new fav locations",function(){
		locationJson = apiHelper.buildLocationJson(0)
		apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites", locationJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
    })
		expect(apiResponse).to.have.json('name',inputLocations[0].split(',')[0]);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("should add a new fav locations",function(){
		locationJson = apiHelper.buildLocationJson(1)
		apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites", locationJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
    })
		expect(apiResponse).to.have.json('name',inputLocations[1].split(',')[0]);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("should add a new fav locations",function(){
		locationJson = apiHelper.buildLocationJson(2)
		apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites", locationJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
    })
		expect(apiResponse).to.have.json('name',inputLocations[2].split(',')[0]);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("should add a new fav locations",function(){
		locationJson = apiHelper.buildLocationJson(3)
		apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites", locationJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
    })
		expect(apiResponse).to.have.json('name',inputLocations[3].split(',')[0]);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("should add a new fav locations - for delete",function(){
		locationJson = {
			"name": inputLocation_for_update_and_delete_test[0].split(',')[0],
			"location": {
				"lat": parseFloat(inputLocation_for_update_and_delete_test[0].split(',')[1]),
				"lng": parseFloat(inputLocation_for_update_and_delete_test[0].split(',')[2])
			}
		}
		apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites", locationJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
    })
		expect(apiResponse).to.have.json('name',inputLocation_for_update_and_delete_test[0].split(',')[0]);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("should add a new fav locations - for update",function(){
		locationJson = {
			"name": inputLocation_for_update_and_delete_test[1].split(',')[0],
			"location": {
				"lat": parseFloat(inputLocation_for_update_and_delete_test[1].split(',')[1]),
				"lng": parseFloat(inputLocation_for_update_and_delete_test[1].split(',')[2])
			}
		}
		apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites", locationJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
    })
		expect(apiResponse).to.have.json('name',inputLocation_for_update_and_delete_test[1].split(',')[0]);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("should not add a new fav locations as their distance to previous added not further than 100m",function(){
			this.timeout(10000);
			apiHelper.sleep(google_api_wait)
			locationJson = apiHelper.buildTooCloseLocationJson(0)
			apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites", locationJson, params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.json('message','Location too close to another favourite, no new favourite saved');
			expect(apiResponse).to.have.status(400);
			return chakram.wait();
	})

	it("should not add a new fav locations as their distance to previous added not further than 100m",function(){
			this.timeout(10000);
			apiHelper.sleep(google_api_wait)
			locationJson = apiHelper.buildTooCloseLocationJson(1)
			apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/favourites", locationJson, params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.json('message','Location too close to another favourite, no new favourite saved');
			expect(apiResponse).to.have.status(400);
			return chakram.wait();
	})
});
