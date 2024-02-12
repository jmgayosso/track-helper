require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const opn = require('opn');

function readBashData () {
    // Ejecutar el script Bash y capturar la ruta del archivo temporal
    const { spawnSync } = require('child_process');
    const script = spawnSync('bash', ['src/track.sh']);
    const output_file = script.stdout.toString().trim();
    // const output_file_e = script.stderr.toString().trim();
    
    // Leer el contenido del archivo temporal y convertirlo en un objeto o un array
    const content = fs.readFileSync(output_file, 'utf8');
    console.log(content)

    let repos = content.trim().split('bash_repo:').map((repo) => {
        const split = repo.trim().split('commit_log=')
        const repoName = split[0]?.replace('repo_name=',''.replace('\n',''))
        const repoCommits = split[1]?.replaceAll('\n','')
        return { name: repoName?.trim(), commits: repoCommits?.trim()}
    });

    repos = repos?.filter(v => v.commits !== undefined && v.commits !== '')
    return repos
}

async function getIntelligentLogs (repos) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const { data } = await openai.createCompletion({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Write a list for a report of tasks done today (software developer tasks), group tasks by category and by project, use icons for each task regarding with the description (replace current icons if necessary to match the gitmoji standart), describe in a professional way the tasks.
        Here is an example:
Fix: Removed unused imports and commented out code to improve code cleanliness and readability
Feature: Renamed do_setup_asset function to do_create_afloat_asset for better naming consistency and clarity
Feature: Refactored InitialSetupArgs::All match arm to call necessary setup functions in the correct order for initializing afloat pallet
Fix: Removed unnecessary commented out code in pallet module
Refactor: Removed unnecessary empty line in Afloat pallet module
Docs: Added documentation for do_setup_roles function in Afloat pallet to explain its inputs and purpose

ALSO: Use the following projects array info and use separators for each project list (like ==========project.name===========): ${JSON.stringify(repos)}`,
        max_tokens: 2000,
        temperature: 1,
    })
    return data.choices[0]?.text?.trim()
}

function formatLogsToTxt (logs) {
    let txt = ''
    logs.forEach(log => {
      txt += `\n===================${log.project}====================\n`
      txt += `\n${log.response}\n`
    });
    return txt
}

function saveLogs(fileName, text) {
    const logsDir = 'logs';
    if (!fs.existsSync(logsDir)) {
        console.log('Creating logs dir')
        fs.mkdirSync(logsDir);
    }
    fs.writeFile(`${logsDir}/${fileName}.txt`, text, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`The logs was saved on ${logsDir}/${fileName}.txt`);
    });
}

function openLogs (fileName) {
    opn(`logs/${fileName}.txt`);
    console.log('The logs was opened on your computer')
}


async function main () {
    console.log('Getting commits from git');
    const repos = readBashData()

    console.log('Making cool logs');
    const logs = await getIntelligentLogs(repos)

    // Get current date
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;
    
    console.log('Saving logs')
    // const text = formatLogsToTxt(logs)

    saveLogs(formattedDate, logs)

    console.log('Opening new logs');
    openLogs(formattedDate)
}

main()
