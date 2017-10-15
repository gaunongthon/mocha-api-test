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
var trip_claims = "";

var claim_id = "";
var claim_token = "";

var drivingToPickUp = [
"point 0, 19.447623, -99.083640",//more than 1,000 m to From_location: 19.436884, -99.086317
"point 1,19.440975, -99.085250",
"point 2,19.440064, -99.085518",
"point 3,19.438415, -99.086044", // 175 meters to From_location: 19.436884, -99.086317
"point 4,19.437504, -99.086226"];

var tripLocations = [
	"point 1,19.436260, -99.086473",
	"point 2,19.435268, -99.087009",
	"point 3,19.433639, -99.088511",
	"point 4,19.431939, -99.089498",
	"point 5,19.430047, -99.090549",
	"point 6,19.428509, -99.091418",
	"point 7,19.426759, -99.092427",
	"point 8,19.423469, -99.094257",
	"point 9,19.420697, -99.095834",
	"point 10,19.416206, -99.098187",
	"point 11,19.413089, -99.097779",
	"point 12,19.409294, -99.097017",
	"point 13,19.407048, -99.097103"];


describe("ES integration claimstatemachine case 1: accepted", function() {

	it("admin update status for all new drivers",function(){
		this.timeout(60000);
		var pre_defined_drivers = [driver1, driver2, driver3]
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
			"to_location": {
				"lat": 23.414973,
				"lng": -102.224081
			},
		 "from_location": {
			 "lat": 23.494852,
			 "lng": -102.134248
		 },
		 "user_id": passenger_id
	 }
	 var admin_params = apiHelper.genTokenAdmin(id, admin_user)
	 var psg_params = apiHelper.genTokenUserCreation_NotAdmin(id, passenger_id);
	 console.log(endpointMikeqa + "/estimate")
	 apiResponse = chakram.post(endpointMikeqa + "/estimate", estimateJson, psg_params);
	 apiResponse.then(function(json) {
			 console.log(json.body)
	 })
	 expect(apiResponse).to.have.status(200);
	 return chakram.wait();
	})

	it("POST a new trip",function(){
		tripJson = {
			"from_location": {
				"lat": 23.494852,
				"lng": -102.134248
			},
			"to_location": {
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
			var postJson = {
					"response": "accepted"
			}
			var request = endpointMikeqa + "/users/"+driver_user_id+"/trips/" + trip_id +"/trip-requests/" + trip_request_id + "/actions/respond";
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
			this.timeout(20000)
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

	it("moving driver close to pick-up location /user/id/location", function(){
			this.timeout(60000)
			apiHelper.sleep(google_api_wait)
			var params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id)
			driversLocation = {
				"lat": 23.494852,
				"lng": -102.134248
				}
			var request = endpointMikeqa + "/users/" + driver_user_id + "/location";
			console.log("post: " + request)
			console.log(driversLocation)
			apiResponse = chakram.post(request, driversLocation, params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
		})

	it("GET trip document",function(){
			this.timeout(20000)
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
			expect(apiResponse).to.have.json('status', 'driver_arrived');

			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("GET trip document",function(){
			this.timeout(20000)
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

			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("Get drivers' profile", function(){
		params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
		apiResponse1 = chakram.get(endpointMikeqa + "/users/"+driver_user_id, params);
		apiResponse1.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse1).to.have.status(200);
		return chakram.wait();
	})

	//driver can POST a claim while trip.status = pick_up_in_progress
	it("should be able to POST a claim as 'reason.other' anytime",function(){
		this.timeout(20000)
		apiHelper.sleep(google_api_wait)

		var request = endpointMikeqa + "/claims";
		params = apiHelper.genTokenDriverCreation_NotAdmin(id, driver_user_id);
		claimJson = apiHelper.buildDriverClaimJson_Flat_tires(driver_user_id, trip_id);

		console.log(request)
		console.log(claimJson)
		apiResponse = chakram.post(request, claimJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
				claim_id = json.body.id;
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("Get all claim-status-history by admin",function(){
		this.timeout(22000)
		apiHelper.sleep(google_api_wait)
		var req = endpointMikeqa + "/claims/"+claim_id+"/claim-status-history"
		console.log("GET: " + req);
		var params = apiHelper.genTokenAdmin(id, admin_user)
		apiResponse = chakram.get(req, params);
		apiResponse.then(function(json) {
				console.log(json.body)
				console.log("Received: " + json.body.objects.length)
				json.body.objects.map(function(claim_history_item){
					console.log(claim_history_item)
				})
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET a claim by admin",function(){
		this.timeout(20000)
		apiHelper.sleep(google_api_wait)
		params = apiHelper.genTokenAdmin(id, admin_user)
		var req = endpointMikeqa + "/claims/" + claim_id;
		console.log("GET " +  req)
		apiResponse = chakram.get(req, params);
		apiResponse.then(function(json) {
				console.log(json.body)
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("Admin PATCH to accept",function(){
			this.timeout(20000)
			apiHelper.sleep(google_api_wait)
			params = apiHelper.genTokenAdmin(id, admin_user)
			var req = endpointMikeqa + "/claims/" + claim_id + "/claim-status-history";
			var patchJson = {
				"status": "accepted",
				"reason":{
						"code": "confirmed",
						"message": "thanks"
					}
				}

			console.log("POST: " + req)
			console.log(patchJson)
			apiResponse = chakram.post(req, patchJson, params);
			apiResponse.then(function(json) {
					console.log(json.body)
			})
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

	it("Get all claim-status-history by admin",function(){
		this.timeout(22000)
		apiHelper.sleep(google_api_wait)
		var req = endpointMikeqa + "/claims/"+claim_id+"/claim-status-history"
		console.log("GET: " + req);
		var params = apiHelper.genTokenAdmin(id, admin_user)
		apiResponse = chakram.get(req, params);
		apiResponse.then(function(json) {
				console.log(json.body)
				console.log("Received: " + json.body.objects.length)
				json.body.objects.map(function(claim_history_item){
					console.log(claim_history_item)
				})
		})
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("GET trip document",function(){
			this.timeout(20000)
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
			expect(apiResponse).to.have.json('status', 'cancelled');

			//Verify error code
			expect(apiResponse).to.have.status(200);
			return chakram.wait();
	})

});
