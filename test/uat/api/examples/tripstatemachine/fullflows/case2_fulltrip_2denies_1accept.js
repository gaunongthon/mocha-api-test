var jwt = require('jsonwebtoken');
var id = 199;
var from_id = 0;
var to_id = 6;
var apiResponse = "";
var params = "";
var passenger_id = psg1;
var trip_request_id = trip_id = trip_location_id = "";
var taskToken = "";
var patchJson_Location ={
	"lat": parseFloat(testLocations[2].split(',')[1]),
	"lng": parseFloat(testLocations[2].split(',')[2])
	}
var driver_user_id = "";
var driver_arrived_uri = "";
var start_trip_uri = "";
var finish_trip_uri = "";
var trip_summary = "";
var trip_requests = "";

var tripLocations = [
	'23.512124, -102.114239',
	'23.484887, -102.146155',
	'23.463009, -102.171527',
	'23.434635, -102.204455',
	'23.415045, -102.224482'
];

//trip_id = "a91cbfa9-c880-454a-b91a-695dbc75e5c5";
//driver_user_id = "62b22c22-1add-4aee-97d1-f55e6cb6996a";
//passenger_id = "689bb602-6f60-41ad-849a-2cac33193eeb";

describe("ES integration: Trip full flow case 2", function() {

	it("admin update status for all new drivers",function(){
		this.timeout(60000);
		var pre_defined_drivers = [driver1, driver2, driver3, driver4]
		var multipleResponses = [];
		console.log("update status for all new drivers")
		console.log("pre_defined_drivers.length: " + pre_defined_drivers.length)
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

	it("POST a new trip",function(){
		tripJson = {
			"from_location": {//23.460960, -102.173607//23.494852, -102.134248
				"lat": 23.494852,
				"lng": -102.134248
			},
			"to_location": {//23.414973, -102.224081
				"lat": 23.414973,
				"lng": -102.224081
			},
			"passenger_user_id": passenger_id,
			"driver_user_id": null,
			"status": "new",
			"invoice_required": false
		}
		trip_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id);
		console.log(endpointMikeqa + "/users/"+passenger_id+"/trips")
		apiResponse = chakram.post(endpointMikeqa + "/users/"+passenger_id+"/trips", tripJson, trip_params);
		apiResponse.then(function(json) {
				console.log(json.body)
				trip_id = json.body.id;
		})

		//in case of passenger has no tax_id
		//expect(apiResponse).to.have.json('code','error.trip.cannot_require_invoice.no_tax_id_specified');
		//expect(apiResponse).to.have.json('message','Bad request error');
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET driver_user_id and trip_request_id by passenger",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id);
			var request = endpointMikeqa + "/users/"+passenger_id+"/trips/" + trip_id +"/trip-requests";
			console.log(request)
			apiResponse = chakram.get(request, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
					driver_user_id = json.body.objects[0].driver_user_id;
					trip_request_id = json.body.objects[0].id;
			})
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("Respond: denied",function(){
			this.timeout(60000)
			params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id)
			//var admin_params = apiHelper.genTokenAdmin(id, admin_user)
			var postJson = {
					"response": "denied"
			}
			var request = endpointMikeqa + "/users/"+driver_user_id+"/trips/" + trip_id +"/trip-requests/" + trip_request_id + "/actions/respond";
			console.log("request:" + request)
			console.log(postJson)
			//apiResponse = chakram.post(request, postJson, admin_params);
			apiResponse = chakram.post(request, postJson, params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("passenger gets driver's details",function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id
		console.log("GET: " + req);
		apiResponse = chakram.get(req, passenger_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET 2nd driver_user_id and trip_request_id by passenger",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id);
			var request = endpointMikeqa + "/users/"+passenger_id+"/trips/" + trip_id +"/trip-requests";
			console.log(request)
			apiResponse = chakram.get(request, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
					driver_user_id = json.body.objects[0].driver_user_id;
					trip_request_id = json.body.objects[0].id;
			})
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

		//Then driver denied that trip
		it("Respond: 2nd denied",function(){
				this.timeout(60000)
				params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id)
				//var admin_params = apiHelper.genTokenAdmin(id, admin_user)
				var postJson = {
						"response": "denied"
				}
				var request = endpointMikeqa + "/users/"+driver_user_id+"/trips/" + trip_id +"/trip-requests/" + trip_request_id + "/actions/respond";
				console.log("request:" + request)
				console.log(postJson)
				//apiResponse = chakram.post(request, postJson, admin_params);
				apiResponse = chakram.post(request, postJson, params);
				apiResponse.then(function(json) {
						console.log(json.body)
				})
				expect(apiResponse).to.have.status(200);
				return chakram.wait();
		})

	it("passenger gets driver's details",function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id
		console.log("GET: " + req);
		apiResponse = chakram.get(req, passenger_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET 3nd driver_user_id and trip_request_id by passenger",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id);
			var request = endpointMikeqa + "/users/"+passenger_id+"/trips/" + trip_id +"/trip-requests";
			console.log(request)
			apiResponse = chakram.get(request, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
					driver_user_id = json.body.objects[0].driver_user_id;
					trip_request_id = json.body.objects[0].id;
			})
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

		//Then driver denied that trip
		it("Respond: accepted",function(){
				this.timeout(60000)
				params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id)
				//var admin_params = apiHelper.genTokenAdmin(id, admin_user)
				var postJson = {
						"response": "accepted"
				}
				var request = endpointMikeqa + "/users/"+driver_user_id+"/trips/" + trip_id +"/trip-requests/" + trip_request_id + "/actions/respond";
				console.log("request:" + request)
				console.log(postJson)
				//apiResponse = chakram.post(request, postJson, admin_params);
				apiResponse = chakram.post(request, postJson, params);
				apiResponse.then(function(json) {
						console.log(json.body)
				})
				expect(apiResponse).to.have.status(200);
				return chakram.wait();
		})

	it("passenger gets driver's details",function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id
		console.log("GET: " + req);
		apiResponse = chakram.get(req, passenger_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("passenger gets driver's location",function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id + "/location"
		console.log("GET: " + req);
		apiResponse = chakram.get(req, passenger_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("passenger gets driver's car details",function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id +"/active-car"
		console.log("GET: " + req);
		apiResponse = chakram.get(req, passenger_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("driver gets cars' details",function(){
		var driver_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id +"/active-car"
		console.log("GET: " + req);
		apiResponse = chakram.get(req, driver_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET trip document",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
			console.log(trip_params)
			console.log(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id)
			apiResponse = chakram.get(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})

			//Verify details
			expect(apiResponse).to.have.json('driver_user_id', driver_user_id);
			expect(apiResponse).to.have.json('passenger_user_id', passenger_id);
			expect(apiResponse).to.have.json('id', trip_id);
			expect(apiResponse).to.have.json('status', 'pickup_in_progress');

			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("respond: driver-arrived", function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id)
		var postJson = {
				"response": "accepted"
		}
		var request = endpointMikeqa + "/users/"+driver_user_id+"/trips/" + trip_id +"/actions/driver-arrived";
		console.log("request:" + request)
		console.log(postJson)
		apiResponse = chakram.post(request, postJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("passenger gets driver's details",function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id
		console.log("GET: " + req);
		apiResponse = chakram.get(req, passenger_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET trip document",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
			console.log(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id)
			apiResponse = chakram.get(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
					start_trip_uri = json.body._actions.start_trip;
			})

			//Verify details
			expect(apiResponse).to.have.json('driver_user_id', driver_user_id);
			expect(apiResponse).to.have.json('passenger_user_id', passenger_id);
			expect(apiResponse).to.have.json('id', trip_id);
			expect(apiResponse).to.have.json('status', 'driver_arrived');

			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("respond: start-trip", function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id)
		var postJson = {
				"response": "accepted"
		}
		var request = endpointMikeqa + "/users/"+driver_user_id+"/trips/" + trip_id +"/actions/start-trip";
		console.log("request:" + request)
		console.log(postJson)
		apiResponse = chakram.post(request, postJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("update driver's locations part 1 with patch /user/id/location", function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var params = "";
		var driversLocation = "";
		var multipleResponses = [];
		var returnedItemIds = [];
		for(var i = 0; i < 3; i++) {
			params = apiHelper.genTokenDriverCreation_NotAdmin(i, driver_user_id)
			driversLocation = {
				"lat": parseFloat(tripLocations[i].split(',')[0]),
				"lng": parseFloat(tripLocations[i].split(',')[1])
				}
			var request = endpointMikeqa + "/users/" + driver_user_id + "/location";
			console.log("POST: " + request)
			console.log(driversLocation)
			multipleResponses.push(chakram.post(request, driversLocation, params));
			apiHelper.sleep(3000)
		}
		return chakram.all(multipleResponses).then(function(responses) {
			returnedItemIds = responses.map(function(response) {
					//console.log(response.body)
					return response.body.id;
					apiHelper.sleep(3000)
			});
		});
		})

		it("update driver's locations part 2 with put /user/id/location", function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			var params = "";
			var driversLocation = "";
			var multipleResponses = [];
			var returnedItemIds = [];
			for(var i = 3; i < tripLocations.length; i++) {
				params = apiHelper.genTokenDriverCreation_NotAdmin(i, driver_user_id)
				driversLocation = {
					"lat": parseFloat(tripLocations[i].split(',')[0]),
					"lng": parseFloat(tripLocations[i].split(',')[1])
					}
				var request = endpointMikeqa + "/users/" + driver_user_id + "/location";
				console.log("post: " + request)
				console.log(driversLocation)
				multipleResponses.push(chakram.post(request, driversLocation, params));
			}
			return chakram.all(multipleResponses).then(function(responses) {
				returnedItemIds = responses.map(function(response) {
						return response.body.id;
				});
			});
			})

		it("passenger gets driver's details",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
			var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id
			console.log("GET: " + req);
			apiResponse = chakram.get(req, passenger_params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
		})

	it("GET trip document",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
			console.log(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id)
			apiResponse = chakram.get(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})

			//Verify details
			expect(apiResponse).to.have.json('driver_user_id', driver_user_id);
			expect(apiResponse).to.have.json('passenger_user_id', passenger_id);
			expect(apiResponse).to.have.json('id', trip_id);
			expect(apiResponse).to.have.json('status', 'trip_in_progress');
			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("respond: finish-trip", function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id)
		var postJson = {
				"response": "accepted"
		}
		var request = endpointMikeqa + "/users/"+driver_user_id+"/trips/" + trip_id +"/actions/finish-trip";
		console.log("request:" + request)
		console.log(postJson)
		apiResponse = chakram.post(request, postJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("passenger gets driver's details",function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id
		console.log("GET: " + req);
		apiResponse = chakram.get(req, passenger_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET trip document",function(){
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
			console.log(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id)
			apiResponse = chakram.get(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})

			//Verify details
			expect(apiResponse).to.have.json('driver_user_id', driver_user_id);
			expect(apiResponse).to.have.json('passenger_user_id', passenger_id);
			expect(apiResponse).to.have.json('id', trip_id);
			expect(apiResponse).to.have.json('status', 'finished');
			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("GET trip_summary",function(){
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
			var request = endpointMikeqa + "/trips/"+trip_id+"/trip-summary"
			console.log("GET " + request)
			apiResponse = chakram.get(request, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("passenger gets driver's details",function(){
		this.timeout(60000)
		apiHelper.sleep(google_api_wait)
		var passenger_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id)
		var req = endpointMikeqa + "/trips/"+trip_id + "/users/"+ driver_user_id
		console.log("GET: " + req);
		apiResponse = chakram.get(req, passenger_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

});
