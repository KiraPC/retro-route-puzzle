const fs = require('fs');
const arg = require('arg');
const inquirer = require('inquirer');
const game = require('./lib/retro-route-puzzle');

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--map-file': String,
            '--starting-room': String,
            '--objects-to-collect': String
        },
        {
            argv: rawArgs.slice(2),
        }
    );

    return {
        mapFile: args['--map-file'],
        startingRoom: args['--starting-room'],
        objectsToCollect: args['--objects-to-collect']
    };
}

async function promptForMissingOptions(options) {
    const requiredOptions = ['mapFile', 'startingRoom', 'objectsToCollect'];
    const questions = [];

    for (let i = 0; i < requiredOptions.length; i++) {
        const requiredOption = requiredOptions[i];
        
        if (!options[requiredOption]) {
            questions.push({
                type: 'input',
                name: requiredOption,
                message: `Insert ${requiredOption}`
            });
        }
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        mapFile: options.mapFile || answers.mapFile,
        startingRoom: options.startingRoom || answers.startingRoom,
        objectsToCollect: options.objectsToCollect || answers.objectsToCollect
    };
}

module.exports.cli = async (args) => {
    let options = parseArgumentsIntoOptions(args);
    const {
        mapFile,
        startingRoom,
        objectsToCollect
    } = await promptForMissingOptions(options);

    try {
        const map = fs.readFileSync(mapFile, 'utf8');

        console.table(game(
            JSON.parse(map),
            startingRoom,
            objectsToCollect.split(',')
        ));
    } catch (error) {
        console.log('An error occured:', error)
    }
}
