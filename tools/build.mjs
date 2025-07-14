// @ts-check
/*
 * This script minifies the extension code using the Google Closure Compiler,
 * and then puts the necessary files into a ZIP archive for distribution.
 */
import * as fs from "node:fs";
import * as path from "path";
import archiver from "archiver";
import closureCompiler from "google-closure-compiler";
const { compiler } = closureCompiler;

const SOURCE_FILE = path.join(".", "amznshipwarn.js");
const MINIFIED_FILE = path.join(".", "tmp", "amznshipwarn.min.js");
// Additional files bundled in the ZIP archive
const ADDITIONAL_ZIP_FILES = [
	path.join(".", "manifest.json"),
	path.join(".", "popup.html"),
	path.join(".", "popup.css"),
	path.join(".", "popup.js"),
	path.join(".", "LICENSE"),
	path.join(".", "icons")
];

const OUT_FOLDER = path.join(".", "out");
const RELEASE_ZIP_FILE = path.join(OUT_FOLDER, "AmznShipWarn.zip");
const AMO_ZIP_FILE = path.join(OUT_FOLDER, "AmznShipWarn_non_minified.zip");

/**
 * Minifies the given file using the Google Closure Compiler
 * @param {string} srcFile Path to the source file
 * @param {string} destFile Path to the destination file
 * @return {Promise<string>} A promise that resolves when the file has been minified
 */
async function minify(srcFile, destFile) {
	return new Promise((resolve, reject) => {
		new compiler({
			js: srcFile,
			compilation_level: "ADVANCED",
			language_out: "ECMASCRIPT_2020",
			js_output_file: destFile
		}).run((exitCode, stdOut, stdErr) => {
			if (exitCode) {
				reject(`Failed to minify ${srcFile}: ${stdErr}`);
			} else {
				resolve(`Minified ${srcFile} to ${destFile}`);
			}
		});
	});
}

/**
 * Creates a ZIP archive containing the given files
 * @param {string[]} sources List of files/folders to include in the ZIP archive
 * @param {string} targetFile Where to write the ZIP archive
 * @returns {Promise<string>}
 */
async function zipFiles(sources, targetFile) {
	return new Promise((resolve, reject) => {
		const output = fs.createWriteStream(targetFile);
		const archive = archiver("zip", { zlib: { level: 9 } });

		output.on("close", () => resolve(`ZIP archive written to ${targetFile}`));
		output.on("error", reject);

		archive.pipe(output);

		for (const src of sources) {
			if (fs.statSync(src).isDirectory()) {
				archive.directory(src, path.basename(src));
			} else {
				archive.file(src, { name: path.basename(src) });
			}
		}

		archive.finalize();
	});
}

// Ensure out folder
if (!fs.existsSync(OUT_FOLDER)) {
	fs.mkdirSync(OUT_FOLDER);
}

// Minify the extension code
minify(SOURCE_FILE, MINIFIED_FILE)
	.then(() => zipFiles([MINIFIED_FILE, ...ADDITIONAL_ZIP_FILES], RELEASE_ZIP_FILE))
	.then(console.log)
	.catch(console.error);

// Create a ZIP archive without minifying the extension code for AMO review
zipFiles([MINIFIED_FILE, ...ADDITIONAL_ZIP_FILES], AMO_ZIP_FILE)
	.then(console.log)
	.catch(console.error);

