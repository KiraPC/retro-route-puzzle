const S = require('fluent-json-schema')
const Ajv = require("ajv")

const schema = S.object()
    .prop('rooms', S.array().required().items(
        S.object()
            .prop('id', S.integer().required())
            .prop('name', S.string().required())
            .prop('north', S.integer())
            .prop('south', S.integer())
            .prop('west', S.integer())
            .prop('east', S.integer())
            .prop('objects', S.array().required().items(
                S.object()
                    .prop('name', S.string().required())
            ))
    ));

const ajv = new Ajv();
const isValid = ajv.compile(schema.valueOf());

function validate(map) {
    const valid = isValid(map);
    if (!valid) {
        throw 'Map is malformed.'
    }
}

function nav(rooms, startId, objects, response) {
    // exit when all the rooms where visited or all objects found
    if (startId === null || objects.length === 0) {
        return;
    }

    const room = rooms[startId];

    if (!room) {
        throw `The id ${startId} is not a valid room id`;
    }

    let collectedObject = null;
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        // check if in the room a requested object is present ..
        if (room.objects.find(obj => obj.name === object)) {
            // ... mark and remove the object
            collectedObject = object;
            objects.splice(i, 1);
            break;
        }
    }

    response.push({
        id: room.id,
        name: room.name,
        objectCollected: collectedObject
    });

    /**
     * 
     * get the next room to visit and mark it as visited
     * 
     * The schema, as Max sing, is North - South - West - Est
     */
    let next = null;
    if (room.north) {
        next = room.north;
        room.north = null;
    } else if (room.south) {
        next = room.south;
        room.south = null;
    } else if (room.west) {
        next = room.west;
        room.west = null;
    } else if (room.east) {
        next = room.east;
        room.east = null;
    }

    nav(rooms, next, objects, response);
}

module.exports = (json, startingRoomId, objects) => {
    // validate that the map respect the format
    validate(json);

    // modify the array to be directly accessible by id
    const rooms = {};
    for (let i = 0; i < json.rooms.length; i++) {
        const room = json.rooms[i];
        rooms[room.id] = room;
    }

    // the result object
    let res = [];
    nav(rooms, startingRoomId, objects, res);
    return res;
};
