/**
 * This extension is created by Alexander Voglsperger (MrMinemeet) and is licensed under the MIT License.
 * See LICENSE file for more information or visit https://github.com/MrMinemeet/AmznShipWarn/blob/main/LICENSE
 */

const isFirefox = typeof (browser) !== "undefined"
	&& browser.runtime.getURL("").startsWith("moz-extension://");

const isChrome = typeof (chrome) !== "undefined"
	&& chrome.runtime.getURL("").startsWith("chrome-extension://");

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("rateItem")
		.addEventListener("click", rateExtension);

	if (isFirefox) {
		document.getElementById("version-display").textContent = browser.runtime.getManifest().version;
	} else if (isChrome) {
		document.getElementById("version-display").textContent = chrome.runtime.getManifest().version;
	} else {
		document.getElementById("version-display").textContent = "unknown";
	}
});

function rateExtension() {
	if (isFirefox) {
		browser.tabs.create({ url: "https://addons.mozilla.org/de/firefox/addon/amznshipwarn/" });
	} else if (isChrome) {
		chrome.tabs.create({ url: "https://chromewebstore.google.com/detail/amznshipwarn/hlechooecihfmncfdhdjjhkdpmojmllm" });
	} else {
		console.debug("Browser could not be detected, opening GitHub page.");
		chrome.tabs.create({ url: "https://github.com/MrMinemeet/AmznShipWarn" });
	}
}

