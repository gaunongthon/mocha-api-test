global.expectedGetUserSchema =
{
type: "object",
properties:{
  "data":{
    type: "object",
    properties:{
      "id": {typ: "integer"},
      "first_name": {type: "string"},
      "last_name": {type: "string"},
      "avatar": {type: "string"}
    },
    required: ["id", "first_name", "last_name", "avatar"]
  }
},
required: ["data"]

}
