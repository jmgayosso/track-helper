const { execa } = require('execa');
const { outro, spinner } = require('@clack/prompts');
const { readFileSync } = require('fs');
const ignore = require('ignore');

const assertGitRepo = async () => {
  try {
    await execa('git', ['rev-parse']);
  } catch (error) {
    throw new Error(error);
  }
};

// const excludeBigFilesFromDiff = ['*-lock.*', '*.lock'].map(
//   (file) => `:(exclude)${file}`
// );

const getTrackHelperIgnore = () => {
  const ig = ignore();

  try {
    ig.add(readFileSync('.trackhelperignore').toString().split('\n'));
  } catch (e) {}

  return ig;
};

const getStagedFiles = async () => {
  const { stdout: gitDir } = await execa('git', [
    'rev-parse',
    '--show-toplevel'
  ]);

  const { stdout: files } = await execa('git', [
    'diff',
    '--name-only',
    '--cached',
    '--relative',
    gitDir
  ]);

  if (!files) return [];

  const filesList = files.split('\n');

  const ig = getTrackHelperIgnore();
  const allowedFiles = filesList.filter((file) => !ig.ignores(file));

  if (!allowedFiles) return [];

  return allowedFiles.sort();
};

const getChangedFiles = async () => {
  const { stdout: modified } = await execa('git', ['ls-files', '--modified']);
  const { stdout: others } = await execa('git', [
    'ls-files',
    '--others',
    '--exclude-standard'
  ]);

  const files = [...modified.split('\n'), ...others.split('\n')].filter(
    (file) => !!file
  );

  return files.sort();
};

const gitAdd = async ({ files }) => {
  const gitAddSpinner = spinner();
  gitAddSpinner.start('Adding files to commit');
  await execa('git', ['add', ...files]);
  gitAddSpinner.stop('Done');
};

const getDiff = async ({ files }) => {
  const lockFiles = files.filter(
    (file) => file.includes('.lock') || file.includes('-lock.')
  );

  if (lockFiles.length) {
    outro(
      `Some files are '.lock' files which are excluded by default from 'git diff'. No commit messages are generated for this files:\n${lockFiles.join(
        '\n'
      )}`
    );
  }

  const filesWithoutLocks = files.filter(
    (file) => !file.includes('.lock') && !file.includes('-lock.')
  );

  const { stdout: diff } = await execa('git', [
    'diff',
    '--staged',
    '--',
    ...filesWithoutLocks
  ]);

  return diff;
};

const getLastCommit = async () => {
    const { stdout: lastCommit } = await execa('git', [
        'log',
        '-1',
    ]);

    return lastCommit;
}

module.exports = {
  assertGitRepo,
  getOpenCommitIgnore: getTrackHelperIgnore,
  getStagedFiles,
  getChangedFiles,
  gitAdd,
  getDiff,
  getLastCommit
};
