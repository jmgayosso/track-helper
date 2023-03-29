const fs = require('fs');

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

console.log(repos);