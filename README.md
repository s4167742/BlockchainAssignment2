# Decision Voting Platform

INTE2628/2679 Developing Blockchain Applications Assignment 2

A multi-round decision voting platform. 
The Admin (contract deployer) sets up a voting round with a topic and text options, 
manages who's eligible to vote,and reveals results once voting ends.
Participants connect with MetaMask,vote once per round, and can check their own status.

## Team
- Ethan patten-cox (S4167742) — GitHub handle
- Name (Student ID) — GitHub handle

## Project structure
```
contracts/   Solidity smart contract (write & test in Remix)
frontend/    HTML + JS + CSS, uses MetaMask + Web3.js
docs/        Screenshots and notes for the PDF documentation
```

## How to run
1. Open `contracts/VotingPlatform.sol` in Remix.
2. Compile, then deploy using Injected Provider — MetaMask (Sepolia testnet).
3. Copy the deployed contract address into `CONTRACT_ADDRESS` in `frontend/app.js`.
4. From the `frontend/` folder run:
   ```
   npm install -g http-server   (first time only)
   http-server .
   ```
5. Open the printed local URL in your browser and click "Connect Wallet".

## Progress

### Smart contract
- [x] Admin auto-assigned on deploy (Part 1)
- [ ] Prepare / reset a voting round (topic + options)
- [ ] Voter eligibility (exclude / reinstate)
- [ ] Cast vote
- [ ] End voting
- [ ] Reveal results (handles ties)
- [ ] View functions (session info, my vote, admin checks, results)

### Frontend
- [ ] Connect MetaMask wallet
- [ ] Show wallet info (address / network / balance)
- [ ] Show session info (topic / options / status)
- [ ] Admin panel (prepare round, eligibility, end voting, reveal results)
- [ ] Participant panel (vote, own status)
- [ ] Warnings shown next to restricted actions

### Documentation (PDF)
- [ ] Group info + who is submitting
- [ ] System overview + diagram
- [ ] Functional breakdown
- [ ] Screenshots with captions
- [ ] Reflection

