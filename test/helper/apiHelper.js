module.exports =
{
	log: function(_t, msg){
				addContext(_t, msg);
			},

	requestToken: function(){
		//set up serverUrl
		var req = serverUrl + "/login";

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
	request_x_api_key: function(){
        // Load the AWS SDK
        const AWS = require('aws-sdk'),
        region = "us-west-1",
        secretName = "environment/key-to-make-api-call";

        // Create a Secrets Manager client
        let client = new AWS.SecretsManager({
        region: region
        });

        const params = {
            SecretId: secretName
        };

        return new Promise(function(resolve, reject){
            client.getSecretValue(params, function(error, data){
                if(error){
                    reject(error);
                }
                else{
                    resolve(data);
                }
            })
        });
	},
	genCorrectHeaders: function() {
        return this.request_x_api_key()
        .then (function(result){
            const xapikey = JSON.parse(result.SecretString).apikeydev;
            let params = {
                "headers": {
                    "x-api-key": `${xapikey}`,
                    "Content-Type": "application/json"
                }
            };
            return params;
        });
    }
}
