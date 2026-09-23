// Decision Voting Platform - frontend logic
// Part 1: connect wallet, show wallet info
// Part 2: show session status + voting options (using getMyStatus)
// Part 3: admin panel (prepare round, eligibility, end round, reveal results)

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
  },

  // Part 3: admin functions
  { "inputs": [{ "internalType": "string", "name": "_topic", "type": "string" }, { "internalType": "string[]", "name": "_options", "type": "string[]" }], "name": "prepareRound", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "participant", "type": "address" }], "name": "excludeParticipant", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "participant", "type": "address" }], "name": "reinstateParticipant", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getExcludedList", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "participant", "type": "address" }], "name": "getParticipantStatus", "outputs": [{ "internalType": "bool", "name": "isExcluded", "type": "bool" }, { "internalType": "bool", "name": "voted", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "endRound", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "revealResults", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
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

  // Part 3: warnings next to admin-only / phase-restricted buttons.
  // The contract enforces these rules regardless - this is just so the
  // user isn't left guessing why a button didn't do anything.
  const isAdmin = status.isAdmin;
  const state = Number(status.currentState);

  setWarning("prepareRoundWarning", !isAdmin ? "Only the Admin can prepare a round."
    : state === 1 ? "End the current round before starting a new one." : "");

  setWarning("eligibilityWarning", !isAdmin ? "Only the Admin can manage eligibility."
    : state !== 1 ? "No active round to manage eligibility for." : "");

  setWarning("endRoundWarning", !isAdmin ? "Only the Admin can end voting."
    : state !== 1 ? "Voting is not currently open." : "");

  setWarning("revealResultsWarning", !isAdmin ? "Only the Admin can reveal results."
    : state !== 2 ? "Voting must be ended before revealing results." : "");

  // TODO Part 4: use status.isExcluded / status.voted to drive the
  // participant panel and its warnings once they exist in the HTML.
}

function setWarning(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

function extractError(err) {
  // MetaMask/Web3 errors usually nest the Solidity require() reason string
  // inside err.message - this pulls out the useful part for the alert().
  return err && err.message ? err.message : String(err);
}

// ---- Part 3: admin panel actions ----

document.getElementById("addOptionBtn").addEventListener("click", () => {
  const container = document.getElementById("optionInputs");
  const input = document.createElement("input");
  input.type = "text";
  input.className = "optionField";
  input.placeholder = "Option " + (container.children.length + 1);
  container.appendChild(input);
});

document.getElementById("prepareRoundBtn").addEventListener("click", async () => {
  try {
    const topic = document.getElementById("topicInput").value.trim();
    const options = Array.from(document.querySelectorAll(".optionField"))
      .map(el => el.value.trim())
      .filter(v => v.length > 0);

    await contract.methods.prepareRound(topic, options).send({ from: userAddress });
    document.getElementById("topicInput").value = "";
    await refreshStatus();
  } catch (err) {
    alert("Prepare round failed: " + extractError(err));
  }
});

document.getElementById("excludeBtn").addEventListener("click", async () => {
  try {
    const addr = document.getElementById("eligibilityAddress").value.trim();
    await contract.methods.excludeParticipant(addr).send({ from: userAddress });
    await refreshStatus();
  } catch (err) {
    alert("Exclude failed: " + extractError(err));
  }
});

document.getElementById("reinstateBtn").addEventListener("click", async () => {
  try {
    const addr = document.getElementById("eligibilityAddress").value.trim();
    await contract.methods.reinstateParticipant(addr).send({ from: userAddress });
    await refreshStatus();
  } catch (err) {
    alert("Reinstate failed: " + extractError(err));
  }
});

document.getElementById("viewExcludedBtn").addEventListener("click", async () => {
  try {
    const list = await contract.methods.getExcludedList().call({ from: userAddress });
    const ul = document.getElementById("excludedList");
    ul.innerHTML = "";
    if (list.length === 0) {
      ul.innerHTML = "<li>No excluded participants for this round.</li>";
    }
    list.forEach(addr => {
      const li = document.createElement("li");
      li.textContent = addr;
      ul.appendChild(li);
    });
  } catch (err) {
    alert("Could not load excluded list: " + extractError(err));
  }
});

document.getElementById("checkStatusBtn").addEventListener("click", async () => {
  try {
    const addr = document.getElementById("statusAddress").value.trim();
    const result = await contract.methods.getParticipantStatus(addr).call({ from: userAddress });
    document.getElementById("statusResult").textContent =
      "Eligible: " + (result.isExcluded ? "No" : "Yes") + " | Voted: " + (result.voted ? "Yes" : "No");
  } catch (err) {
    document.getElementById("statusResult").textContent = "Could not check status: " + extractError(err);
  }
});

document.getElementById("endRoundBtn").addEventListener("click", async () => {
  try {
    await contract.methods.endRound().send({ from: userAddress });
    await refreshStatus();
  } catch (err) {
    alert("End round failed: " + extractError(err));
  }
});

document.getElementById("revealResultsBtn").addEventListener("click", async () => {
  try {
    await contract.methods.revealResults().send({ from: userAddress });
    await refreshStatus();
  } catch (err) {
    alert("Reveal results failed: " + extractError(err));
  }
});

document.getElementById("connectBtn").addEventListener("click", connectWallet);