#!/bin/sh
set -xe

externally_passed_git_hash=$1

build () {
  local git_hash=$1
  mkdir -p phonegap_dist
  tar -czf phonegap_dist/phonegap-${git_hash}.tar.gz  --exclude-from=tar-exclude .
}

upload () {
  local git_hash=$1
  local result_file=phonegap_dist/phonegap-${git_hash}.tar.gz

  local url="${BINARY_REPOSITORY_URL}/component-builds/phonegap-$git_hash.tar.gz"

  curl --fail -i -u"${BINARY_REPOSITORY_CREDENTIALS}" -T "${result_file}" "${url}"

  rm $result_file
}

git_is_clean () {
  if [ -n "$externally_passed_git_hash" ]; then
    return 0
  else
    git status
    git diff-index --exit-code HEAD
  fi
}

git_hash=$externally_passed_git_hash
if [ -z "$externally_passed_git_hash" ]; then
  git_hash=$(git rev-parse HEAD)
fi

build "$git_hash" && git_is_clean && upload "$git_hash"
