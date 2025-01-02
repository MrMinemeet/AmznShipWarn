#!/bin/sh

CLOSURE_COMPILER_PATH="./closure-compiler.jar"

fetch_closure_compiler() {
	# Fetch the latest version of the closure compiler
	latest_version=$(curl -s https://repo1.maven.org/maven2/com/google/javascript/closure-compiler/ | grep -oP '(?<=href=")[^"]*(?=/)' | sort -V | tail -n 1)
	# Download and rename the closure compiler
	wget https://repo1.maven.org/maven2/com/google/javascript/closure-compiler/$latest_version/closure-compiler-$latest_version.jar -O $CLOSURE_COMPILER_PATH

	# Verify the checksum of closure compiler with the checksum file
	expected_sha512=$(curl -s https://repo1.maven.org/maven2/com/google/javascript/closure-compiler/$latest_version/closure-compiler-$latest_version.jar.sha512)
	computed_sha512=$(sha512sum $CLOSURE_COMPILER_PATH | cut -d ' ' -f 1)

	if [ "$computed_sha512" != "$expected_sha512" ]; then
		echo "Checksum verification failed!"
		exit 1
	else
		echo "Checksum verification passed!"
	fi
}

# Check if "closure-compiler.jar" exists
if [ ! -f "$CLOSURE_COMPILER_PATH" ]; then
	echo "closure-compiler.jar not found. Downloading..."
	fetch_closure_compiler
fi


# This script minifies and then packs up necessary files into a .zip for publishing
java -jar $CLOSURE_COMPILER_PATH -O ADVANCED --js amznshipwarn.js --js_output_file amznshipwarn.min.js --language_out=ECMASCRIPT_2019


rm ./AmznShipWarn.zip
zip ./AmznShipWarn.zip amznshipwarn.min.js LICENSE manifest.json

# Unminified version for AMO submission
rm ./AmznShipWarn_non_minified.zip
zip ./AmznShipWarn_non_minified.zip amznshipwarn.js README.md LICENSE manifest.json > /dev/null