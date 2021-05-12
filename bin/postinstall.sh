#!/bin/bash
#
# Run script after yarn install
#
# Usage
#
#   bin/postinstall.sh


# Rename ./node_modules/ts.data.json to ./node_modules/ts-data-json
#
# Why:
# Metro bundler does not properly resolve packages with the `.` character in the
# package name.
#
# Reference:
# https://github.com/facebook/metro/issues/330#issuecomment-641644390
# https://github.com/joanllenas/ts.data.json/issues/7

FILE=node_modules/ts.data.json
if [ -d "$FILE" ]; then
  echo "duplicating ts.data.json to ts-data-json"
  cp -a $FILE node_modules/ts-data-json
fi
