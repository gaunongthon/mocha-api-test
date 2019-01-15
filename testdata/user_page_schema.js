global.expectedUserPageSchema =
{
type: "object",
properties:{
  "page": {type: "integer"},
  "per_page": {type: "integer"},
  "total": {type: "integer"},
  "total_pages": {type: "integer"},
  "data":{
      type: "array",
      properties: {
        "id": {type: "integer"},
        "first_name": {type: "string"},
        "last_name": {type: "string"},
        "avatar": {type: "string"}
      },
      required: ["id", "first_name", "last_name", "avatar"]
    }
  },
  required: ["page", "per_page", "total", "total_pages", "data"]
}
