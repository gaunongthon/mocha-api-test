var jwt = require('jsonwebtoken');

var userid = 3;
var uuid = psg1;
var psgparams = apiHelper.genTokenUserCreation_NotAdmin(userid, uuid);
var params = "";
var apiResponse1 = "";
var endpointBeingTested = endpointMikeqa + "/batch";

describe("Batch", function() {

	it("multiple calls",function(){
		var token = jwt.sign({ 'sub':uuid,
						'phone_number': '+1506230513'+userid,
						'first_name': 'fn'+userid,
						'custom:iccid':'66677788899'+userid,
						'cognito:groups': [
							'user'
							]}, 'secret', { algorithm: 'HS256' });
			var postJson = [{
											"method": "GET",
											"path": "/users/"+uuid,
											"data":{},
											"headers":{"Authorization":token}
										},
										{
											"method": "GET",
											"path": "/users/"+uuid+"/trips",
											"data":{},
											"headers":{"Authorization":token}
											},
										{
											"method": "GET",
											"path": "/users/"+uuid+"/ratings",
											"data":{},
											"headers":{"Authorization":token}
											},
										{
											"method": "GET",
											"path": "/users/"+uuid+"/promotion-redemptions",
											"data":{},
											"headers":{"Authorization":token}
											},
										{
											"method": "GET",
											"path": "/users/"+uuid+"/favourites",
											"data":{},
											"headers":{"Authorization":token}
											}]
			apiResponse1 = chakram.post(endpointBeingTested, postJson, psgparams);
			apiResponse1.then(function(json) {
				console.log("Received: " + json.body.length)
				json.body.map(function(obj){
					console.log(obj.response)
					console.log("================")					
				})
			})
			expect(apiResponse1).to.have.status(207);
			return chakram.wait();
	})

	it("get all endpoints",function(){
			endpointBeingTested = endpointMikeqa + "/"
			apiResponse1 = chakram.get(endpointBeingTested, psgparams);
			apiResponse1.then(function(json) {
				console.log(json.body)
	    })
			expect(apiResponse1).to.have.status(200);
			return chakram.wait();
	})

});
