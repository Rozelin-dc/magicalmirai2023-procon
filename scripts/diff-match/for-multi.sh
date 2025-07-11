#!/bin/bash
set -e

base_branch="$1"
head_branch="$2"
project_root_dir=$(pwd)
target_dir="src/"
map_file_dir="id-map-data"
target_file_pattern="^.+\.((t|j)sx|svg|component\.js)$"

before_tmp="/tmp/diff-before"
after_tmp="/tmp/diff-after"
map_file_tmp_dir="/tmp/diff-map"

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
      mkdir -p "$(dirname "$before_tmp/$file")"
      mkdir -p "$(dirname "$after_tmp/$file")"
      mkdir -p "$map_file_tmp_dir"

      git show base_branch:"$file" > "$before_tmp/$file"
      git show head_branch:"$file" > "$after_tmp/$file"

      echo "\n" >> "$before_tmp/$commit.tsx"
      echo "\n" >> "$after_tmp/$commit.tsx"

      cat "$before_tmp/$file" >> "$before_tmp/$commit.tsx"
      cat "$after_tmp/$file" >> "$after_tmp/$commit.tsx"

      actual_files+=("$file")
    fi
  done

  if [ "${#actual_files[@]}" -ge 2 ]; then
    # Do diff matching
    docker run --rm -v "$after_tmp:/diff/left" -v "$before_tmp:/diff/right" -p 4567:4567 rozelin/gumtree:latest axmldiff left/$commit.tsx right/$commit.tsx > "$map_file_tmp_dir/$commit.diff.xml"
    node ./scripts/diff-match/for-multi.mjs --file $map_file_tmp_dir/$commit.diff.xml --multiFiles $actual_files --projectRootDir $project_root_dir --idMapDir $map_file_dir --beforeTmpDir $before_tmp --afterTmpDir $after_tmp
  fi
done
