global.chakram = require('./../lib/chakram.js');
global.uuidV4 = require('uuid/v4');
global.apiHelper = require('./../lib/utils/apiHelper.js');
global.expect = global.chakram.expect;
global.endpointMikeqa = "https://API_resource";

global.expectedSchemaOneUser = {
		type: "object",
		properties: {
				_links: {
						type: "object",
						properties: {
								collection: {type: "string"},
								self: {type: "string"}
						},
						required: ["collection", "self"]
				},
				email: {type: ["null", "string"]},
				first_name: {type: ["null", "string"]},
				id: {type: "string"},
				last_name: {type: ["null", "string"]},
				phone_number: {type: "string"}
		},
		required: ["_links", "id", "phone_number", "email", "first_name", "last_name", "location"]
};

global.tripStatus = ["new","driver_lookup", "driver_in_route", "trip_in_progress", "driver_lookup_failed", "finished", "cancelled"];
//global.tripStatus = ["NEW", "COMPLETE", "IN-PROGRESS", "CANCELLED"];
global.requestStatus = ["pending", "accepted", "denied", "timeout"];
//("pending", "accepted", "denied", "timeout")
