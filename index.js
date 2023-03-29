const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
require('dotenv').config();

function readBashData () {
// Ejecutar el script Bash y capturar la ruta del archivo temporal
const { spawnSync } = require('child_process');
const script = spawnSync('bash', ['./track2.sh']);
const output_file = script.stdout.toString().trim();
// console.log('output_file_js', output_file)

// Leer el contenido del archivo temporal y convertirlo en un objeto o un array
const content = fs.readFileSync(output_file, 'utf8');
// console.log('content', content )

let repos = content.trim().split('bash_repo:').map((repo) => {
    const split = repo.trim().split('commit_log=')
    const repoName = split[0]?.replace('repo_name=',''.replace('\n',''))
    const repoCommits = split[1]?.replaceAll('\n','')
    return { name: repoName?.trim(), commits: repoCommits?.trim()}
});

repos = repos?.filter(v => v.commits !== undefined && v.commits !== '')
return repos
}

async function main () {
    const repos = readBashData()
    const logs = await getIntelligentLogs(repos)
    console.log('logs', logs)
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
            prompt: `Please write professional list of tasks to log daily progress report of the following tasks: ${repo.commits}`,
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
    // console.log('response', logs)
}

main()
