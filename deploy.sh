#!/usr/bin/env bash

# abort (exit) on errors; built-in cmd (see man bash);
set -e

# put build date in file for App.vue;
CURRDATE=`date "+%a %b %d %Y - %T"`
echo "export const builddate = \"$CURRDATE\"" > src/assets/builddate.js

# put publicPath for bruml2/github.io build in vue.config.js (temporarily);
echo "module.exports = { publicPath: \"/studioTimelineView/\" }" > vue.config.js
echo -e "\033[1;31m  ==> vue.config.js is: \"`cat vue.config.js`\"\033[0m"

# build
npm run build

# restore original state: default publicPath and "date not set";
rm vue.config.js
echo "export const builddate = \"date not set\"" > src/assets/builddate.js
echo -e "\033[1;31m  Built! \033[0m"

# for delivery at localhost/studioTimelineView;
rm -r /Library/WebServer/Documents/studioTimelineView/*
cp -r dist/* /Library/WebServer/Documents/studioTimelineView
echo -e "\033[1;31m  Copied to WebServer root subdir studioTimelineView\033[0m"

# copy to serve on localhost and to upload from rumlcomrepo
#  ==> needs to have "vue": { "publicPath": "/timelines/app/" }
#      in package.json
#  rm -rf /Library/WebServer/Documents/timelines/app/*
#  cp -r dist/* /Library/WebServer/Documents/timelines/app/

#  rm -rf /Library/WebServer/Documents/rumlcomrepo/timelines/app/*
#  cp -r dist/* /Library/WebServer/Documents/rumlcomrepo/timelines/app/

#  echo "Copied! and done"
#  exit

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# make a repo to push the dist to github!!
cd dist
git init
git add -A
git commit -m 'deploy'
echo -e "\033[1;31m  Commited to new repo in dist \033[0m"

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
#   git push  <REMOTENAME> <LOCALBRANCHNAME>:<REMOTEBRANCHNAME> 
# This pushes the LOCALBRANCHNAME to your REMOTENAME, but it is renamed to REMOTEBRANCHNAME.
git remote add origin https://github.com/bruml2/studioTimelineView.git
git push -f origin master:gh-pages
echo -e "\033[1;31m  Pushed to gh-pages branch of origin \033[0m"

# an aside: deleting a remote branch:
#   git push  <REMOTENAME> :<BRANCHNAME> 
# Note that there is a space before the colon. You're telling Git to push nothing into
# BRANCHNAME on REMOTENAME, so git push deletes the branch on the remote repository.

# return to previous directory
cd -
