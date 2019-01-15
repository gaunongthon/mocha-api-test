module.exports = {
			log: function(_t, msg){
						console.log(msg)
						addContext(_t, msg);
					},

			requestToken: function(){
				//set up endpoint
				var req = endpoint + "/login";

				//set up request payload
				var jsonPayload = {
				    "email": usr,
				    "password": pwd
				}

				//set up headers
				var params = {
		  					headers:{
		  						'Authorization': "",
		  					}
		  			}

				//signing request happens here
				apiHelper.log(_context, "\n Requesting Token from : " + req);
				apiResponse = chakram.post(req, jsonPayload, params);
				return apiResponse;
			},
		}
