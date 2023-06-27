const { getConfig } = require('../commands/config')
const { tokenCount } = require('./tokenCount')
const { api } = require('./api')

const config = getConfig();

const INIT_MESSAGES_PROMPT_COMMIT = [
    {
        role: ChatCompletionRequestMessageRoleEnum.System,
        // prettier-ignore
        content: `You are to act as the author of a commit message in git. Your mission is to create clean and comprehensive commit messages in the conventional commit convention and explain why a change was done. I'll send you an output of 'git diff --staged' command, and you convert it into a commit message.
${config?.emoji ? 'Use GitMoji convention to preface the commit.' : 'Do not preface the commit with anything.'}
${config?.description ? 'Add a short description of WHY the changes are done after the commit message. Don\'t start it with "This commit", just describe the changes.' : "Don't add any descriptions to the commit, only commit message."}
Use the present tense. Lines must not be longer than 74 characters. Use ${translation.localLanguage} to answer.`
    },
    {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: `diff --git a/src/server.ts b/src/server.ts
index ad4db42..f3b18a9 100644
--- a/src/server.ts
+++ b/src/server.ts
@@ -10,7 +10,7 @@
import {
  initWinstonLogger();
  
  const app = express();
 -const port = 7799;
 +const PORT = 7799;
  
  app.use(express.json());
  
@@ -34,6 +34,6 @@
app.use((_, res, next) => {
  // ROUTES
  app.use(PROTECTED_ROUTER_URL, protectedRouter);
  
 -app.listen(port, () => {
 -  console.log(\`Server listening on port \${port}\`);
 +app.listen(process.env.PORT || PORT, () => {
 +  console.log(\`Server listening on port \${PORT}\`);
  });`
    },
    {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: `${config?.emoji ? '🐛 ' : ''}${translation.commitFix}
${config?.emoji ? '✨ ' : ''}${translation.commitFeat}
${config?.description ? translation.commitDescription : ''}`
    }
];


const INIT_MESSAGES_PROMPT_TASK = [
    {
        role: ChatCompletionRequestMessageRoleEnum.System,
        // prettier-ignore
        content: `You are to act as the author of a commit message in git. Your mission is to create clean and comprehensive task related to the a given commit. I'll send you an output of 'git log -1' command, and you convert it into a task to log daily progress report.
${config?.description ? 'Add a short description of WHY the changes are done after the commit message. Don\'t start it with "This commit", just describe the changes.' : "Don't add any descriptions to the commit"}
Use the present tense. Lines must not be longer than 74 characters.`
    },
    {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: `git log -1
commit 59d99d3acaeacc193388aff00bba6936d7b8c535 (HEAD -> feature/cli, origin/feature/cli)
Author: tlacloc <desneruda@gmail.com>
Date:   Fri Mar 31 11:18:26 2023 -0600

    🚀 feat(aiParse.js): add support for generating commit messages and tasks
    ✨ feat(api.js): add OpenAI class to generate commit messages
    🆕 feat(tokenCount.js): add function to count tokens in a string
    🔧 chore(config.js): export getConfig function
    The AI parse module now supports generating commit messages and tasks. The OpenAI class was added to the api module to generate commit messages. A new function was added to the tokenCount module to count the number of tokens in a string. The getConfig function was exported from the config module.`
    },
    {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: `${config?.emoji ? '🐛 ' : ''}${translation.commitFix}
${config?.emoji ? '✨ ' : ''}${translation.commitFeat}
${config?.description ? translation.commitDescription : ''}`
    }
]

const INIT_MESSAGES_PROMPT_ISSUE = [
    {
        role: ChatCompletionRequestMessageRoleEnum.System,
        // prettier-ignore
        content: `Act as the writer of a github issue. Your mission is to create a clean and comprehensive issue related to a given task. I'll give you a task in either English or Spanish. Add a description of WHY the changes are done. Write the issue in English`
    },
    {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: `Implementar Fees distintos para ventas y compras en la Pallet de afloat`
    },
    {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: `${config?.emoji ? '🐛 ' : ''}${translation.commitFix}
${config?.emoji ? '✨ ' : ''}${translation.commitFeat}
${config?.description ? translation.commitDescription : ''}`
    }
]