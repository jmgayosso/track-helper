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
${config?.emoji ? 'Use GitMoji convention to preface the task.' : 'Do not preface the task with anything.'}
${config?.description ? 'Add a short description of WHY the changes are done after the commit message. Don\'t start it with "This commit", just describe the changes.' : "Don't add any descriptions to the commit, only commit message."}
Use the present tense. Lines must not be longer than 74 characters.`
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
]