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
group_keys=()

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
  for i in "${!group_keys[@]}"; do
    for file in "${current_files[@]}"; do
      if [[ " ${group_keys[$i]} " == *" $file "* ]]; then
        matched_group_index=$i
        break 2
      fi
    done
  done

  if [ -z "$matched_group_index" ]; then
    actual_file_groups+=("$(IFS=" "; echo "${current_files[*]}")")
    group_keys+=("$(IFS=" "; echo "${current_files[*]}")")
  else
    existing=(${group_keys[$matched_group_index]})
    merged=("${existing[@]}")
    for file in "${current_files[@]}"; do
      if [[ ! " ${existing[*]} " =~ " $file " ]]; then
        merged+=("$file")
      fi
    done
    group_keys[$matched_group_index]="$(IFS=" "; echo "${merged[*]}")"
    actual_file_groups[$matched_group_index]="${group_keys[$matched_group_index]}"
  fi
done

echo "Found ${#actual_file_groups[@]} groups of files to process."

for i in "${!actual_file_groups[@]}"; do
  group_files=(${actual_file_groups[$i]})
  echo "Processing group $i: ${group_files[*]}"

  tmp_id="group_$i"

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
  done

  # Do diff matching
  docker run --rm -v "$after_tmp:/diff/left" -v "$before_tmp:/diff/right" -p 4567:4567 rozelin/gumtree:latest axmldiff left/$tmp_id.tsx right/$tmp_id.tsx > "$map_file_tmp_dir/$tmp_id.diff.xml"
  node ./scripts/diff-match/for-multi.mjs --file $map_file_tmp_dir/$tmp_id.diff.xml --multiFiles "${group_files[@]}" --projectRootDir $project_root_dir --idMapDir $map_file_dir --beforeTmpDir $before_tmp --afterTmpDir $after_tmp
done
