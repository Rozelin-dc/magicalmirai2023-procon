#!/bin/bash
set -e

base_branch="$1"
head_branch="$2"
project_root_dir=$(pwd)
target_dir="src/"
map_file_dir="id-map-data"
target_file_pattern="^.+\.((t|j)sx|svg|component\.js)$"

git fetch origin "$base_branch:refs/heads/base_branch"
git fetch origin "$head_branch:refs/heads/head_branch"

pr_number=$(jq -r .pull_request.number < "$GITHUB_EVENT_PATH")
commits=$(gh pr view "$pr_number" --json commits --jq '.commits[].oid')

echo "Fetching changed files under '$target_dir' for each commit in PR #$pr_number..."

for commit in $commits; do
  echo "Commit: $commit"

  # Find co-changed files in the target directory
  files=$(git show --pretty="" --name-only "$commit" |
    jq -R -s -c 'split("\n") | map(select(. != "")) | map(select(startswith("'"$target_dir"'")))')

  echo "  Files changed in $target_dir: $files"

  actual_files=()

  for file in $files; do
    if [[ $file =~ $target_file_pattern ]]; then
      left_tmp="/tmp/diff-left"
      right_tmp="/tmp/diff-right"
      map_file_tmp_dir="/tmp/diff-map"

      mkdir -p "$(dirname "$left_tmp/$file")"
      mkdir -p "$(dirname "$right_tmp/$file")"
      mkdir -p "$map_file_dir"

      git show base_branch:"$file" > "$left_tmp/$file"
      git show head_branch:"$file" > "$right_tmp/$file"

      echo "\n" >> "$left_tmp/$commit.tsx"
      echo "\n" >> "$right_tmp/$commit.tsx"

      cat "$left_tmp/$file" >> "$left_tmp/$commit.tsx"
      cat "$right_tmp/$file" >> "$right_tmp/$commit.tsx"

      actual_files+= ("$file")
    fi
  done

  # Do diff matching
  docker run --rm -v "$left_tmp:/diff/left" -v "$right_tmp:/diff/right" -p 4567:4567 rozelin/gumtree:latest axmldiff left/$commit.tsx right/$commit.tsx > "$map_file_tmp_dir/$commit.diff.xml"
  node ./scripts/diff-match/main.mjs --file $map_file_tmp_dir/$commit.diff.xml --multiFiles $actual_files --projectRootDir $project_root_dir --idMapDir $map_file_dir --beforeTmpDir $left_tmp --afterTmpDir $right_tmp
done
