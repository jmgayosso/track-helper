# #!/bin/bash

# # Buscar todos los directorios que sean repositorios de git en el directorio actual
# for dir in $(find ./../ -name ".git" -type d -exec dirname {} \;); do
#     # Obtener el nombre del repositorio
#     repo_name=$(basename "$dir")
#     # Mostrar el nombre del repositorio
#     echo "=================== $repo_name ==================="
#     # Mostrar los últimos commits
#     git -C "$dir" log -n 5 --pretty=format:'%h - %an, %ar : %s'
#     echo
# done

#!/bin/bash

# Obtener el nombre de usuario del usuario actual
user_name='Jose Maria Gayosso'

# Buscar todos los directorios que sean repositorios de git en el directorio actual
for dir in $(find ./../ -name ".git" -type d -exec dirname {} \;); do
    # Obtener el nombre del repositorio
    repo_name=$(basename "$dir")
    # Mostrar el nombre del repositorio
    echo "=================== $repo_name ==================="
    # Mostrar los últimos commits del usuario actual del día actual
    # git -C "$dir" log --since=midnight --author="$user_name" --pretty=format:'%h - %an, %ar : %s'
    git -C "$dir" log --author="$user_name" --since=midnight --oneline --pretty=format:'%s'

    echo
done