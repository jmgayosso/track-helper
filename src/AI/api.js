const { intro, outro } = require('@clack/prompts');
const axios = require('axios');
const chalk = require('chalk');
const {
  ChatCompletionRequestMessage,
  Configuration: OpenAiApiConfiguration,
  OpenAIApi,
} = require('openai');

const { CONFIG_MODES, getConfig } = require('./commands/config');

const config = getConfig();

let apiKey = config?.OPENAI_API_KEY;

const [command, mode] = process.argv.slice(2);

if (!apiKey && command !== 'config' && mode !== CONFIG_MODES.set) {
  intro('track-helper');

  outro(
    'OPENAI_API_KEY is not set, please run `th config set OPENAI_API_KEY=<your token>. Make sure you add payment details, so API works.`'
  );
  outro(
    'For help look into README https://github.com/jmgayosso/track-helper#setup'
  );

  process.exit(1);
}

class OpenAi {
  constructor() {
    this.openAiApiConfiguration = new OpenAiApiConfiguration({
      apiKey: apiKey,
    });

    this.openAI = new OpenAIApi(this.openAiApiConfiguration);
  }

  generateCommitMessage = async (messages) => {
    try {
      const { data } = await this.openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0,
        top_p: 0.1,
        max_tokens: 196,
      });

      const message = data.choices[0].message;

      return message?.content;
    } catch (error) {
      outro(`${chalk.red('✖')} ${error}`);

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        const openAiError = error.response.data.error;

        if (openAiError?.message) outro(openAiError.message);
        outro(
          'For help look into README https://github.com/jmgayosso/track-helper#setup'
        );
      }

      process.exit(1);
    }
  }
}

const getTrackHelperLatestVersion = async () => {
  try {
    const { data } = await axios.get(
      'https://unpkg.com/track-helper/package.json'
    );
    return data.version;
  } catch (_) {
    outro('Error while getting the latest version of track-helper');
    return undefined;
  }
};

exports.api = new OpenAi();
exports.getTrackHelperLatestVersion = getTrackHelperLatestVersion