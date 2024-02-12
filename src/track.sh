#!/bin/bash

# Obtener el nombre de usuario del usuario actual
user_name=$(git config user.name)

# Crear un archivo temporal para almacenar la información de los repositorios
output_file=$(mktemp)

# Definir la lista de directorios de repositorios de Git
repo_directories=(
    "/home/tlalocman/github.com/prxyco/backend"
    "/home/tlalocman/github.com/hashed-io/hashed-pallets"
    "/home/tlalocman/github.com/hashed-io/hashed-solochain"
    "/home/tlalocman/github.com/hashed-io/hashed-substrate"
    "/home/tlalocman/github.com/hashed-io/hashed-substrate-parachain"
    "/home/tlalocman/github.com/hashed-io/eos-token-rewards-smart-contract"
    "/home/tlalocman/github.com/hashed-io/discord-tracker"
    "/home/tlalocman/github.com/bitcashorg/bitcash-contract-dho"
    # Agrega más rutas de directorios si es necesario
)

# Iterar sobre la lista de directorios
for dir in "${repo_directories[@]}"; do
    # Obtener el nombre del repositorio
    echo "bash_repo:" >> "$output_file"
    repo_name=$(basename "$dir")
    # Almacenar el nombre del repositorio en el archivo temporal
    echo "repo_name=$repo_name" >> "$output_file"
    # Obtener los últimos commits del usuario actual del día actual
    commit_log=$(git -C "$dir" log --author="$user_name" --since="midnight" --all)
    # Almacenar los últimos commits en el archivo temporal
    echo "commit_log=$commit_log" >> "$output_file"
done

# Imprimir la ruta del archivo temporal en la consola
echo "$output_file"
