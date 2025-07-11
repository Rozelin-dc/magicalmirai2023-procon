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

actual_file_groups=()

for commit in $commits; do
  echo "Commit: $commit"

  # Find co-changed files in the target directory
  files=$(git show --pretty="" --name-only "$commit" |
    jq -R -s -c 'split("\n") | map(select(. != "")) | map(select(startswith("'"$target_dir"'")))')

  echo "  Files changed in $target_dir: $files"

  current_files=()
  for file in $files; do
    if [[ $file =~ $target_file_pattern ]]; then
      current_files+=("$file")
    fi
  done

  if [ "${#current_files[@]}" -eq 0 ]; then
    continue
  fi

  matched_group_index=""
  for i in "${!actual_file_groups[@]}"; do
    group_files=(${actual_file_groups[$i]})
    for file in "${current_files[@]}"; do
      if [[ "$group_files" == *"$file"* ]]; then
        matched_group_index=$i
        break 2
      fi
    done
  done

  if [ -n "$matched_group_index" ]; then
    echo "  Adding files to existing group $matched_group_index"
    actual_file_groups[$matched_group_index]+=" ${current_files[*]}"
  else
    echo "  Creating new group for files: ${current_files[*]}"
    actual_file_groups+=("$(IFS=' '; echo "${current_files[*]}")")
  fi
done

echo "Found ${#actual_file_groups[@]} groups of files to process."

for i in "${!actual_file_groups[@]}"; do
  group_files=(${actual_file_groups[$i]})
  echo "Processing group $i: ${group_files[*]}"

  tmp_id="group_$i"

  actual_files=()

  for file in "${group_files[@]}"; do
    mkdir -p "$(dirname "$before_tmp/$file")"
    mkdir -p "$(dirname "$after_tmp/$file")"
    mkdir -p "$map_file_tmp_dir"

    git show base_branch:"$file" > "$before_tmp/$file"
    git show head_branch:"$file" > "$after_tmp/$file"

    printf '\n' >> "$before_tmp/$tmp_id.tsx"
    printf '\n' >> "$after_tmp/$tmp_id.tsx"

    cat "$before_tmp/$file" >> "$before_tmp/$tmp_id.tsx"
    cat "$after_tmp/$file" >> "$after_tmp/$tmp_id.tsx"

    actual_files+=("$file")
  done

  # Do diff matching
  docker run --rm -v "$after_tmp:/diff/left" -v "$before_tmp:/diff/right" -p 4567:4567 rozelin/gumtree:latest axmldiff left/$tmp_id.tsx right/$tmp_id.tsx > "$map_file_tmp_dir/$tmp_id.diff.xml"
  node ./scripts/diff-match/for-multi.mjs --file $map_file_tmp_dir/$tmp_id.diff.xml --multiFiles $actual_files --projectRootDir $project_root_dir --idMapDir $map_file_dir --beforeTmpDir $before_tmp --afterTmpDir $after_tmp
done
