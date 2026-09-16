
// Decision Voting Platform - frontend logic
// Part 1: connect wallet, show wallet info, show basic session info


// TODO: paste the deployed contract address here after deploying in Remix
const CONTRACT_ADDRESS = "PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";

// ABI only needs entries for what the contract has so far.
// admin, state and topic are "public" variables, so Solidity auto-generates
// a getter function for each - that's why they appear here even though we
// never wrote an "admin()" function ourselves.
const CONTRACT_ABI = [
  { "inputs": [], "name": "admin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "state", "outputs": [{ "internalType": "enum VotingPlatform.VotingState", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "topic", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
];

// Matches the VotingState enum order in the contract
const STATE_LABELS = ["Not started", "Voting open", "Voting ended", "Results revealed"];

let web3;
let contract;
let userAddress;

// Connect MetaMask and load the contract
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed.");
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  userAddress = accounts[0];

  web3 = new Web3(window.ethereum);
  contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  document.getElementById("connectBtn").textContent = "Connected";

  await showWalletInfo();
  await showSessionInfo();
}

// Show the connected wallet's address, network and balance
async function showWalletInfo() {
  const balanceWei = await web3.eth.getBalance(userAddress);
  const balanceEth = web3.utils.fromWei(balanceWei, "ether");
  const chainId = await web3.eth.getChainId();
  const network = chainId === 11155111 ? "Sepolia" : "Chain ID " + chainId;

  document.getElementById("walletAddress").textContent = userAddress;
  document.getElementById("walletNetwork").textContent = network;
  document.getElementById("walletBalance").textContent = balanceEth + " ETH";
}

// Show admin address, current phase and topic (only what the contract exposes so far)
async function showSessionInfo() {
  const admin = await contract.methods.admin().call();
  const state = await contract.methods.state().call();
  const topic = await contract.methods.topic().call();

  document.getElementById("adminAddress").textContent = admin;
  document.getElementById("sessionState").textContent = STATE_LABELS[state];
  document.getElementById("sessionTopic").textContent = topic || "(no round prepared yet)";
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);
