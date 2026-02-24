// @ts-check
/*
 * This script minifies the extension code using the Google Closure Compiler,
 * and then puts the necessary files into a ZIP archive for distribution.
 */
import * as fs from "node:fs";
import * as path from "path";
import { zip } from "fflate";
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
 * Recursively collects files from a directory into an fflate-compatible map
 * @param {string} dirPath
 * @param {string} prefix
 * @param {Record<string, Uint8Array>} result
 */
function collectDir(dirPath, prefix, result) {
	for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
		const fullPath = path.join(dirPath, entry.name);
		const zipPath = prefix + "/" + entry.name;
		if (entry.isDirectory()) {
			collectDir(fullPath, zipPath, result);
		} else {
			result[zipPath] = fs.readFileSync(fullPath);
		}
	}
}

/**
 * Creates a ZIP archive containing the given files
 * @param {string[]} sources List of files/folders to include in the ZIP archive
 * @param {string} targetFile Where to write the ZIP archive
 * @returns {Promise<string>}
 */
async function zipFiles(sources, targetFile) {
	/** @type {Record<string, Uint8Array>} */
	const files = {};
	for (const src of sources) {
		if (fs.statSync(src).isDirectory()) {
			collectDir(src, path.basename(src), files);
		} else {
			files[path.basename(src)] = fs.readFileSync(src);
		}
	}
	return new Promise((resolve, reject) => {
		zip(files, { level: 9 }, (err, data) => {
			if (err) return reject(err);
			fs.writeFile(targetFile, data, (writeErr) => {
				if (writeErr) reject(writeErr);
				else resolve(`ZIP archive written to ${targetFile}`);
			});
		});
	});
}

// Ensure out and tmp folders exist
const TMP_FOLDER = path.join(".", "tmp");
for (const dir of [OUT_FOLDER, TMP_FOLDER]) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

// Minify, then create both ZIP archives
minify(SOURCE_FILE, MINIFIED_FILE)
	.then(() => Promise.all([
		zipFiles([MINIFIED_FILE, ...ADDITIONAL_ZIP_FILES], RELEASE_ZIP_FILE),
		zipFiles([MINIFIED_FILE, ...ADDITIONAL_ZIP_FILES], AMO_ZIP_FILE),
	]))
	.then(msgs => msgs.forEach(m => console.log(m)))
	.catch(console.error);

