#!/bin/bash

tool_root_dir="./scripts"

project_root_dir=".."
# Directory where you want to store the mapping data (relative path from project_root_dir).
map_file_dir="$project_root_dir/id-map-data"


cd $project_root_dir

# Receives a relative path of a file name as the first argument and performs a structural match as needed.
diff_match() {
  file=$1
  target_file_pattern="^.+\.((t|j)sx|svg|component\.js)$"

  if [ -d $file ]; then
    return 0
  fi

  if [[ $file =~ $target_file_pattern ]]; then
    file_path=${file#./}
    map_file_path=${project_root_dir%/}${map_file_dir%/}/$file_path

    # If $file is TSX, JSX, or SVG file, do diff match.
    git config --local difftool.gumtree-docker.cmd "docker run -v \$REMOTE:/diff/left -v \$LOCAL:/diff/right -p 4567:4567 rozelin/gumtree:latest axmldiff left/$file_path right/$file_path"
    git difftool -d --no-symlinks -t gumtree-docker @{u} > $map_file_path.diff.xml

    cd $tool_root_dir
    node ./diff-match/main.mjs --file $map_file_path
    cd $project_root_dir
  fi
}

set -e

base_branch="$1"
head_branch="$2"
target_dir="ui/"

git fetch origin "$base_branch":"origin/$base_branch"
git fetch origin "$head_branch":"origin/$head_branch"

files=$(git diff --name-only origin/"$base_branch"..origin/"$head_branch" | grep "^$target_dir")

max_jobs=4
job_count=0

for file in $files; do
  diff_match "$file" &
  ((job_count++))

  if ((job_count >= max_jobs)); then
    wait
    job_count=0
  fi
done

wait
echo "Finish diff-match."
