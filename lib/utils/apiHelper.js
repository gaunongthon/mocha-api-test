var jwt = require('jsonwebtoken');

module.exports = {

		sleep: function(delay) {
				var start = new Date().getTime();
				while (new Date().getTime() < start + delay);
		},

		getDistance: function(latitude1, longitude1, latitude2, longitude2) {
			var rad = function(x) {
				return x * Math.PI / 180;
			};
			var R = 6378137; // Earth’s mean radius in meter
			var dLat = rad(latitude2 - latitude1);
			var dLong = rad(longitude2 - longitude1);
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(rad(latitude1)) * Math.cos(rad(latitude2)) *
				Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;
			return d; // returns the distance in meter
		},

		buildTooCloseLocationJson: function(id){
			var locationJson = {
				"name": inputLocations_Too_Close[id].split(',')[0],
				"location": {
					"lat": parseFloat(inputLocations_Too_Close[id].split(',')[1]),
					"lng": parseFloat(inputLocations_Too_Close[id].split(',')[2])
				}
			}
			return locationJson;
		},

		genRandomString: function(){
			return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		},

		genRandomLat: function(){
			var minLat = 65.923423;
			var maxLat = 75.234234;
			return (Math.random() * (maxLat - minLat) + minLat).toFixed(6)
		},

		genRandomNumber: function(){
			var minLong = 40.0324324;
			maxLong = 50.1234232;
			return ((Math.random() * (maxLong - minLong) + minLong).toFixed(6))*10000000
		},

		genRandomClabeNumber: function(){
			return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 18);
		},

		genRandomLong: function(){
			var minLong = -40.032432423200;
			maxLong = -50.123423220;
			return (Math.random() * (maxLong - minLong) + minLong).toFixed(6)
		},

    buildLocationJson: function(id){
      var locationJson = {
				"name": inputLocations[id].split(',')[0],
				"location": {
					"lat": parseFloat(inputLocations[id].split(',')[1]),
					"lng": parseFloat(inputLocations[id].split(',')[2])
				}
			}
      return locationJson;
    },

		buildPassengerClaimJson: function(user_id,trip_id){
			var claimJson = {
					  "user_id": user_id,
					  "trip_id": trip_id,
						"reason_id": "claim.reason.passenger.pre_trip_in_progress.no_longer_need",
				    "reason_description": "fast driver - by_passenger"
				  }
      return claimJson;
    },

		buildPassengerClaimJson_no_longer_need: function(user_id,trip_id){
			var claimJson = {
					  "user_id": user_id,
					  "trip_id": trip_id,
						"reason_id": "claim.reason.passenger.pre_trip_in_progress.no_longer_need",
				    "reason_description": "fast driver - by_passenger"
				  }
      return claimJson;
    },

		buildPassengerClaimJson_too_long: function(user_id,trip_id){
			var claimJson = {
					  "user_id": user_id,
					  "trip_id": trip_id,
						"reason_id": "claim.reason.passenger.pre_trip_in_progress.taking_too_long",
				    "reason_description": "can't wait"
				  }
      return claimJson;
    },

		buildPassengerClaimJson_item_lost: function(user_id,trip_id){
			var claimJson = {
					"user_id": user_id,
					"trip_id": trip_id,
					"reason_id": "claim.reason.passenger.post_finished.item_lost",
					"reason_description": "was speeding"
			  }
      return claimJson;
    },

		buildDriverClaimJson: function(user_id,trip_id){
			var claimJson = {
				  "user_id": user_id,
				  "trip_id": trip_id,
					"reason_id": "passenger_no_show"
			  }
      return claimJson;
    },

		buildDriverClaimJson_driver_passenger_no_show: function(user_id,trip_id){
			var claimJson = {
				  "user_id": user_id,
				  "trip_id": trip_id,
					"reason_id": "claim.reason.driver.pickup_in_progress.passenger_no_show"
			  }
      return claimJson;
    },

		buildDriverClaimJson_Flat_tires: function(user_id,trip_id){
			var claimJson = {
				  "user_id": user_id,
				  "trip_id": trip_id,
					"reason_id": "claim.reason.driver.other",
				  "reason_description": "got tires blown"
			  }
      return claimJson;
    },

		buildDriverClaimJson_no_cash_payment: function(user_id,trip_id){
			var claimJson = {
				  "user_id": user_id,
				  "trip_id": trip_id,
					"reason_id": "passenger_no_show",
				  "reason_description": "customer refused to pay cash"
			  }
      return claimJson;
    },
		buildDriverClaimJson_passenger_forgot_item: function(user_id,trip_id){
			var claimJson = {
				  "user_id": user_id,
				  "trip_id": trip_id,
					"reason_id": "claim.reason.passenger.post_finished.item_lost",
				  "reason_description": "stuff left in car"
			  }
      return claimJson;
    },
		buildAdminClaimJsonForSubmission: function(user_id,trip_id){
			var claimJson = {
					"user_id": user_id,
					"trip_id": trip_id,
			    "reason_id": 'claim.reason.admin',//'claim.reason.passenger.pre_trip_in_progress.taking_too_long',//
					"reason_description": "ADMIN to CANCEL"
			  }
      return claimJson;
    },

		buildAdminClaimJson: function(user_id,trip_id){
			var claimJson = {
				"status": "accepted",
				"reason":{
						"code": "confirmed",
						"message": "thanks"
					}
				}
      return claimJson;
    },

		buildCarJsonEmpty: function(){


			var carJson = {
										  "make": "",
										  "model": "",
										  "year": "",
										  "color": "",
										  "plate_number": "",
										  "registration": {
										    "registration_id": "",
										    "issued_date": "",
										    "exp_date": ""
										  },
										  "registration_image_url": "",
										  "insurance_policy": {
										    "policy_id": "",
										    "issued_date": "",
										    "exp_date": "",
										    "company": "",
										    "company_phone_number": "",
										    "policy_name": ""
										  },
										  "insurance_policy_image_url": "string",
										  "owner": "string",
										  "type": "string"
										}
			var carJson_temp = {};
      return carJson_temp;
    },

		buildCarJson: function(id){
			var carJson = {
			  "make": cars[id].split(',')[0],
			  "model": cars[id].split(',')[1],
			  "year": cars[id].split(',')[2],
			  "registration": {
			    "registration_id": cars[id].split(',')[3],
			    "issued_date": cars[id].split(',')[4],
			    "exp_date": cars[id].split(',')[5]
			  },
			  "insurance_policy": {
			    "policy_id": cars[id].split(',')[6],
			    "issued_date": cars[id].split(',')[7],
			    "exp_date": cars[id].split(',')[8],
					"company": "company_"+id,
					"company_phone_number": "company_phone_number_"+id,
					"policy_name": "policy_name_"+id
			  }
			}
      return carJson;
    },

		buildDriverLocation: function(from_id, variation){
			var patchJson_Location = {
				"location": {
					"lat": parseFloat(inputLocations_Too_Close[from_id].split(',')[1]),
			    "lng": parseFloat(inputLocations_Too_Close[from_id].split(',')[2]-variation)
					}
				}
				return patchJson_Location;
		},

		buildTripJson: function(from_id, to_id, trip_userid){
			var tripJson = {
			  "from_location": {
					"lat": parseFloat(inputLocations_Too_Close[from_id].split(',')[1]),
			    "lng": parseFloat(inputLocations_Too_Close[from_id].split(',')[2])
			  },
			  "to_location": {
					"lat": parseFloat(inputLocations_Too_Close[to_id].split(',')[1]),
			    "lng": parseFloat(inputLocations_Too_Close[to_id].split(',')[2])
			  },
			  "passenger_user_id": trip_userid,
			  "driver_user_id": null,
			  "status": "new",
				"invoice_required": false
			}
      return tripJson;
    },

		buildPutTripJson: function(from_id, to_id, trip_userid, trip_id){
			var tripJson = {
			  "id": trip_id,
			  "from_location": {
					"lat": parseFloat(inputLocations_Too_Close[from_id].split(',')[1]),
			    "lng": parseFloat(inputLocations_Too_Close[from_id].split(',')[2])
			  },
			  "to_location": {
					"lat": parseFloat(inputLocations_Too_Close[to_id].split(',')[1]),
			    "lng": parseFloat(inputLocations_Too_Close[to_id].split(',')[2])
			  },
			  "passenger_id": trip_userid,
			  "driver_user_id": null
			}
      return tripJson;
    },

    genTokenDriverCreation : function (userid, uuid) {
  	// Gen HS256 Key
  		var token = jwt.sign({ 'sub': uuid,
  						'phone_number': '+1506230513'+userid,
							'email':'email_driver_'+userid+'@yourdomain.com',
              'first_name': 'driver_fn'+userid,
							'custom:iccid':'11122233344'+userid,
  						'cognito:groups': [
  							'admin',
  							'user'
  							]}, 'secret', { algorithm: 'HS256' });

        //console.log('driver'+userid)
        //console.log(token)
  			var params = {
  					headers:{
  						'Authorization': token,
              'Session-Type': 'driver'
  					}
  			}
  			return params;
  	},

		genTokenDriverCreation_NotAdmin : function (userid, uuid) {
  	// Gen HS256 Key
  		var token = jwt.sign({ 'sub': uuid,
  						'phone_number': '+1506230513'+userid,
							'email':'email_driver_'+userid+'@yourdomain.com',
              'first_name': 'driver_fn'+userid,
							'last_name':'driver_ln'+userid,
							'custom:iccid':'11122233344'+userid,
  						'cognito:groups': [
  							'user'
  							]}, 'secret', { algorithm: 'HS256' });

        //console.log('driver'+userid)
        console.log(token)
  			var params = {
  					headers:{
  						'Authorization': token,
              'Session-Type': 'driver'
  					}
  			}
  			return params;
  	},

		genTokenDriver_NotAdmin_NoGroups : function (userid, uuid) {
		// Gen HS256 Key
			var token = jwt.sign({ 'sub': uuid,
							'phone_number': '+1506230513'+userid,
							'email':'email_driver_'+userid+'@yourdomain.com',
							'first_name': 'driver_fn'+userid,
							'last_name':'driver_ln'+userid,
							'custom:iccid':'11122233344'+userid,
							'cognito:groups': [
								]}, 'secret', { algorithm: 'HS256' });

				//console.log('driver'+userid)
				console.log(token)
				var params = {
						headers:{
							'Authorization': token,
							'Session-Type': 'driver'
						}
				}
				return params;
		},

    genTokenUserCreation : function (userid, uuid) {
    	// Gen HS256 Key
    		var token = jwt.sign({ 'sub':uuid,
    						'phone_number': '+1506230513'+userid,
								'email':'email'+userid+'@yourdomain.com',
                'first_name': 'fn'+userid,
                'custom:iccid':'66677788899'+userid,
    						'cognito:groups': [
    							'admin'
    							]}, 'secret', { algorithm: 'HS256' });
					//console.log(uuid)
					console.log(token)
    			var params = {
    					headers:{
    						'Authorization': token,
								'Session-Type': 'passenger'
    					}
    			}
    			return params;
    	},

	    genTokenAdmin : function (userid, uuid) {
	    	// Gen HS256 Key
	    		var token = jwt.sign({ 'sub':uuid,
	    						'phone_number': '+1506230513',
									'email':'email'+userid+'@yourdomain.com',
	                'first_name': 'fn'+userid,
	                'custom:iccid':'987654321',
	    						'cognito:groups': [
	    							'admin'
	    							]}, 'secret', { algorithm: 'HS256' });
						console.log(token)
	    			var params = {
	    					headers:{
	    						'Authorization': token,
									'Session-Type': 'admin'
	    					}
	    			}
	    			return params;
	    	},

				genTokenAdminNoAuth : function () {
		    	// Gen HS256 Key
		    		var token = jwt.sign({ 'sub':admin_noauth,
		    						'phone_number': '+1506230513',
										'email':'email_admin_noauth@yourdomain.com',
		                'first_name': 'fn',
		                'custom:iccid':'987654321',
		    						'cognito:groups': [
		    							'admin'
		    							]}, 'secret', { algorithm: 'HS256' });
							//console.log(uuid)
							console.log(token)
		    			var params = {
		    					headers:{
		    						'Authorization': token,
										'Session-Type': 'admin'
		    					}
		    			}
		    			return params;
		    	},

			genTokenUserCreation_NotAdmin : function (userid, uuid) {
	    	// Gen HS256 Key
	    		var token = jwt.sign({ 'sub':uuid,
	    						'phone_number': '+1506230513'+userid,
	                'first_name': 'fn'+userid,
	                'custom:iccid':'66677788899'+userid,
	    						'cognito:groups': [
	    							'user'
	    							]}, 'secret', { algorithm: 'HS256' });
						//console.log(uuid)
						console.log(token)
	    			var params = {
	    					headers:{
	    						'Authorization': token,
									'Session-Type': 'passenger'
	    					}
	    			}
	    			return params;
	    	},

				genTokenUserCreation_AdminOnly : function (userid, uuid) {
		    	// Gen HS256 Key
		    		var token = jwt.sign({ 'sub':uuid,
		    						'phone_number': '+1506230513'+userid,
										'email':'email'+userid+'@yourdomain.com',
		                'first_name': 'fn'+userid,
		                'custom:iccid':'66677788899'+userid,
		    						'cognito:groups': [
		    							'admin'
		    							]}, 'secret', { algorithm: 'HS256' });
							//console.log(uuid)
							console.log(token)
		    			var params = {
		    					headers:{
		    						'Authorization': token,
										'Session-Type': 'passenger'
		    					}
		    			}
		    			return params;
		    	}
	}
