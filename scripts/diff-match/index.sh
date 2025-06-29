#!/bin/bash

project_root_dir=$(pwd)
# Directory where you want to store the mapping data (relative path from project_root_dir).
map_file_dir="id-map-data"

# Receives a relative path of a file name as the first argument and performs a structural match as needed.
diff_match() {
  file=$1
  target_file_pattern="^.+\.((t|j)sx|svg|component\.js)$"

  if [ -d $file ]; then
    return 0
  fi

  if [[ $file =~ $target_file_pattern ]]; then
    file_path=${file#./}
    map_file_path=${project_root_dir%/}/${map_file_dir%/}/$file_path

    echo "Processing file: $file_path, map file: $map_file_path"

    left_tmp="/tmp/diff-left"
    right_tmp="/tmp/diff-right"

    mkdir -p "$(dirname "$left_tmp/$file_path")"
    mkdir -p "$(dirname "$right_tmp/$file_path")"

    git show base_branch:"$file" > "$left_tmp/$file_path"
    git show head_branch:"$file" > "$right_tmp/$file_path"

    # If $file is TSX, JSX, or SVG file, do diff match.
    docker run -v $left_temp:/diff/left -v $right_temp:/diff/right -p 4567:4567 rozelin/gumtree:latest axmldiff left/$file_path right/$file_path > "$map_file_path.diff.xml"

    node ./scripts/diff-match/main.mjs --file $map_file_path
  fi
}

set -e

base_branch="$1"
head_branch="$2"
target_dir="src/"

git fetch origin "$base_branch:refs/heads/base_branch"
git fetch origin "$head_branch:refs/heads/head_branch"

files=$(git diff --name-only base_branch..head_branch | grep "^$target_dir")

for file in $files; do
  diff_match "$file"
done

echo "Finish diff-match."
