# Proxy Surfer

Proxy Surfer is a Chrome extension that allows you to manage and use HTTP proxies easily. You can fetch the latest proxy list, start a proxy, and disconnect from a proxy directly from the extension's popup interface.

## Features

- Fetch the latest proxy list from ProxyScrape
- Start a proxy from the list
- Disconnect from the current proxy
- Display the current proxy status

## Installation

1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/MotoAcidic/Proxy-Surfer.git
    cd proxy-loader
    ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click on the "Load unpacked" button and select the directory where you cloned the repository.

## Usage

1. Click on the Proxy Surfer extension icon in the Chrome toolbar to open the popup.

2. Use the buttons in the popup to manage proxies:
    - **Fetch Latest Proxy List**: Fetches the latest proxy list from ProxyScrape and displays it in the popup.
    - **Start Proxy**: Starts a random proxy from the list.
    - **Start with Intervals**: Starts proxies at regular intervals (feature to be implemented).
    - **Set Next Proxy**: Sets the next proxy in the list (feature to be implemented).
    - **Disconnect Proxy**: Disconnects the current proxy.

3. The status section in the popup will display the current proxy status and any relevant messages.

## Files

- `background.js`: Handles background tasks such as applying and disconnecting proxies.
- `popup.js`: Manages the popup interface and interactions with the background script.
- `popup.html`: The HTML file for the popup interface.
- `default_proxies.json`: A default list of proxies.
- `manifest.json`: The Chrome extension manifest file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.