// @ts-check
/**
 * This extension is created by Alexander Voglsperger (MrMinemeet) and is licensed under the MIT License.
 * See LICENSE file for more information or visit https://github.com/MrMinemeet/AmznShipWarn/blob/main/LICENSE
 */
console.info("Amazon Shipping Warning Extension loaded");

if (0 < document.getElementsByClassName("amzhshipwarn").length) {
	console.info("Amzshipwarn content on page detected. Extension possibly already loaded. Exiting…");
} else {
	init();
}

/**
 * Checks for non-Amazon offers and adds a warning to the page if any are found
 * @returns {void}
 */
function init() {
	// Get element of class "offer-display-feature" and "offer-display-feature-name=*fulfiller-info"
	const offerTextElementsArray = Array.from(document.getElementsByClassName("offer-display-feature-text-message"));

	// Check if the inner-html for any non-amazon "Sending" offers
	if (offerTextElementsArray == null) {
		console.debug("No offer text found!");
		return
	}
	const fulfillmentInfo = offerTextElementsArray.find((element) =>
			// FIXME: On monile the element depends on being logged in or not
			// FIXME: "Once it shows "sold and fulfilled" in one line, and once in seprarate lines
			element.tagName === "SPAN" && // Message is in a span element
			!element.innerText.toLowerCase().includes("amazon") && // Sender should not be amauon
			element.parentElement?.parentElement?.parentElement?.id.toLowerCase().includes("fulfillerinfo") // should have parent with "fulfillerInfo" in id
		);
	if (fulfillmentInfo == null) {
		console.debug("No non-Amazon offers found");
		return;
	}

	console.info("Non-Amazon offers found! Adding warning to page");
	// Insert warning in seller/shipment/… info box
	const expanderContent = document.getElementsByClassName("offer-display-features-container")[0];
	if (expanderContent) {
		// Display warning
		const warningElement = document.createElement("div");
		warningElement.className = "amzhshipwarn";
		warningElement.id = "non-amazon-warning";
		warningElement.style.backgroundColor = "#ff0000";
		warningElement.style.color = "#ffffff";
		warningElement.style.padding = "5px";
		warningElement.style.margin = "5px";
		warningElement.style.borderRadius = "5px";

		const warningText = `⚠️ ${getWarning()}`;
		warningElement.innerText = warningText;
		warningElement.title = warningText;
		expanderContent.parentElement?.insertBefore(warningElement, expanderContent);
	} else {
		console.warn("Offer box not found. Failed to add warning message")
	}

	// Add warning symbols to "Buy now" and "Add to cart" buttons
	const addToCartButton = document.getElementById("submit.add-to-cart");
	if (addToCartButton) {
		addToCartButton.textContent = `📦🚨 ${addToCartButton.textContent}`;;
	} else {
		console.warn("'Add to cart' button not found. Not able to add warning symbol");
	}
	const buyNowButton = document.getElementById("submit.buy-now");
	if (buyNowButton) {
		buyNowButton.textContent = `📦🚨 ${buyNowButton.textContent}`;
	} else {
		console.warn("'Buy now button' not found. Not able to add warning symbol");
	}
}

/**
 * Returns the warning message based on the current hostname
 * @returns {string} Warning message
 */
function getWarning() {
	switch (window.location.hostname.replace("www.", "").replace("amazon.", "")) {
		case "de":
			return "Dieses Produkt wird nicht von Amazon versendet";
		case "fr":
			return "Ce produit n'est pas expédié par Amazon";
		case "it":
			return "Questo prodotto non è spedito da Amazon";
		case "es":
		case "com.mx":
			return "Este producto no es enviado por Amazon";
		case "nl":
			return "Dit product wordt niet verzonden door Amazon";
		case "com.tr":
			return "Bu ürün Amazon tarafından gönderilmemektedir";
		case "com.br":
			return "Este produto não é enviado pela Amazon";
		case "co.jp":
			return "この商品はAmazonが発送していません";
		case "cn":
			return "此产品不由亚马逊发货";
		default:
			return "This product is not shipped by Amazon";
	}
}