db.createCollection('posts', {validator: {
    $jsonSchema: {
        bsonType: "object",
        required: ["title", "text", "creator", "comments"],
        properties: {
            title: {
                bsonType: "string",
                description: "title must be a string value"
            },
            text: {
                bsonType: "string",
                description: "text must be a string value"
            },
            creator: {
                bsonType: "objectId",
                description: "creator must be an objectId value"
            },
            comments: {
                bsonType: "array",
                description: "comments must be an array value",
                items: {
                    bsonType: "object",
                    properties: {
                        text: {
                            bsonType: "string",
                            description: "comments text must be a string value"
                        },
                        author: {
                            bsonType: "objectId",
                            description: "comments author must be an objectId"
                        }
                    }
                }
            }
        }
    }
}})