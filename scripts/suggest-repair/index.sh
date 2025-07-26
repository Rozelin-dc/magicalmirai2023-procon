#!/bin/bash

project_root_dir=$(pwd)
result_file_dir="$project_root_dir/result"

files=$(find $project_root_dir/e2e)

for file in $files; do
  if [ -d $file ]; then
    # If $file directory, do nothing.
    continue
  fi

  node ./scripts/suggest-repair/main.mjs --projectRootDir $project_root_dir --testFile $file --resultFileDir $result_file_dir
done
