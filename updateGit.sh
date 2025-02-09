#!/bin/bash

CURRENTDATE=`date +"%Y-%m-%d %T"`

git add --all
git commit -m "UK Update: ${CURRENTDATE}"
git push

echo "update to bitbucket done: ${CURRENTDATE}"
