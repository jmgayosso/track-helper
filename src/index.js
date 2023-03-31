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
    const logs = []
    const promises = await repos.map(async repo => {
        const { data } = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Please write professional list of tasks to log daily progress report of the following tasks and group by category, please use a few icons: ${repo.commits}`,
            max_tokens: 2000,
            temperature: 0,
        })  
        logs.push({
            project: repo.name,
            response: data.choices[0]?.text?.trim()
        })
    })
    await Promise.all(promises)
    return logs
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
    const month = String(today.getMonth() + 1).padStart(2, '0'); // obtenemos el mes y lo formateamos con dos dígitos
    const day = String(today.getDate()).padStart(2, '0'); // obtenemos el día y lo formateamos con dos dígitos
    const year = today.getFullYear(); // obtenemos el año
    const formattedDate = `${month}-${day}-${year}`; // unimos las partes para formar la fecha en el formato mm-dd-aaaa
    
    console.log('Saving logs')
    const text = formatLogsToTxt(logs)
    saveLogs(formattedDate, text)

    console.log('Opening new logs');
    openLogs(formattedDate)
}

main()
