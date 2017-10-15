var jwt = require('jsonwebtoken');

var params = "";
var uuid = "";
var id = 0;
var newCarIds = [];
var returnedItemIds = [];
var returnedDriverIds = [];
var apiResponse1 = "";
var newly_created_id = "";
var newDriverIds = [];
var pre_defined_drivers = [driver1, driver2, driver3, driver4];
var numberDriver = 4;

var availableDriver1 =
{//23.469185, -102.164204 4.2 kms here_put_ln55 (to in 2.trip-finished-rating.js)
	"lat": 23.469185,
	"lng": -102.164204
}

var availableDriver2 =
{ //23.436323, -102.199687 - 6.7 km driver1_mike (to in 2.trip-finished-rating.js)
	"lat": 23.436323,
	"lng": -102.199687
}

var availableDriver3 =
{//23.521860, -102.102592 27 kms - driver1
	"lat": 23.521860,
	"lng": -102.102592
}

var availableDriver4 = {
	"lat": 23.442968,
	"lng": -102.194907
}
var availableDriverLocations = [
availableDriver1,
availableDriver2,
availableDriver3,
availableDriver4
]
var selfStatusHistoryResources = [];
var apiBeingTested = "";

describe("update drivers", function() {

	it("get drivers details",function(){
			this.timeout(60000)
			var multipleResponses = [];
			for(var id = 0; id < numberDriver; id++) {
				uuid = pre_defined_drivers[id];
				newly_created_id = uuid;
				newDriverIds.push(uuid);
				var params = apiHelper.genTokenDriverCreation_NotAdmin(id, uuid)
				console.log("GET " + endpointMikeqa + "/users/"+uuid)
        multipleResponses.push(chakram.get(endpointMikeqa + "/users/"+uuid, params));
      }
      return chakram.all(multipleResponses).then(function(responses) {
        returnedDriverIds = responses.map(function(response) {
						console.log(response.body)
						dr_id = response.body.id;
						console.log("created driver_id:" + dr_id);
            return response.body.id;
        });
      });
		})

	it("driver PATCH /user/id to update tax_id",function(){
			this.timeout(60000);
			apiHelper.sleep(google_api_wait)
			var multipleResponses = [];
			for(var id = 0; id < numberDriver; id++) {
				var tmp_driver_id = pre_defined_drivers[id];
				var patchJson_tax_id = {
					"tax_id": "" + apiHelper.genRandomNumber()
				};
				params = apiHelper.genTokenDriverCreation_NotAdmin(id, tmp_driver_id);
				var request = endpointMikeqa + "/users/" + tmp_driver_id;
				console.log(patchJson_tax_id)
				console.log("PATCH " + request)
				multipleResponses.push(chakram.patch(request, patchJson_tax_id, params));
				console.log("-----------")
			}
			return chakram.all(multipleResponses).then(function(responses) {
				responses.map(function(response) {
						console.log(response.body)
						console.log("-----------")
				});
			});
		})

	it("POST location",function(){
			this.timeout(60000);
			var patchJson_Location = "";
			var multipleResponses = [];
			for(var id = 0; id < pre_defined_drivers.length; id++) {
				patchJson_Location = availableDriverLocations.pop();
				var uuid = pre_defined_drivers[id]
				params = apiHelper.genTokenDriverCreation_NotAdmin(id, uuid);
				var request = endpointMikeqa + "/users/" + uuid + "/location";
				console.log(patchJson_Location)
				console.log("POST " + request)
				multipleResponses.push(chakram.post(request, patchJson_Location, params));
			}
			return chakram.all(multipleResponses).then(function(responses) {
				responses.map(function(response) {
						console.log("done")
						return "done";
				});
			});
		})

	it("add new cars",function(){
		this.timeout(22000)
		var multipleResponses = [];
		for(var i = 0; i < newDriverIds.length; i++) {
			var tmp_driver_id = newDriverIds[i];
			carJson = apiHelper.buildCarJson(i);
			var req = endpointMikeqa + "/users/"+tmp_driver_id+"/cars";
			console.log("POST " + req)
			multipleResponses.push(chakram.post(req, carJson, params));
		}
		return chakram.all(multipleResponses).then(function(responses) {
			newCarIds = responses.map(function(response) {
					//console.log(response.body)
					car_id = response.body.id;
					console.log("Added car_id:" + car_id);
					return car_id;
			});
		});
	})

	it("admin post car' status to verified",function(){
		this.timeout(22000)
		apiHelper.sleep(google_api_wait)
		params = apiHelper.genTokenAdmin(id, admin_user)
		var multipleResponses = [];
		var carPostJson = {
			"status": 'verified',
		}
		for(var i = 0; i < newDriverIds.length; i++) {
			var tmp_driver_id = newDriverIds[i];
			var tmp_car_id = newCarIds[i];
			var req = endpointMikeqa + "/users/"+tmp_driver_id+"/cars/"+tmp_car_id+"/car-status-history";
			console.log("post " + req)
			multipleResponses.push(chakram.post(req, carPostJson, params));
		}
		return chakram.all(multipleResponses).then(function(responses) {
			responses.map(function(response) {
					console.log(response.body)
					console.log("post status for car_id:" + car_id);
			});
		});
	})

	it("driver PATCH car_active_id",function(){
			this.timeout(60000);
			apiHelper.sleep(google_api_wait)
			var multipleResponses = [];
			for(var id = 0; id < newDriverIds.length; id++) {
				var tmp_driver_id = newDriverIds[id];
				var tmp_car_id = newCarIds[id];
				var patchJson_car_active_id = {
				"active_car_id": tmp_car_id
				};
				params = apiHelper.genTokenDriverCreation_NotAdmin(id, tmp_driver_id);
				var request = endpointMikeqa + "/users/" + tmp_driver_id;
				console.log(patchJson_car_active_id)
				console.log("PATCH " + request)
				multipleResponses.push(chakram.patch(request, patchJson_car_active_id, params));
			}
			return chakram.all(multipleResponses).then(function(responses) {
				responses.map(function(response) {
						console.log(response.body)
				});
			});
		})

	it("get drivers' details",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			var multipleResponses = [];
			for(var id = 0; id < numberDriver; id++) {
				uuid = pre_defined_drivers[id];
				newly_created_id = uuid;
				newDriverIds.push(uuid);
				var admin_params = apiHelper.genTokenAdmin(id, admin_user)
				console.log("GET " + endpointMikeqa + "/users/"+uuid)
				multipleResponses.push(chakram.get(endpointMikeqa + "/users/"+uuid, admin_params));
			}
			return chakram.all(multipleResponses).then(function(responses) {
				returnedDriverIds = responses.map(function(response) {
						console.log(response.body)
						dr_id = response.body.id;
						console.log("created driver_id:" + dr_id);
						return response.body.id;
				});
			});
		})

	it("admin update status for all new drivers",function(){
		this.timeout(60000);
		var multipleResponses = [];
		console.log("update status for all new drivers")
		console.log("newDriverIds.length: " + newDriverIds.length)
		for(var id = 0; id < pre_defined_drivers.length; id++) {
			var uuid = pre_defined_drivers[id]
			var sh_PostJson = {
				"reason": {
					"code": "admin_sh_code",
					"message": "admin_updated_manually"
				},
				"status": "available",
				"user_id": uuid
			}
			var admin_params = apiHelper.genTokenAdmin(id, admin_user)
			//params = apiHelper.genTokenDriverCreation_NotAdmin(id, uuid);
			//var request = awsEndpoint + selfStatusHistoryResources.pop();
			var request = endpointMikeqa + "/users/"+uuid+"/user-status-history"
			console.log("POST " + request)
			multipleResponses.push(chakram.post(request, sh_PostJson, admin_params));
		}
		return chakram.all(multipleResponses).then(function(responses) {
			responses.map(function(response) {
					console.log(response.body)
					return "done";
			});
		});
	})
});
