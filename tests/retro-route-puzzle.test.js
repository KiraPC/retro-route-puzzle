const game = require('../lib/retro-route-puzzle');
const t = require('tap');
const test = t.test;

test('first example - expect find objects in 6 steps', t => {
    const response = game({
        "rooms": [
            { "id": 1, "name": "Hallway", "north": 2, "objects": [] },
            { "id": 2, "name": "Dining Room", "south": 1, "west": 3, "east": 4, "objects": [] },
            { "id": 3, "name": "Kitchen", "east": 2, "objects": [{ "name": "Knife" }] },
            { "id": 4, "name": "Sun Room", "west": 2, "objects": [{ "name": "Potted Plant" }] }
        ]
    }, 2, ['Knife', 'Potted Plant']);

    t.equal(response.length, 6);
    t.equal(JSON.stringify(response), JSON.stringify([
        { "id": 2, "name": "Dining Room", "objectCollected": null },
        { "id": 1, "name": "Hallway", "objectCollected": null },
        { "id": 2, "name": "Dining Room", "objectCollected": null },
        { "id": 3, "name": "Kitchen", "objectCollected": "Knife" },
        { "id": 2, "name": "Dining Room", "objectCollected": null },
        { "id": 4, "name": "Sun Room", "objectCollected": "Potted Plant" }
    ]));
    t.end();
});

test('second example - expect find objects in 11 steps', t => {
    const response = game({
        "rooms": [
            { "id": 1, "name": "Hallway", "north": 2, "east": 7, "objects": [] },
            { "id": 2, "name": "Dining Room", "north": 5, "south": 1, "west": 3, "east": 4, "objects": [] },
            { "id": 3, "name": "Kitchen", "east": 2, "objects": [{ "name": "Knife" }] },
            { "id": 4, "name": "Sun Room", "west": 2, "north": 6, "south": 7, "objects": [] },
            { "id": 5, "name": "Bedroom", "south": 2, "east": 6, "objects": [{ "name": "Pillow" }] },
            { "id": 6, "name": "Bathroom", "west": 5, "south": 4, "objects": [] },
            { "id": 7, "name": "Living room", "west": 1, "north": 4, "objects": [{ "name": "Potted Plant" }] }
        ]
    }, 4, ['Knife', 'Potted Plant', 'Pillow']);

    t.equal(response.length, 11);
    t.equal(JSON.stringify(response), JSON.stringify([
        { "id": 4, "name": "Sun Room", "objectCollected": null }, 
        { "id": 6, "name": "Bathroom", "objectCollected": null }, 
        { "id": 4, "name": "Sun Room", "objectCollected": null }, 
        { "id": 7, "name": "Living room", "objectCollected": "Potted Plant" }, 
        { "id": 4, "name": "Sun Room", "objectCollected": null }, 
        { "id": 2, "name": "Dining Room", "objectCollected": null }, 
        { "id": 5, "name": "Bedroom", "objectCollected": "Pillow" }, 
        { "id": 2, "name": "Dining Room", "objectCollected": null }, 
        { "id": 1, "name": "Hallway", "objectCollected": null }, 
        { "id": 2, "name": "Dining Room", "objectCollected": null }, 
        { "id": 3, "name": "Kitchen", "objectCollected": "Knife" }
    ]));
    t.end();
});

test('error is thrown when map is invalid', t => {
    try {
        game({
            "rooms": [
                { "idx": 1, "name": "Hallway", "north": 2, "east": 7, "objects": [] }
            ]
        }, 4, ['Knife', 'Potted Plant', 'Pillow']);
        t.fail();
    } catch (error) {
        t.ok(/Map is malformed./.test(error));
    }
    t.end();
});

test('step is array.length when room is one and withoud object', t => {
    const response = game({
        "rooms": [
            { "id": 1, "name": "Hallway", "objects": [] }
        ]
    }, 1, ['Knife', 'Potted Plant', 'Pillow']);
    t.equal(response.length, 1);
    t.end();
});

test('error is thrown when an invalid id is given', t => {
    try {
        game({
            "rooms": [
                { "id": 1, "name": "Hallway", "objects": [] }
            ]
        }, 0, ['Knife', 'Potted Plant', 'Pillow']);
        t.fail();
    } catch (error) {
        t.ok(/The id 0 is not a valid room id/.test(error));
    }

    t.end();
});
