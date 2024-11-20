/**
 * This extension is created by Alexander Voglsperger (MrMinemeet) and is licensed under the MIT License.
 * See LICENSE.md for more information.
 */
console.debug("Amazon Shipping Warning Extension loaded");

// Get element of class "offer-display-feature" and "offer-display-feature-name=*fulfiller-info"
const offerTextElements = document.getElementsByClassName("offer-display-feature-text a-spacing-none");
const offerTextElementsArray = Array.from(offerTextElements);

// Check if the inner-html for any non-amazon "Sending" offers
const shippmentEntries = offerTextElementsArray
	.filter(element => !element.innerText.includes("Amazon") && !element.innerHTML.includes("<a href"))

if (shippmentEntries.length > 0) {
	console.info("Non-Amazon offers found! Adding warning to page");
	// Display warning
	const warningElement = document.createElement("div");
	warningElement.style = "background-color: #ff0000; color: #ffffff; padding: 5px; margin: 5px; border-radius: 5px;";
	warningElement.innerText = `⚠️ ${getWarning()}`;
	warningElement.title = `⚠️ ${getWarning()}`;

	// Insert warning in seller/shipping info
	const firstElement = shippmentEntries[0];
	firstElement.parentNode.insertBefore(warningElement, firstElement);

	// Add warning symbols to "Buy now" and "Add to cart" buttons
	const buyNowButton = document.getElementById("submit.buy-now-announce");
	const addToCartButton = document.getElementById("submit.add-to-cart-announce");
	if (addToCartButton) {
		addToCartButton.textContent = `📦🚨 ${addToCartButton.textContent}`;
	}
	if (buyNowButton) {
		buyNowButton.textContent = `📦🚨 ${buyNowButton.textContent}`;
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
		// TODO: Add more countries based on the Amazon TLD
		default:
			return "This product is not shipped by Amazon";
	}
}