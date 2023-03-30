#!/usr/bin/env node

const { cli } = require('cleye');
const packageJSON = require('../package.json');


const { configCommand } = require('./commands/config');
const extraArgs = process.argv.slice(2);

cli({
    version: packageJSON.version,
    name: packageJSON.name,
    help: { description: packageJSON.description },
    commands: [configCommand],
    flags: {},
    ignoreArgv: (type) => type === 'unknown-flag' || type === 'argument',
    },
    async () => {

    },
    extraArgs
)
