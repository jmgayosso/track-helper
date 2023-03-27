# #!/bin/bash

# Obtener el nombre de usuario del usuario actual
user_name=$(git config user.name )

$token = $1
# Buscar todos los directorios que sean repositorios de git en el directorio actual
for dir in $(find ./../ -name ".git" -type d -exec dirname {} \;); do
    # Obtener el nombre del repositorio
    repo_name=$(basename "$dir")
    # Mostrar el nombre del repositorio‧
    echo "=================== $repo_name ==================="
    # Mostrar los últimos commits del usuario actual del día actual
    commit_log=$(git -C "$dir" log --author="$user_name" --since=midnight --oneline --pretty=format:'‧ %s')
    echo $commit_log
    # curl https://api.openai.com/v1/completions \
    # -H "Content-Type: application/json" \
    # -H "Authorization: Bearer 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" \
    # -d '{
    # "model": "text-davinci-003",
    # "prompt": "Please do this tasks list in a proffesional format to log: ($commit_log)",
    # "temperature": 0, "max_tokens": 2000
    # }'
    echo
done