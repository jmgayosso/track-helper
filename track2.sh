#!/bin/bash

# Obtener el nombre de usuario del usuario actual
user_name=$(git config user.name )

# Crear un archivo temporal para almacenar la información de los repositorios
output_file=$(mktemp)

# Buscar todos los directorios que sean repositorios de git en el directorio actual
for dir in $(find ./../ -name ".git" -type d -exec dirname {} \;); do
    # Obtener el nombre del repositorio
    echo "bash_repo:" >> "$output_file"
    repo_name=$(basename "$dir")
    # Almacenar el nombre del repositorio en el archivo temporal
    echo "repo_name=$repo_name" >> "$output_file"
    # Obtener los últimos commits del usuario actual del día actual
    commit_log=$(git -C "$dir" log --author="$user_name" --since=midnight --oneline --pretty=format:'%s')
    # Almacenar los últimos commits en el archivo temporal
    echo "commit_log=$commit_log" >> "$output_file"
done

# Imprimir la ruta del archivo temporal en la consola
echo "$output_file"