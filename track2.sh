# #!/bin/bash

if [ ! -f "repos.txt" ]; then
    echo "repos.txt not found"
    exit 1
fi

# Obtener el nombre de usuario del usuario actual
user_name=$(git config user.name)
echo '[' > "commits.json"

while IFS= read -r line
do
    # Itera sobre cada hijo del directorio actual para acceder a los repositorios
    for d in "$line"/*; do
        # Mostrar el nombre del repositorio
        repo_name=$(basename -s .git $(git --git-dir=$d/.git remote get-url origin))
        # Mostrar los últimos commits del usuario actual del día actual
        commit_log=$(git -C "$d" log --author="$user_name" --since=midnight --oneline --pretty=format:'‧ %s')
        if [ -n "$commit_log" ]; then
            echo { \"$repo_name\" : \"$commit_log\" },
        fi
    done 
done < "repos.txt" >> "commits.json"

echo ']' >> "commits.json"