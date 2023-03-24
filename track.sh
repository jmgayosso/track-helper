find ./../ -name ".git" -type d -execdir sh -c "
cd {}
&& echo '===========$(basename $(pwd))==============='
&& repo_name=$(basename $(pwd))
&& git log --since='8am' --all --pretty=format:'%h - $repo_name - %an, %ar : %s'" \;

# find ./ -name ".git" -type d -execdir sh -c "cd {} && echo '===========$(basename $(pwd))===============' && repo_name=$(basename $(pwd)) && git log --since='8am' --all --pretty=format:'%h - $repo_name - %an, %ar : %s'" \;