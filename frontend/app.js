const web3 = new Web3(window.ethereum);
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "ParticipantExcluded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "ParticipantReinstated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "ResultsRevealed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalVotesCast",
        "type": "uint256"
      }
    ],
    "name": "RoundEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "topic",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "optionCount",
        "type": "uint256"
      }
    ],
    "name": "RoundPrepared",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "excludeParticipant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExcludedList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyStatus",
    "outputs": [
      {
        "internalType": "enum VotingPlatform.VotingState",
        "name": "currentState",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isAdmin",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isExcluded",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "voted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "optionCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOptionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getOptionText",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "getParticipantStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isExcluded",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "voted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getResults",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWinner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "hasUserVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_topic",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_options",
        "type": "string[]"
      }
    ],
    "name": "prepareRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "reinstateParticipant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revealResults",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "state",
    "outputs": [
      {
        "internalType": "enum VotingPlatform.VotingState",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "topic",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "viewMyVote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "optionIndex",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

//the contract address is not written into this file on purpose, it gets typed into the page instead
let contract = null;

//the last answer from getMyStatus, kept here so the warning text can be worked out
let status = null;

//the option text for this round, read once and reused for the radio buttons,
let optionTexts = [];

//the contract stores its stage as a number 0 to 3, matching the VotingState enum.
//these are the words shown to the user for each of those numbers.
const STATE_LABELS = [
  "No round prepared yet",
  "Voting open",
  "Voting ended, results not revealed yet",
  "Results revealed"
];



//asks metamask which account is connected and gives back the first one.
//metamask only hands over accounts the user has connected to this site.
async function get_current_eth_address() {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  }
  return null;
}

//ethereum keeps balances in wei, which is 10^18 of an ether. this converts it to ether for display.
async function get_current_eth_address_balance(address) {
  const balanceWei = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balanceWei, "ether");
}

//every network has its own id number. sepolia is 11155111 and the main ethereum
//network is 1. metamask gives the id as hex text, so parseInt with 16 turns it into
//a normal number. this matters because the contract only exists on sepolia.
async function get_current_network() {
  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  const chainId = parseInt(chainIdHex, 16);
  if (chainId === 11155111) return "Sepolia";
  if (chainId === 1) return "Ethereum Mainnet";
  return "Unknown network (chain id " + chainId + ")";
}


//shows who is connected, then reloads everything the contract says about them.
//this runs when the page loads the contract, when Connect Wallet is pressed and
//when Refresh is pressed after switching account in metamask.
async function connectWallet() {
  if (!window.ethereum) {
    showMessage("setupMessage", "MetaMask is not installed.", "error");
    return;
  }

  //wipe the last account's messages, otherwise something like a result meant for the
  //admin would still be sitting on screen while a participant is connected
  clearOldMessages();

  try {
    const address = await get_current_eth_address();
    const network = await get_current_network();
    const balance = await get_current_eth_address_balance(address);

    setText("walletAddress", address);
    setText("walletNetwork", network);
    setText("walletBalance", balance + " ETH");

    if (network === "Sepolia") {
      showMessage("setupMessage", "Wallet connected.", "ok");
    } else {
      showMessage("setupMessage", "MetaMask is not on Sepolia. Switch to Sepolia to use this contract.", "error");
    }

    //only worth reading the contract if one has been loaded
    if (contract) {
      await loadSessionInfo();
    }
  } catch (err) {
    showMessage("setupMessage", "Could not connect wallet: " + getErrorMessage(err), "error");
  }
}

//takes the address typed into the page and builds the contract object from it.
//from here on, contract.methods.something() is how the page reaches the blockchain.
async function loadContract() {
  const address = document.getElementById("contractAddressInput").value.trim();

  //isAddress checks the shape of the address, so a typo is caught straight away
  if (!web3.utils.isAddress(address)) {
    showMessage("setupMessage", "That is not a valid contract address.", "error");
    return;
  }

  //an address can look fine but have nothing at it. getCode gives back the contract's
  //code, and "0x" means empty, so either the address is wrong or metamask is on the
  //wrong network.
  const code = await web3.eth.getCode(address);
  if (code === "0x") {
    showMessage("setupMessage", "No contract found at that address. Check you are on Sepolia.", "error");
    return;
  }

  contract = new web3.eth.Contract(CONTRACT_ABI, address);
  log("Contract loaded at " + address, "");
  await connectWallet();
}

//metamask does not tell the page when the user picks a different account, so this
//button is how the page is told to look again
async function refreshPage() {
  await connectWallet();
}


//reads everything the page shows: the public round information, and what the
//contract says about the person currently connected
async function loadSessionInfo() {
  const address = await get_current_eth_address();

  try {
    //admin and topic are public variables. solidity makes a read function for every
    //public variable automatically, which is why they can be called like functions
    //even though nobody wrote them.
    const admin = await contract.methods.admin().call();
    const topic = await contract.methods.topic().call();

    //getMyStatus answers about whoever is asking. the contract works that out from
    //msg.sender, and from tells web3 who msg.sender should be, so without it the
    //contract would think nobody is calling and give back the wrong answers.
    const result = await contract.methods.getMyStatus().call({ from: address });

    //this version of web3 gives whole numbers back as BigInt, a separate number type
    //that cannot be mixed with normal numbers. Number() converts them so the rest of
    //the page can compare and display them normally.
    status = {
      state: Number(result.currentState),
      isAdmin: result.isAdmin,
      isExcluded: result.isExcluded,
      voted: result.voted,
      optionCount: Number(result.optionCount)
    };

    //the contract gives one option at a time rather than the whole list, so ask for
    //each one in turn. await inside the loop means each answer arrives before the
    //next is asked for, which keeps them in the right order.
    optionTexts = [];
    for (let i = 0; i < status.optionCount; i++) {
      optionTexts.push(await contract.methods.getOptionText(i).call());
    }

    //fill in the public part of the page
    setText("adminAddress", admin);
    setText("roundPrepared", status.state === 0 ? "No" : "Yes");
    setText("sessionState", STATE_LABELS[status.state]);
    setText("resultsAvailable", status.state === 3 ? "Yes" : "No");
    setText("sessionTopic", topic === "" ? "(no round prepared yet)" : topic);
    showOptions();

    //then the part about this person. their role comes from comparing their address
    //with the admin address, which the contract already did inside getMyStatus.
    if (status.isAdmin) {
      setText("myRole", "Admin");
      setText("myEligibility", "No, the admin cannot vote");
      setText("myVoted", "Not applicable");
    } else {
      setText("myRole", "Participant");
      setText("myEligibility", status.isExcluded ? "No, you have been excluded from this round" : "Yes");
      setText("myVoted", status.voted ? "Yes" : "No");
    }

    //now that the status is known, work out which actions are blocked and why
    updateWarnings();
  } catch (err) {
    showMessage("setupMessage", "Could not read the contract: " + getErrorMessage(err), "error");
  }
}

//builds the option list and the radio buttons from optionTexts.
//this is done in code rather than written into the html because the options are
//different every round and are only known once the contract has been read.
function showOptions() {
  const list = document.getElementById("optionList");
  const choices = document.getElementById("voteChoices");

  //clear whatever the last round left behind
  list.innerHTML = "";
  choices.innerHTML = "";

  for (let i = 0; i < optionTexts.length; i++) {
    const item = document.createElement("li");
    item.textContent = optionTexts[i];
    list.appendChild(item);

    //the contract votes by option number, so each radio button carries its number
    //and fills in the number box when clicked. the box is still there to type in
    //directly, which is how a number that does not exist can be tried out.
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "voteChoice";
    radio.value = i;
    radio.onclick = function () {
      document.getElementById("voteOptionInput").value = i;
      updateWarnings();
    };
    choices.appendChild(radio);
    choices.appendChild(document.createTextNode(" " + i + ": " + optionTexts[i]));
    choices.appendChild(document.createElement("br"));
  }
}


//works out the warning to show next to every action, based on who is connected,
//what stage the round is at and whether they have voted.
//nothing is hidden or greyed out. the buttons all still work, so the contract can be
//seen refusing the action for itself, and the warning just says why beforehand.
function updateWarnings() {
  //nothing can be worked out until the contract has been read
  if (!contract || !status) {
    const text = "Load the contract and connect your wallet first.";
    ["warnVote", "warnMyVote", "warnPrepare", "warnEligibility", "warnStatusCheck",
     "warnExcludedList", "warnEnd", "warnReveal", "warnResults"].forEach(function (id) {
      setText(id, text);
    });
    return;
  }

  const notAdmin = "Only the admin can do this. You are connected as a participant.";

  //the vote checks are in the same order as the require lines in the contract, so
  //the warning says the same thing the contract would say back
  let voteWarning = "";
  const chosen = document.getElementById("voteOptionInput").value;
  if (status.isAdmin) voteWarning = "The admin is not allowed to vote.";
  else if (status.state === 0) voteWarning = "No round has been prepared yet, so there is nothing to vote on.";
  else if (status.state !== 1) voteWarning = "Voting has ended for this round.";
  else if (status.isExcluded) voteWarning = "You have been excluded from voting in this round.";
  else if (status.voted) voteWarning = "You have already voted in this round.";
  else if (chosen === "") voteWarning = "Pick an option first.";
  else if (Number(chosen) < 0 || Number(chosen) >= status.optionCount) voteWarning = "Option " + chosen + " does not exist in this round.";
  setText("warnVote", voteWarning);

  //there is only something to show if this person has voted
  let myVoteWarning = "";
  if (status.isAdmin) myVoteWarning = "The admin does not vote, so there is no vote to show.";
  else if (!status.voted) myVoteWarning = "You have not voted in this round yet.";
  setText("warnMyVote", myVoteWarning);

  //a new round cannot start while one is open, it has to be ended first
  let prepareWarning = "";
  if (!status.isAdmin) prepareWarning = notAdmin;
  else if (status.state === 1) prepareWarning = "A round is still open. End it before preparing a new one.";
  setText("warnPrepare", prepareWarning);

  //excluding only makes sense while people can still vote
  let eligibilityWarning = "";
  if (!status.isAdmin) eligibilityWarning = notAdmin;
  else if (status.state !== 1) eligibilityWarning = "Eligibility can only be changed while voting is open.";
  setText("warnEligibility", eligibilityWarning);

  //looking up someone else is admin only, a participant can only see themselves
  setText("warnStatusCheck", status.isAdmin ? "" : "Checking another participant's status is admin only.");
  setText("warnExcludedList", status.isAdmin ? "" : notAdmin);

  //there has to be an open round to close
  let endWarning = "";
  if (!status.isAdmin) endWarning = notAdmin;
  else if (status.state !== 1) endWarning = "There is no open round to end.";
  setText("warnEnd", endWarning);

  //revealing is the step after ending, so it is blocked before that and pointless after
  let revealWarning = "";
  if (!status.isAdmin) revealWarning = notAdmin;
  else if (status.state === 0) revealWarning = "No round has been prepared yet.";
  else if (status.state === 1) revealWarning = "Voting is still open. End the round before revealing results.";
  else if (status.state === 3) revealWarning = "Results have already been revealed.";
  setText("warnReveal", revealWarning);

  //the counts only exist for the page once the admin has revealed them
  setText("warnResults", status.state === 3 ? "" : "Results are not available until the admin ends the round and reveals them.");
}


//every button that changes something on the blockchain goes through here.
//two steps: a dry run with .call(), then the real thing with .send().
//.call() works out the answer without saving anything, so if the contract is going to
//refuse, it says so straight away, for free and with no metamask popup.
//.send() is the real transaction, which costs gas and has to be approved in metamask.
async function sendTransaction(actionName, method, messageId) {
  if (!contract) {
    showMessage(messageId, "Load the contract first.", "error");
    return;
  }

  //ask metamask again rather than trusting what was shown earlier, in case the
  //account was switched since the page last looked
  const address = await get_current_eth_address();

  try {
    //the tick box skips the dry run, which lets a failing transaction actually be
    //sent so it shows up as a failed transaction on the blockchain
    //dry run first, it costs nothing and tells us straight away if the contract says no
    await method.call({ from: address });

    showMessage(messageId, "Waiting for MetaMask...", "");

    //this line waits until the transaction has been mined into a block.
    //the receipt is the blockchain's record of what happened.
    const receipt = await method.send({ from: address });

    showMessage(messageId, actionName + " worked.", "ok");
    logReceipt(actionName, receipt);
  } catch (err) {
    let reason = getErrorMessage(err);

    //a transaction that was sent without the dry run still gets mined, it just fails
    //once it is there. that comes back as a receipt with status 0. the receipt does
    //not include the reason, so the same call is run again to ask the contract why.
    if (err.receipt) {
      log(actionName + " was mined but failed | tx hash: " + err.receipt.transactionHash + " | block: " + Number(err.receipt.blockNumber), "error");
      try {
        await method.call({ from: address });
      } catch (callErr) {
        reason = getErrorMessage(callErr);
      }
    }

    showMessage(messageId, actionName + " failed: " + reason, "error");
    log(actionName + " failed: " + reason, "error");
  }

  //read everything again either way, because a transaction that worked will have
  //changed the stage, the vote counts or who has voted
  await loadSessionInfo();
}

//sends the option number from the box to the contract's vote function
async function submitVote() {
  const value = document.getElementById("voteOptionInput").value;
  if (value === "") {
    showMessage("msgVote", "Pick an option first.", "error");
    return;
  }
  await sendTransaction("Vote", contract.methods.vote(value), "msgVote");
}

//collects the topic and every option box and sends them as one round.
//empty boxes are sent as they are rather than being blocked here, so the contract's
//own checks on empty text and on needing two options can be shown working.
async function prepareRound() {
  const topic = document.getElementById("topicInput").value;
  const inputs = document.getElementsByClassName("optionInput");
  const options = [];
  for (let i = 0; i < inputs.length; i++) {
    options.push(inputs[i].value);
  }

  //the contract takes a list of strings, and an array of strings is what it expects
  await sendTransaction("Prepare round", contract.methods.prepareRound(topic, options), "msgPrepare");
}

async function excludeParticipant() {
  const participant = getParticipantInput();
  if (participant) {
    await sendTransaction("Exclude participant", contract.methods.excludeParticipant(participant), "msgEligibility");
  }
}

async function reinstateParticipant() {
  const participant = getParticipantInput();
  if (participant) {
    await sendTransaction("Reinstate participant", contract.methods.reinstateParticipant(participant), "msgEligibility");
  }
}

//closes voting. no arguments because the contract works out the rest for itself.
async function endRound() {
  await sendTransaction("End round", contract.methods.endRound(), "msgEnd");
}

//the separate second step that makes the results readable
async function revealResults() {
  await sendTransaction("Reveal results", contract.methods.revealResults(), "msgReveal");
}


//the reads below are not transactions, so they cost nothing and metamask never
//appears. they can still fail, because the contract refuses some of them depending
//on who is asking and what stage the round is at.

//shows the connected person which option they picked.
//from is needed because the contract answers about msg.sender.
async function viewMyVote() {
  if (!contract) return showMessage("msgMyVote", "Load the contract first.", "error");
  const address = await get_current_eth_address();
  setText("myVoteResult", "");

  try {
    const index = Number(await contract.methods.viewMyVote().call({ from: address }));

    //the contract gives back the number, the text is matched up on this side
    setText("myVoteResult", "You voted for option " + index + ": " + optionTexts[index]);
    showMessage("msgMyVote", "", "");
  } catch (err) {
    showMessage("msgMyVote", "Could not get your vote: " + getErrorMessage(err), "error");
  }
}

//the admin looks up one person's eligibility and whether they have voted.
//if a participant tries this the contract refuses it, and that refusal is what
//gets shown, which is the privacy rule working.
async function checkParticipantStatus() {
  const participant = getParticipantInput();
  if (!participant) return;
  const address = await get_current_eth_address();

  try {
    const result = await contract.methods.getParticipantStatus(participant).call({ from: address });
    const eligible = result.isExcluded ? "excluded" : "eligible";
    const voted = result.voted ? "has voted" : "has not voted";
    showMessage("msgEligibility", participant + " is " + eligible + " and " + voted + ".", "ok");
  } catch (err) {
    showMessage("msgEligibility", "Could not check status: " + getErrorMessage(err), "error");
  }
}

//the admin reads back everyone excluded from this round
async function viewExcludedList() {
  if (!contract) return showMessage("msgExcludedList", "Load the contract first.", "error");
  const address = await get_current_eth_address();
  const listElement = document.getElementById("excludedList");
  listElement.innerHTML = "";

  try {
    //this comes back as an array of addresses, which may be empty
    const list = await contract.methods.getExcludedList().call({ from: address });
    for (let i = 0; i < list.length; i++) {
      const item = document.createElement("li");
      item.textContent = list[i];
      listElement.appendChild(item);
    }

    //an empty list is a real answer, not a failure, so say so clearly
    if (list.length === 0) {
      showMessage("msgExcludedList", "Nobody is excluded in this round.", "ok");
    } else {
      showMessage("msgExcludedList", list.length + " excluded.", "ok");
    }
  } catch (err) {
    showMessage("msgExcludedList", "Could not get the list: " + getErrorMessage(err), "error");
  }
}

//builds the results table and says who won.
//before the admin reveals, the contract refuses both calls below, which is how the
//counts stay hidden. the page is not hiding them, the contract is.
async function showResults() {
  if (!contract) return showMessage("msgResults", "Load the contract first.", "error");
  const body = document.getElementById("resultsBody");
  body.innerHTML = "";
  setText("winnerText", "");

  try {
    //getResults gives back two lists in one answer. results[0] is the option text
    //and results[1] is the vote counts, matched up by position.
    const results = await contract.methods.getResults().call();
    const texts = results[0];
    const counts = results[1];

    //the winners come back as option numbers, so turn them into normal numbers
    //to compare against the row numbers below
    const winnerList = await contract.methods.getWinner().call();
    const winners = [];
    for (let i = 0; i < winnerList.length; i++) {
      winners.push(Number(winnerList[i]));
    }

    //one row per option, marked if it is one of the winners
    for (let i = 0; i < texts.length; i++) {
      const row = body.insertRow();
      row.insertCell().textContent = i;
      row.insertCell().textContent = texts[i];
      row.insertCell().textContent = Number(counts[i]);
      row.insertCell().textContent = winners.includes(i) ? "Winner" : "";
    }

    //three possible endings: nobody voted, one winner, or a tie between several
    if (winners.length === 0) {
      setText("winnerText", "No votes were cast, so there is no winner.");
    } else if (winners.length === 1) {
      setText("winnerText", "Winner: " + texts[winners[0]]);
    } else {
      const names = [];
      for (let i = 0; i < winners.length; i++) {
        names.push(texts[winners[i]]);
      }
      setText("winnerText", "Tie between: " + names.join(", "));
    }
    showMessage("msgResults", "", "");
  } catch (err) {
    showMessage("msgResults", "Could not get results: " + getErrorMessage(err), "error");
  }
}


//adds another option box, numbered to match the option numbers the contract uses
function addOptionInput() {
  const number = document.getElementsByClassName("optionInput").length;
  const p = document.createElement("p");
  p.innerHTML = "Option " + number + ': <input type="text" class="optionInput" size="40">';
  document.getElementById("optionInputs").appendChild(p);
}

//removes the last option box. going below two is allowed on purpose, so the
//contract's rule about needing at least two options can be tested.
function removeOptionInput() {
  const container = document.getElementById("optionInputs");
  if (container.lastElementChild) {
    container.removeChild(container.lastElementChild);
  }
}

//reads the address box and checks it before it is sent anywhere.
//a badly typed address would otherwise waste a transaction.
function getParticipantInput() {
  if (!contract) {
    showMessage("msgEligibility", "Load the contract first.", "error");
    return null;
  }
  const value = document.getElementById("participantInput").value.trim();
  if (!web3.utils.isAddress(value)) {
    showMessage("msgEligibility", "That is not a valid address.", "error");
    return null;
  }
  return value;
}

//digs the contract's message out of an error.
//when a require fails, metamask does not pass the message straight back. it wraps it
//in a general "Internal JSON-RPC error", with the real one buried a few layers down,
//and sometimes only as hex. so instead of looking in one place, this works through
//the error and everything inside it until it finds something readable.
function getErrorMessage(err) {
  //a list of things still to look at, starting with the error itself.
  //anything found inside gets added to the end and checked in turn.
  const layers = [err];
  let firstMessage = "";

  for (let i = 0; i < layers.length && i < 30; i++) {
    const layer = layers[i];
    if (!layer) continue;

    //some layers are just text
    if (typeof layer === "string") {
      //this is the wording that comes back when a require fails, so whatever
      //follows it is the message written in the contract
      if (layer.includes("execution reverted: ")) return layer.split("execution reverted: ")[1];
      if (layer.includes("revert ")) return layer.split("revert ")[1];

      //that same message sometimes arrives as hex instead, and always starts
      //with this marker
      if (layer.startsWith("0x08c379a0")) return decodeRevertData(layer);
      continue;
    }
    if (typeof layer !== "object") continue;

    //4001 is metamask's code for the user pressing reject
    if (layer.code === 4001) return "You rejected the transaction in MetaMask.";

    //sometimes web3 has already pulled the message out for us
    if (typeof layer.reason === "string" && layer.reason !== "" && layer.reason !== "revert") return layer.reason;

    //keep the first message seen as a fallback, in case nothing better turns up
    if (firstMessage === "" && typeof layer.message === "string") firstMessage = layer.message;

    //add everything nested inside this layer to the end of the list
    layers.push(layer.message, layer.data, layer.innerError, layer.cause, layer.error, layer.originalError);
  }

  return firstMessage || String(err);
}

//turns the hex version of a failure message back into words.
//the first 10 characters are a marker saying "this is an error message", and the rest
//is the text itself encoded, which decodeParameter unpacks.
function decodeRevertData(hex) {
  try {
    return web3.eth.abi.decodeParameter("string", "0x" + hex.slice(10));
  } catch (e) {
    return "the contract rejected it";
  }
}

//writes what the blockchain said about a transaction into the log.
//the hash identifies it and can be pasted into etherscan, the block number is where
//it ended up, and the gas used is what it cost to run.
function logReceipt(actionName, receipt) {
  log(actionName + " confirmed | tx hash: " + receipt.transactionHash
    + " | status: " + (Number(receipt.status) === 1 ? "success" : "failed")
    + " | block: " + Number(receipt.blockNumber)
    + " | gas used: " + Number(receipt.gasUsed), "ok");

  //the receipt also carries any events the contract gave off during the transaction.
  //returnValues holds what was put into the event, for example the topic name.
  for (const name in receipt.events) {
    const values = receipt.events[name].returnValues;
    const parts = [];
    for (const key in values) {
      //web3 lists every value twice, once by name and once by position, and adds a
      //length as well. isNaN skips the numbered copies so each value shows once.
      if (isNaN(key) && key !== "__length__") {
        parts.push(key + " = " + values[key]);
      }
    }
    log("Event " + name + (parts.length > 0 ? ": " + parts.join(", ") : ""), "event");
  }
}

//adds a line to the top of the activity log with the time in front of it
function log(text, type) {
  const line = document.createElement("p");
  line.style.color = colourFor(type);
  line.textContent = new Date().toLocaleTimeString() + "  " + text;
  const logBox = document.getElementById("activityLog");
  logBox.insertBefore(line, logBox.firstChild);
}

function clearLog() {
  document.getElementById("activityLog").innerHTML = "";
}

//empties the action messages and anything only the last account was allowed to see,
//so nothing from one account is left on screen under another
function clearOldMessages() {
  ["msgVote", "msgMyVote", "msgPrepare", "msgEligibility", "msgExcludedList",
   "msgEnd", "msgReveal", "msgResults"].forEach(function (id) {
    showMessage(id, "", "");
  });
  setText("myVoteResult", "");
  setText("winnerText", "");
  document.getElementById("excludedList").innerHTML = "";
  document.getElementById("resultsBody").innerHTML = "";
}

//puts a message on the page in the colour that matches what happened
function showMessage(id, text, type) {
  const element = document.getElementById(id);
  element.textContent = text;
  element.style.color = colourFor(type);
}

//red means something failed, green means it worked, blue is an event from the contract
function colourFor(type) {
  if (type === "error") return "red";
  if (type === "ok") return "green";
  if (type === "event") return "blue";
  return "";
}

//shortcut for putting text into an element by its id
function setText(id, text) {
  document.getElementById(id).textContent = text;
}

//runs as soon as the page opens, so every action starts out with the
//"load the contract first" warning next to it instead of looking ready to use
updateWarnings();
