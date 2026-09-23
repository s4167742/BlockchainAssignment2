// Decision Voting Platform - frontend logic
// Part 1: connect wallet, show wallet info
// Part 2: show session status + voting options (using getMyStatus)

// TODO: paste the deployed contract address here after deploying in Remix
const CONTRACT_ADDRESS = "PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";

// ABI only needs entries for what the contract has so far.
const CONTRACT_ABI = [
  { "inputs": [], "name": "topic", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getOptionText", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [], "name": "getMyStatus", "stateMutability": "view", "type": "function",
    "outputs": [
      { "internalType": "enum VotingPlatform.VotingState", "name": "currentState", "type": "uint8" },
      { "internalType": "bool", "name": "isAdmin", "type": "bool" },
      { "internalType": "bool", "name": "isExcluded", "type": "bool" },
      { "internalType": "bool", "name": "voted", "type": "bool" },
      { "internalType": "uint256", "name": "optionCount", "type": "uint256" }
    ]
  }
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
  await refreshStatus();
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

// One call gives us everything about this wallet + the round.
// We'll call this again after every admin/participant action later on,
// so the page always reflects the latest on-chain state.
async function refreshStatus() {
  const topic = await contract.methods.topic().call();
  const status = await contract.methods.getMyStatus().call({ from: userAddress });

  document.getElementById("sessionState").textContent = STATE_LABELS[status.currentState];
  document.getElementById("sessionTopic").textContent = topic || "(no round prepared yet)";
  document.getElementById("userRole").textContent = status.isAdmin ? "Admin" : "Participant";

  // Load each option's text (one call per option - fine for a small list)
  const optionsList = document.getElementById("optionsList");
  optionsList.innerHTML = "";
  const count = Number(status.optionCount);
  for (let i = 0; i < count; i++) {
    const text = await contract.methods.getOptionText(i).call();
    const li = document.createElement("li");
    li.textContent = (i + 1) + ". " + text;
    optionsList.appendChild(li);
  }

  // TODO Part 3: use status.isExcluded / status.voted to drive the
  // participant panel and warnings once they exist in the HTML.
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);