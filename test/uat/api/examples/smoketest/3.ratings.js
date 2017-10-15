var jwt = require('jsonwebtoken');
var AWS = require("aws-sdk");

var apiResponse = "";
var user_id = 11;
var id = 0;
var car_id = "";
var ratingIds = [];
var trip_ratingIds = [];
var user_ratingIds = [];
var requestBeingTested = "";
var rating_categories = ["overall", "car_condition", "politeness", "cleanliness", "accuracy"];

var passenger_id = psg3;
var params = apiHelper.genTokenUserCreation_NotAdmin(user_id, passenger_id);
var trip_id = "";
var driver_user_id = "";
var driver_arrived_uri = "";
var start_trip_uri = "";
var finish_trip_uri = "";
var trip_summary = "";
var trip_request_id = "";

var tripLocations = [
	'23.475175, -102.157170',
	'23.467749, -102.165980',
	'23.469665, -102.163664',
	'23.466024, -102.168057',
	'23.463268, -102.171201',
	'23.461117, -102.173794'
];

describe("3. trip-finished-both parties do ratings", function() {

	it("admin update status for all new drivers",function(){
		this.timeout(60000);
		var pre_defined_drivers = [driver1, driver2, driver3, driver4]
		var multipleResponses = [];
		console.log("update status for all new drivers")
		console.log("newDriverIds.length: " + pre_defined_drivers.length)
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

	it("Get an estimate",function(){
		estimateJson = {
			"to_location": {//23.414973, -102.224081
				"lat": 23.414973,
				"lng": -102.224081
			},
		 "from_location": {//23.460960, -102.173607//23.494852, -102.134248
			 "lat": 23.494852,
			 "lng": -102.134248
		 },
		 "user_id": passenger_id
	 }
	 var admin_params = apiHelper.genTokenAdmin(id, admin_user)
	 //var trip_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id);
	 console.log(endpointMikeqa + "/estimate")
	 apiResponse = chakram.post(endpointMikeqa + "/estimate", estimateJson, admin_params);
	 apiResponse.then(function(json) {
			 console.log(json.body)
	 })
	 expect(apiResponse).to.have.status(200);
	 return chakram.wait();
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
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET driver_user_id and trip_request_id by passenger",function(){
			this.timeout(60000)
			apiHelper.sleep(7000)
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

	it("GET trip document",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait*2)
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

	it("GET trip document",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait*2)
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

	it("GET trip document",function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait*2)
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
			expect(apiResponse).to.have.json('status', 'trip_in_progress');

			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("update driver's locations part 1 with post /user/id/location", function(){
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
			console.log("post: " + request)
			console.log(driversLocation)
			multipleResponses.push(chakram.post(request, driversLocation, params));
			apiHelper.sleep(3000)
		}
		return chakram.all(multipleResponses).then(function(responses) {
			returnedItemIds = responses.map(function(response) {
					return response.body.id;
			});
		});
		})

	it("update driver's locations part 2 with post /user/id/location", function(){
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

	it("GET trip document",function(){
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
			console.log(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id)
			apiResponse = chakram.get(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id, trip_params);
			apiResponse.then(function(json) {
					console.log(json.body)
					finish_trip_uri = json.body._actions.finish_trip;
					trip_summary = json.body._links.trip_summary;
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

	it("Driver GET trip document with projection",function(){
			apiHelper.sleep(google_api_wait)
			trip_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
			console.log(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id+"?projection=trip_summary")
			apiResponse = chakram.get(endpointMikeqa + "/users/"+driver_user_id+"/trips/"+trip_id+"?projection=trip_summary", trip_params);
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

	//Got driver for that trip
	it("passenger_user_id rates driver",function(){
		this.timeout(22000)
		requestBeingTested = endpointMikeqa + "/ratings";
		var multipleResponses = [];
		for(var i = 0; i < 4; i++) {
				var ratingJson =
				{
					 "trip_id":	trip_id,
					 "rating_user_id": passenger_id,
					 "rated_user_id":	driver_user_id,
					 "rating":	1+i,
					 "category":rating_categories[i],
					 "comment":	"Comment_"+i
				}
				console.log("POST " + ratingJson)
				console.log("POST " + requestBeingTested)
				params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id);
				multipleResponses.push(chakram.post(requestBeingTested, ratingJson, params));
		}
		return chakram.all(multipleResponses).then(function(responses) {
			responses.map(function(response) {
					console.log(response.body)
					var ratingid = response.body.id;
					ratingIds.push(ratingid)
			});
		});
	})

	//Got driver for that trip
	it("driver rates passenger",function(){
		this.timeout(22000)
		requestBeingTested = endpointMikeqa + "/ratings";
		var multipleResponses = [];
		for(var i = 0; i < 1; i++) {
				var ratingJson =
				{
					 "trip_id":	trip_id,
					 "rating_user_id": driver_user_id,
					 "rated_user_id":	passenger_id,
					 "rating":	3,
					 "category":rating_categories[3],
					 "comment":	"Comment_"+i
				}
				console.log("POST " + ratingJson)
				console.log("POST " + requestBeingTested)
				params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
				multipleResponses.push(chakram.post(requestBeingTested, ratingJson, params));
		}
		return chakram.all(multipleResponses).then(function(responses) {
			responses.map(function(response) {
					console.log(response.body)
					var ratingid = response.body.id;
					ratingIds.push(ratingid)
			});
		});
	})

	it("driver_user_id gets stats",function(){
		trip_params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
		var req = endpointMikeqa + "/users/"+driver_user_id+"/_actions/statistics?start_date=2017-01-01T15:00:49&end_date=2017-12-31T15:00:49";
		console.log("GET: " + req)
		apiResponse = chakram.get(req, trip_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("passenger_id gets stats",function(){
		trip_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id);
		var req = endpointMikeqa + "/users/"+passenger_id+"/_actions/statistics?start_date=2017-01-01T15:00:49&end_date=2017-12-31T15:00:49";
		console.log("GET: " + req)
		apiResponse = chakram.get(req, trip_params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

});
