#!/bin/bash

tool_root_dir="./scripts"

project_root_dir=".."
# Directory where you want to store the mapping data (relative path from project_root_dir).
map_file_dir="$project_root_dir/id-map-data"

cd $tool_root_dir


files=$(find $project_root_dir/ui)
target_file_pattern="^.+\.((t|j)sx|svg|component\.js)$"

max_jobs=4
job_count=0
for file in $files; do
  if [ -d $file ]; then
    # If $file directory, do nothing.
    continue
  fi

  if [[ $file =~ $target_file_pattern ]]; then
    # If $file is TSX, JSX, or SVG file, do ID embedding.
    node ./id-embedding/main.mjs --file $file --projectRootDir $project_root_dir --mapFileDir $map_file_dir &
    ((job_count++))

    if ((job_count >= max_jobs)); then
      wait
      job_count=0
    fi
  fi
done

wait
echo "Finish ID-embedding."
