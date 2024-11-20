#!/bin/sh

# This script minifies and then packs up necessary files into a .zip for publishing
java -jar ./closure-compiler.jar -O ADVANCED --js amznshipwarn.js --js_output_file amznshipwarn.min.js --language_out=ECMASCRIPT_2019

zip AmznShipWarn.zip amznshipwarn.min.js LICENSE manifest.json