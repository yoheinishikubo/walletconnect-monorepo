"use strict";

// updates title to display package version
updateTitle();

const WalletConnectStarkwareProvider = window.WalletConnectStarkwareProvider.default;

let provider = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onInit() {
  // Create provider
  provider = new WalletConnectStarkwareProvider();

  // Enable provider
  const accounts = await provider.enable();

  updateSessionDetails({ accounts });
}

async function updateSessionDetails({ accounts, chainId }) {
  const containerEl = document.getElementById("page-actions");
  const pTags = containerEl.getElementsByTagName("p");
  if (pTags.length === 1) {
    const textEl = containerEl.getElementsByTagName("p")[0];
    textEl.innerHTML = "Connected!";

    const accountEl = document.createElement("p");
    accountEl.innerHTML = `Account: ${accounts[0]}`;
    insertAfter(accountEl, textEl);

    const chainData = await getChainData(chainId);

    const chainEl = document.createElement("p");
    chainEl.innerHTML = `Chain: ${chainData.name}`;
    insertAfter(chainEl, accountEl);

    const buttonEl = containerEl.getElementsByTagName("button")[0];
    buttonEl.innerText = "CLICK";
    buttonEl.onclick = () => console.log("CLICK"); // eslint-disable-line
  } else {
    const accountEl = containerEl.getElementsByTagName("p")[1];
    accountEl.innerHTML = `Account: ${accounts[0]}`;

    const chainData = await getChainData(chainId);

    const chainEl = containerEl.getElementsByTagName("p")[2];
    chainEl.innerHTML = `Chain: ${chainData.name}`;
  }
}

let supportedChains = null;

async function getChainData(chainId) {
  if (!supportedChains) {
    supportedChains = await getJsonFile("./chains.json");
  }

  const chainData = supportedChains.filter(chain => chain.chain_id === chainId)[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  return chainData;
}

async function getJsonFile(path) {
  const res = await fetch(path);
  const json = await res.json();
  return json;
}

async function updateTitle() {
  const { version } = await getJsonFile("../../lerna.json");
  const title = document.getElementById("page-title");
  title.innerHTML = title.innerHTML.replace(/\sv(\w.)+.\w+/gi, "") + ` v${version}`;
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
