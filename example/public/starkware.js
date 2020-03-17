"use strict";

// updates title to display package version
window.updateTitle();

const WalletConnectStarkwareProvider = window.WalletConnectStarkwareProvider.default;

let provider = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onInit() {
  //  Create StarkwareProvider Provider
  provider = new WalletConnectStarkwareProvider();

  //  Enable session (triggers QR Code modal)
  const accounts = await provider.enable();

  //  Get StarkKey
  const starkKey = accounts[0];
  console.log("starkKey", starkKey); // eslint-disable-line

  updateSessionDetails({ starkKey });

  provider.on("close", () => {
    // Delete provider
    provider = null;

    onDisconnect();
  });
}

async function updateSessionDetails({ starkKey }) {
  const containerEl = document.getElementById("page-actions");
  const pTags = containerEl.getElementsByTagName("p");
  if (pTags.length === 1) {
    const textEl = containerEl.getElementsByTagName("p")[0];
    textEl.innerHTML = "Connected!";

    const accountEl = document.createElement("p");
    accountEl.innerHTML = `Stark Key: ${starkKey}`;
    window.insertAfter(accountEl, textEl);
  } else {
    const accountEl = document.createElement("p");
    accountEl.innerHTML = `Stark Key: ${starkKey}`;
  }
}

async function onDisconnect() {
  const containerEl = document.getElementById("page-actions");
  const pTags = containerEl.getElementsByTagName("p");

  const textEl = containerEl.getElementsByTagName("p")[0];
  textEl.innerHTML = "Disconnected!";

  const buttonEl = containerEl.getElementsByTagName("button")[0];
  buttonEl.innerText = "Connect";
  buttonEl.onclick = onInit;
  if (pTags.length > 1) {
    const accountEl = containerEl.getElementsByTagName("p")[1];
    accountEl.remove();
  }
}
