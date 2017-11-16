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

   
	    genToken : function (userid, uuid) {
	    	// Gen HS256 Key
	    		var token = jwt.sign({ 'sub':uuid, 'secret', { algorithm: 'HS256' });
						console.log(token)
	    			var params = {
	    					headers:{
	    						'Authorization': token,
									'Session-Type': 'admin'
	    					}
	    			}
	    			return params;
	    	}
	}
