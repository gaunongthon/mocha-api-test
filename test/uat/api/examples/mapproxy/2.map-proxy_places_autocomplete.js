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
var additional_time_to_sleep = 0;

describe("POST_map-proxy_places_autocomplete", function() {

	it("CASE 1: should be able to post /autocomplete with limit over 5",function(){
		input_string = "George St";
		fromLatitude = 45.961088;
		fromLongitude = -66.644633;
		custom_limit = 19;

		locationJson = {
				"input_string": input_string,
				"location":{
					"lat": fromLatitude,
					"lng": fromLongitude
				}
		}
		console.log(locationJson)
		console.log(endpointMikeqa + "/map-proxy/places/autocomplete?size="+custom_limit)
		apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete?size="+custom_limit, locationJson, params);
		apiResponse.then(function(json) {
				console.log(json.body)
    })
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("verify returned places",function(){
			this.timeout(40000)
			return apiResponse.then(function(json) {
					var returned_places = json.body.map(function(place){
						console.log(place)
						return place;
					})
					console.log("      Found:" + returned_places.length + " places")

					//Verify autocomplete_result_limit
					expect(returned_places.length).to.be.below(autocomplete_result_limit);

					//Verify results
					var word_from_input_string = input_string.toLowerCase().split(' ');
					var found = false;
					var round = 1;
					for (var i = 0; i < returned_places.length; i++) {
						found = false;
						for (var j = 0; j < word_from_input_string.length; j++){
							if (returned_places[i].description.toLowerCase().includes(word_from_input_string[j])){
								found = true;
								break;
							}
						}
						if (!found) console.log(returned_places[i].description.toLowerCase());
						expect(found).to.equal(true);
					}

					//Calling GoogleGeoAPIs
					var placeDetailResponses = [];
					for (var i = 0; i < returned_places.length; i++) {
						var placeid = returned_places[i].place_id;
						console.log("===============================")
						var resource = google_geoapis +"?place_id="+placeid+"&key="+google_api_key
						console.log("Calling GoogleGeoAPIs:" + resource)
						var placeDetailResponse = chakram.get(resource);
						apiHelper.sleep(google_api_wait)
						placeDetailResponses.push(placeDetailResponse);
					}

					//Analyzing results from GoogleGeoAPIs to verify favourite.radius
					console.log("===============================")
					console.log("Benchmark autocomplete.radius:" + autocomplete_radius + " meter(s)")
					var latitude1 = fromLatitude;
					var longitude1 = fromLongitude;
					return chakram.all(placeDetailResponses).then(function(responses) {
						var googleResponses = responses.map(function(response) {
								return response.body;
						});
						for (i = 0 ; i < googleResponses.length; i++){
								var loc = googleResponses[i].results[0].geometry.location;
								var formatted_address = googleResponses[i].results[0].formatted_address;
								//returned location
								var latitude2 = parseFloat(loc.lat);
								var longitude2 = parseFloat(loc.lng);
								console.log("===============================")
								console.log("Verifying formatted_address:" + formatted_address)
								console.log("Receive place_id.lat:" + latitude2)
								console.log("Verifying place_id.lng:" + longitude2)
								//Assertion
								var distanceInMeters = Math.round(apiHelper.getDistance(latitude1, longitude1, latitude2, longitude2));
								console.log("Distance to searched point:" + distanceInMeters + " meter(s)")
								expect(distanceInMeters).to.be.below(autocomplete_radius);
						}
					})
			});
	})

	it("CASE 2: should be able to post /autocomplete with limit <= 5",function(){
		input_string = "100 York";
		fromLatitude = 45.961088;
		fromLongitude = -66.644633;
		custom_limit = 3;
		locationJson = {
				"input_string": input_string,
				"location":{
					"lat": fromLatitude,
					"lng": fromLongitude
				}
		}
		console.log(locationJson)
		console.log(endpointMikeqa + "/map-proxy/places/autocomplete?size="+custom_limit)
		apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete?size="+custom_limit, locationJson, params);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
		})

	it("verify returned places",function(){
			this.timeout(40000)
			return apiResponse.then(function(json) {
					var returned_places = json.body.map(function(place){
						console.log(place)
						return place;
					})
					console.log("      Found:" + returned_places.length + " places")

					//Verify autocomplete_result_limit
					expect(returned_places.length).to.be.below(custom_limit+1);

					//Verify results
					var word_from_input_string = input_string.toLowerCase().split(' ');
					var found = false;
					var round = 1;
					for (var i = 0; i < returned_places.length; i++) {
						found = false;
						for (var j = 0; j < word_from_input_string.length; j++){
							if (returned_places[i].description.toLowerCase().includes(word_from_input_string[j])){
								found = true;
								break;
							}
						}
						if (!found) console.log(returned_places[i].description.toLowerCase());
						expect(found).to.equal(true);
					}

					//Calling GoogleGeoAPIs
					var placeDetailResponses = [];
					for (var i = 0; i < returned_places.length; i++) {
						var placeid = returned_places[i].place_id;
						console.log("===============================")
						var resource = google_geoapis +"?place_id="+placeid+"&key="+google_api_key
						console.log("Calling GoogleGeoAPIs:" + resource)
						var placeDetailResponse = chakram.get(resource);
						apiHelper.sleep(google_api_wait+additional_time_to_sleep)
						placeDetailResponses.push(placeDetailResponse);
					}

					//Analyzing results from GoogleGeoAPIs to verify favourite.radius
					console.log("===============================")
					console.log("autocomplete.radius:" + autocomplete_radius + " meter(s)")
					var latitude1 = fromLatitude;
					var longitude1 = fromLongitude;
					return chakram.all(placeDetailResponses).then(function(responses) {
						var googleResponses = responses.map(function(response) {
								return response.body;
						});
						for (i = 0 ; i < googleResponses.length; i++){
								var loc = googleResponses[i].results[0].geometry.location;
								var formatted_address = googleResponses[i].results[0].formatted_address;
								//returned location
								var latitude2 = parseFloat(loc.lat);
								var longitude2 = parseFloat(loc.lng);
								console.log("===============================")
								console.log("Verifying formatted_address:" + formatted_address)
								console.log("Receive place_id.lat:" + latitude2)
								console.log("Verifying place_id.lng:" + longitude2)
								//Assertion
								var distanceInMeters = Math.round(apiHelper.getDistance(latitude1, longitude1, latitude2, longitude2));
								console.log("Distance to searched point:" + distanceInMeters + " meter(s)")
								expect(distanceInMeters).to.be.below(autocomplete_radius);
						}
					})
			});
	})

	it("CASE 3: should be able to post /autocomplete",function(){
		input_string = "100 King";
		fromLatitude = 45.961088;
		fromLongitude = -66.644633;
		locationJson = {
				"input_string": input_string,
				"location":{
					"lat": fromLatitude,
					"lng": fromLongitude
				}
		}
		console.log(locationJson)
		console.log(endpointMikeqa + "/map-proxy/places/autocomplete")
		apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete", locationJson, params);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("verify returned places",function(){
		this.timeout(100000)
			return apiResponse.then(function(json) {
          var returned_places = json.body.map(function(place){
						console.log(place)
          	return place;
          })
					console.log("      Found:" + returned_places.length + " places")

					//Verify autocomplete_result_limit
					expect(returned_places.length).to.be.below(autocomplete_result_limit);

					//Verify results
					var word_from_input_string = input_string.toLowerCase().split(' ');
					var found = false;
					var round = 1;
					for (var i = 0; i < returned_places.length; i++) {
						found = false;
						for (var j = 0; j < word_from_input_string.length; j++){
							if (returned_places[i].description.toLowerCase().includes(word_from_input_string[j])){
								found = true;
								break;
							}
						}
						if (!found) console.log(returned_places[i].description.toLowerCase());
						expect(found).to.equal(true);
					}

					//Calling GoogleGeoAPIs
					var placeDetailResponses = [];
					for (var i = 0; i < returned_places.length; i++) {
						var placeid = returned_places[i].place_id;
						console.log("===============================")
						var resource = google_geoapis +"?place_id="+placeid+"&key="+google_api_key
						console.log("Calling GoogleGeoAPIs:" + resource)
						var placeDetailResponse = chakram.get(resource);
						apiHelper.sleep(google_api_wait+additional_time_to_sleep)
						placeDetailResponses.push(placeDetailResponse);
					}

					//Analyzing results from GoogleGeoAPIs to verify favourite.radius
					console.log("===============================")
					console.log("autocomplete.radius:" + autocomplete_radius + " meter(s)")
					var latitude1 = fromLatitude;
					var longitude1 = fromLongitude;
					return chakram.all(placeDetailResponses).then(function(responses) {
						var googleResponses = responses.map(function(response) {
								return response.body;
						});
						for (i = 0 ; i < googleResponses.length; i++){
								var loc = googleResponses[i].results[0].geometry.location;
								var formatted_address = googleResponses[i].results[0].formatted_address;
								//returned location
								var latitude2 = parseFloat(loc.lat);
								var longitude2 = parseFloat(loc.lng);
								console.log("===============================")
								console.log("Verifying formatted_address:" + formatted_address)
								console.log("Receive place_id.lat:" + latitude2)
								console.log("Verifying place_id.lng:" + longitude2)
								//Assertion
								var distanceInMeters = Math.round(apiHelper.getDistance(latitude1, longitude1, latitude2, longitude2));
								console.log("Distance to searched point:" + distanceInMeters + " meter(s)")
								expect(distanceInMeters).to.be.below(autocomplete_radius);
						}
					})
      });
	})

	it("CASE 4: should be able to post /autocomplete",function(){
		input_string = "Aberdeen";
		fromLatitude = 45.959447;
		fromLongitude = -66.636844;
		locationJson = {
				"input_string": input_string,
				"location":{
					"lat": fromLatitude,
					"lng": fromLongitude
				}
		}
		console.log(locationJson)
		console.log(endpointMikeqa + "/map-proxy/places/autocomplete")
		apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete", locationJson, params);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
	})

	it("verify returned places",function(){
		this.timeout(100000)
			return apiResponse.then(function(json) {
          var returned_places = json.body.map(function(place){
						console.log(place)
          	return place;
          })
					console.log("      Found:" + returned_places.length + " places")

					//Verify autocomplete_result_limit
					expect(returned_places.length).to.be.below(autocomplete_result_limit);

					//Verify results
					var word_from_input_string = input_string.toLowerCase().split(' ');
					var found = false;
					var round = 1;
					for (var i = 0; i < returned_places.length; i++) {
						found = false;
						for (var j = 0; j < word_from_input_string.length; j++){
							if (returned_places[i].description.toLowerCase().includes(word_from_input_string[j])){
								found = true;
								break;
							}
						}
						if (!found) console.log(returned_places[i].description.toLowerCase());
						expect(found).to.equal(true);
					}

				//Calling GoogleGeoAPIs
				var placeDetailResponses = [];
				for (var i = 0; i < returned_places.length; i++) {
					var placeid = returned_places[i].place_id;
					console.log("===============================")
					var resource = google_geoapis +"?place_id="+placeid+"&key="+google_api_key
					console.log("Calling GoogleGeoAPIs:" + resource)
					var placeDetailResponse = chakram.get(resource);
					apiHelper.sleep(google_api_wait)
					placeDetailResponses.push(placeDetailResponse);
				}

				//Analyzing results from GoogleGeoAPIs to verify favourite.radius
				console.log("===============================")
				console.log("autocomplete.radius:" + autocomplete_radius + " meter(s)")
				var latitude1 = fromLatitude;
				var longitude1 = fromLongitude;
				return chakram.all(placeDetailResponses).then(function(responses) {
					var googleResponses = responses.map(function(response) {
							return response.body;
					});
					for (i = 0 ; i < googleResponses.length; i++){
							var loc = googleResponses[i].results[0].geometry.location;
							var formatted_address = googleResponses[i].results[0].formatted_address;
							//returned location
							var latitude2 = parseFloat(loc.lat);
							var longitude2 = parseFloat(loc.lng);
							console.log("===============================")
							console.log("Verifying formatted_address:" + formatted_address)
							console.log("Receive place_id.lat:" + latitude2)
							console.log("Verifying place_id.lng:" + longitude2)
							//Assertion
							var distanceInMeters = Math.round(apiHelper.getDistance(latitude1, longitude1, latitude2, longitude2));
							console.log("Distance to searched point:" + distanceInMeters + " meter(s)")
							expect(distanceInMeters).to.be.below(autocomplete_radius);
					}
				})
      });
	})

	it("CASE 5: should be able to post /autocomplete",function(){
		input_string = "440 King";
		fromLatitude = 45.961088;
		fromLongitude = -66.644633;
		locationJson = {
				"input_string": input_string,
				"location":{
					"lat": fromLatitude,
					"lng": fromLongitude
				}
		}
		console.log(locationJson)
		console.log(endpointMikeqa + "/map-proxy/places/autocomplete")
		apiResponse = chakram.post(endpointMikeqa + "/map-proxy/places/autocomplete", locationJson, params);
		expect(apiResponse).to.have.status(200);
		return chakram.wait();
		})

	it("verify returned places",function(){
		this.timeout(100000)
			return apiResponse.then(function(json) {
          var returned_places = json.body.map(function(place){
						console.log(place)
          	return place;
          })
					console.log("      Found:" + returned_places.length + " places")

					//Verify autocomplete_result_limit
					expect(returned_places.length).to.be.below(autocomplete_result_limit);

					//Verify description's results
					var word_from_input_string = input_string.toLowerCase().split(' ');
					var found = false;
					var round = 1;
					for (var i = 0; i < returned_places.length; i++) {
						found = false;
						for (var j = 0; j < word_from_input_string.length; j++){
							if (returned_places[i].description.toLowerCase().includes(word_from_input_string[j])){
								found = true;
								break;
							}
						}
						if (!found) console.log(returned_places[i].description.toLowerCase());
						expect(found).to.equal(true);
					}

					//Calling GoogleGeoAPIs
					var placeDetailResponses = [];
					for (var i = 0; i < returned_places.length; i++) {
						var placeid = returned_places[i].place_id;
						console.log("===============================")
						var resource = google_geoapis +"?place_id="+placeid+"&key="+google_api_key
						console.log("Calling GoogleGeoAPIs:" + resource)
						var placeDetailResponse = chakram.get(resource);
						apiHelper.sleep(google_api_wait)
						placeDetailResponses.push(placeDetailResponse);
					}

					//Analyzing results from GoogleGeoAPIs to verify favourite.radius
					console.log("===============================")
					console.log("autocomplete.radius:" + autocomplete_radius + " meter(s)")
					var latitude1 = fromLatitude;
					var longitude1 = fromLongitude;
					return chakram.all(placeDetailResponses).then(function(responses) {
						var googleResponses = responses.map(function(response) {
								return response.body;
						});
						for (i = 0 ; i < googleResponses.length; i++){
								var loc = googleResponses[i].results[0].geometry.location;
								var formatted_address = googleResponses[i].results[0].formatted_address;
								//returned location
								var latitude2 = parseFloat(loc.lat);
								var longitude2 = parseFloat(loc.lng);
								console.log("===============================")
								console.log("Verifying formatted_address:" + formatted_address)
								console.log("Receive place_id.lat:" + latitude2)
								console.log("Verifying place_id.lng:" + longitude2)
								//Assertion
								var distanceInMeters = Math.round(apiHelper.getDistance(latitude1, longitude1, latitude2, longitude2));
								console.log("Distance to searched point:" + distanceInMeters + " meter(s)")
								expect(distanceInMeters).to.be.below(autocomplete_radius);
						}
					})
      });
	})

});
