const { join: pathJoin } = require('path');
const { parse: iniParse, stringify: iniStringify } = require('ini');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { homedir } = require('os');
const chalk = require('chalk');
const { command } = require('cleye');
const { intro, outro } = require('@clack/prompts');

const COMMANDS =  {
  hook :'hook',
  config : 'config'
}

const CONFIG_KEYS = {
    OPENAI_API_KEY: 'OPENAI_API_KEY',
    description: 'description',
    emoji: 'emoji',
    language: 'language'
};

const CONFIG_MODES = {
    get: 'get',
    set: 'set'
};


const validateConfig = (key, condition, validationMessage) => {
    if (!condition) {
        outro(`${chalk.red('✖')} Unsupported config key ${key}: ${validationMessage}`);
        process.exit(1);
    }
};

const configValidators = {
    [CONFIG_KEYS.OPENAI_API_KEY](value) {
        validateConfig(CONFIG_KEYS.OPENAI_API_KEY, value, 'Cannot be empty');
        validateConfig(
            CONFIG_KEYS.OPENAI_API_KEY,
            value.startsWith('sk-'),
            'Must start with "sk-"'
        );
        validateConfig(
            CONFIG_KEYS.OPENAI_API_KEY,
            value.length === 51,
            'Must be 51 characters long'
        );

        return value;
    },

    [CONFIG_KEYS.description](value) {
        validateConfig(
            CONFIG_KEYS.description,
            typeof value === 'boolean',
            'Must be true or false'
        );

        return value;
    },

    [CONFIG_KEYS.emoji](value) {
        validateConfig(
            CONFIG_KEYS.emoji,
            typeof value === 'boolean',
            'Must be true or false'
        );

        return value;
    },

    [CONFIG_KEYS.language](value) {
        validateConfig(
            CONFIG_KEYS.language,
            getI18nLocal(value),
            `${value} is not supported yet`
        );
        return getI18nLocal(value);
    }
};

const configPath = pathJoin(homedir(), '.track-helper');

const getConfig = () => {
    const configExists = existsSync(configPath);
    if (!configExists) return null;

    const configFile = readFileSync(configPath, 'utf8');
    const config = iniParse(configFile);

    for (const configKey of Object.keys(config)) {
        const validValue = configValidators[configKey](config[configKey]);

        config[configKey] = validValue;
    }

    return config;
};

const setConfig = (keyValues) => {
    const config = getConfig() || {};

    for (const [configKey, configValue] of keyValues) {
        if (!configValidators.hasOwnProperty(configKey)) {
            throw new Error(`Unsupported config key: ${configKey}`);
        }

        let parsedConfigValue;

        try {
            parsedConfigValue = JSON.parse(configValue);
        } catch (error) {
            parsedConfigValue = configValue;
        }

        const validValue = configValidators[configKey](parsedConfigValue);
        config[configKey] = validValue;
    }

    writeFileSync(configPath, iniStringify(config), 'utf8');

    outro(`${chalk.green('✔')} config successfully set`);
};

const configCommand = command(
    {
        name: COMMANDS.config,
        parameters: ['<mode>', '<key=values...>']
    },
    async (argv) => {
        intro('track-helper — config');
        try {
            const { mode, keyValues } = argv._;

            if (mode === CONFIG_MODES.get) {
                const config = getConfig() || {};
                for (const key of keyValues) {
                    outro(`${key}=${config[key]}`);
                }
            } else if (mode === CONFIG_MODES.set) {
                await setConfig(
                    keyValues.map((keyValue) => keyValue.split('='))
                );
            } else {
                throw new Error(
                    `Unsupported mode: ${mode}. Valid modes are: "set" and "get"`
                );
            }
        } catch (error) {
            outro(`${chalk.red('✖')} ${error}`);
            process.exit(1);
        }
    }
);


module.exports = {
    getConfig,
    configCommand
}