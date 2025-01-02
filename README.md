# AmznShipWarn
A browser extension that adds a warning to the Amazon page, if the item is not shipped by Amazon directly

## How to install
### Firefox 🦊
For Firefox, you can directly get the extension from the offical Add-On page.  
[![Firefox-Extension](./get-the-addon-small.png)](https://addons.mozilla.org/firefox/addon/amznshipwarn/)

### Chrome 🔵🔴🟡🟢
As Google demands a 5€ fee to become a Chrome Extension Developer, I will not publish the extension on the Chrome Web Store.  
However, you can still install the extension manually:
1. Download the latest `.zip` from the [releases page](https://github.com/MrMinemeet/AmznShipWarn/releases)
2. In Chrome, go to `chrome://extensions/` and enable Developer Mode
3. Drag and drop the `.zip` file into the Chrome window

You won't get automatic updates, but you can watch this repository to get notified about new releases.

## How does it work?
The exension checks the page for the text that holds the shipping information. If the text contains the word "Amazon", the extension does nothing. If the text does not contain the word "Amazon", the extension adds a warning to the page. In order to get the user's attention and make them aware of potential shipping costs.

## Currently supported Amazon sites
The following Amazon sites are currently supported, but not every site has been tested.
Furthermore, not every site has it's own translation for the warning message.

- amazon.com
- amazon.co.uk
- amazon.ca
- amazon.com.au
- amazon.de
- amazon.fr
- amazon.it
- amazon.es
- amazon.nl
- amazon.com.br
- amazon.in
- amazon.co.jp
- amazon.cn
- amazon.com.mx
- amazon.sa
- amazon.eg
- amazon.sg
- amazon.com.tr

## External Dependencies
The extension is minified using the [Google Closure Compiler](https://github.com/google/closure-compiler).
