// Decision Voting Platform - frontend logic
// Part 1: connect wallet, show wallet info
// Part 2: show session status + voting options (using getMyStatus)
// Part 3: admin panel (prepare round, eligibility, end round, reveal results)
// Part 4: participant panel (cast vote, my status)
// Part 5: results panel (getResults + getWinner)

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
  { "inputs": [], "name": "revealResults", "outputs": [], "stateMutability": "nonpayable", "type": "function" },

  // Part 4: participant functions
  { "inputs": [{ "internalType": "uint256", "name": "optionIndex", "type": "uint256" }], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "viewMyVote", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },

  // Part 5: results
  { "inputs": [], "name": "getResults", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getWinner", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }
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
// Called again after every admin/participant action to keep the page in sync.
async function refreshStatus() {
  const topic = await contract.methods.topic().call();
  const status = await contract.methods.getMyStatus().call({ from: userAddress });
  const isAdmin = status.isAdmin;
  const state = Number(status.currentState);

  document.getElementById("sessionState").textContent = STATE_LABELS[state];
  document.getElementById("sessionTopic").textContent = topic || "(no round prepared yet)";
  document.getElementById("userRole").textContent = isAdmin ? "Admin" : "Participant";

  // Fetch every option's text once, then use it for BOTH the plain list
  // and the vote radio buttons - no point calling getOptionText twice.
  const count = Number(status.optionCount);
  const optionTexts = [];
  for (let i = 0; i < count; i++) {
    optionTexts.push(await contract.methods.getOptionText(i).call());
  }

  const optionsList = document.getElementById("optionsList");
  optionsList.innerHTML = "";
  optionTexts.forEach((text, i) => {
    const li = document.createElement("li");
    li.textContent = (i + 1) + ". " + text;
    optionsList.appendChild(li);
  });

  const voteOptions = document.getElementById("voteOptions");
  voteOptions.innerHTML = "";
  optionTexts.forEach((text, i) => {
    const label = document.createElement("label");
    label.style.display = "block";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "voteOption";
    radio.value = i;
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + text));
    voteOptions.appendChild(label);
  });

  // Part 3: warnings next to admin-only / phase-restricted buttons.
  setWarning("prepareRoundWarning", !isAdmin ? "Only the Admin can prepare a round."
    : state === 1 ? "End the current round before starting a new one." : "");

  setWarning("eligibilityWarning", !isAdmin ? "Only the Admin can manage eligibility."
    : state !== 1 ? "No active round to manage eligibility for." : "");

  setWarning("endRoundWarning", !isAdmin ? "Only the Admin can end voting."
    : state !== 1 ? "Voting is not currently open." : "");

  setWarning("revealResultsWarning", !isAdmin ? "Only the Admin can reveal results."
    : state !== 2 ? "Voting must be ended before revealing results." : "");

  // Part 4: participant status + vote warning
  document.getElementById("myEligible").textContent = isAdmin ? "N/A (Admin)" : (status.isExcluded ? "No" : "Yes");
  document.getElementById("myVoted").textContent = isAdmin ? "N/A (Admin)" : (status.voted ? "Yes" : "No");

  if (!isAdmin && status.voted) {
    const choiceIndex = Number(await contract.methods.viewMyVote().call({ from: userAddress }));
    document.getElementById("myChoice").textContent = optionTexts[choiceIndex] || ("Option " + choiceIndex);
  } else {
    document.getElementById("myChoice").textContent = "-";
  }

  setWarning("submitVoteWarning", isAdmin ? "Admin is not permitted to vote."
    : state !== 1 ? "Voting is not currently open."
    : status.isExcluded ? "You are not eligible to vote in this round."
    : status.voted ? "You have already voted in this round." : "");

  // Part 5: results - only readable once revealed (contract enforces this too)
  setWarning("resultsWarning", state !== 3 ? "Results are not available until the Admin reveals them." : "");
  if (state === 3) {
    await showResults();
  } else {
    document.getElementById("resultsBody").innerHTML = "";
  }
}

// Fetches option-level counts + winning option(s) and renders the table.
// Only ever called once state is Revealed, so this matches getResults()'s
// afterReveal requirement - it would revert if called any earlier.
async function showResults() {
  const result = await contract.methods.getResults().call({ from: userAddress });
  const texts = result[0];
  const counts = result[1];
  const winners = (await contract.methods.getWinner().call({ from: userAddress })).map(Number);

  const body = document.getElementById("resultsBody");
  body.innerHTML = "";
  texts.forEach((text, i) => {
    const tr = document.createElement("tr");
    if (winners.includes(i)) tr.classList.add("winner");
    tr.innerHTML = "<td>" + text + "</td><td>" + counts[i] + "</td><td>" + (winners.includes(i) ? "Yes" : "") + "</td>";
    body.appendChild(tr);
  });
}

function setWarning(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

function extractError(err) {
  // MetaMask/Web3 errors usually nest the Solidity require() reason string
  // inside err.message - this pulls out the useful part for the alert().
  return err && err.message ? err.message : String(err);
}

// Runs the transaction as a .call() first. This executes the exact same
// contract logic WITHOUT spending gas or asking MetaMask to estimate gas.
// If the real send would revert (wrong role, wrong phase, etc.), the .call()
// throws first and we get the contract's actual require() message back -
// this is what avoids the confusing "gas limit too high" error you'd get
// from MetaMask trying to estimate gas for a transaction that can only fail.
async function sendTx(methodCall) {
  await methodCall.call({ from: userAddress });
  return methodCall.send({ from: userAddress });
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

    await sendTx(contract.methods.prepareRound(topic, options));
    document.getElementById("topicInput").value = "";
    await refreshStatus();
  } catch (err) {
    alert("Prepare round failed: " + extractError(err));
  }
});

document.getElementById("excludeBtn").addEventListener("click", async () => {
  try {
    const addr = document.getElementById("eligibilityAddress").value.trim();
    await sendTx(contract.methods.excludeParticipant(addr));
    await refreshStatus();
  } catch (err) {
    alert("Exclude failed: " + extractError(err));
  }
});

document.getElementById("reinstateBtn").addEventListener("click", async () => {
  try {
    const addr = document.getElementById("eligibilityAddress").value.trim();
    await sendTx(contract.methods.reinstateParticipant(addr));
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
    await sendTx(contract.methods.endRound());
    await refreshStatus();
  } catch (err) {
    alert("End round failed: " + extractError(err));
  }
});

document.getElementById("revealResultsBtn").addEventListener("click", async () => {
  try {
    await sendTx(contract.methods.revealResults());
    await refreshStatus();
  } catch (err) {
    alert("Reveal results failed: " + extractError(err));
  }
});

// ---- Part 4: participant panel actions ----

document.getElementById("submitVoteBtn").addEventListener("click", async () => {
  try {
    const selected = document.querySelector('input[name="voteOption"]:checked');
    if (!selected) {
      alert("Please select an option before voting.");
      return;
    }
    await sendTx(contract.methods.vote(selected.value));
    await refreshStatus();
  } catch (err) {
    alert("Vote failed: " + extractError(err));
  }
});

document.getElementById("connectBtn").addEventListener("click", connectWallet);