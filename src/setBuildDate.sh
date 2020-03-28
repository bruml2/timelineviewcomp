#! /bin/bash

# put build date in file for App.vue;
CURRDATE=`date "+%a %b %d %Y - %T"`
echo "export const builddate = \"$CURRDATE\"" > src/assets/builddate.js
