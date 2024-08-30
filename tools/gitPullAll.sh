#!/bin/bash
for branch in $(git branch --all | grep '^\s*remotes' | grep --invert-match '(:?HEAD|master)$'); do
  git checkout "$branch"
  git pull
done