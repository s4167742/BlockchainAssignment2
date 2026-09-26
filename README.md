# Decision Voting Platform

INTE2628/2679 Developing Blockchain Applications: Assignment 2

A multi-round decision voting platform. The Admin (contract deployer) sets up
a voting round with a topic and text options, manages who's eligible to vote,
and reveals results once voting ends. Participants connect with MetaMask,
vote once per round, and can check their own status.

## Team
- Ethan patten-cox (S4167742)
- Abdul Rahim sabawi (s4002976)

## Project structure
```
contracts/   Solidity smart contract (write & test in Remix)
frontend/    HTML + JS + CSS, uses MetaMask + Web3.js
docs/        Screenshots and notes for the PDF documentation
```

## Resources
- [Assignment 2 brief](docs/Assignment2_Brief.pdf): full requirements, submission and marking rubric
- Documentation: shared Google Doc: , exported to PDF for submission

## How to run
1. Open `contracts/VotingPlatform.sol` in Remix.
2. Compile, then deploy using Injected Provider MetaMask (Sepolia testnet).
3. Copy the deployed contract address from Remix.
4. From the `frontend/` folder run:
   ```
   npm install -g http-server   (first time only)
   http-server .
   ```
5. Open the printed local URL in your browser, paste the contract address into
   the Setup box and click "Load Contract". Nothing in the code needs editing,
   so a redeploy only needs the new address pasted in.
6. After switching accounts in MetaMask, click "Refresh" so the page updates
   the role, eligibility and warnings for that account.

The ABI in `frontend/app.js` only needs replacing if the contract code changes.

## Progress

### Smart contract
- [x] Admin auto-assigned on deploy (Part 1)
- [x] Prepare / reset a voting round (topic + options) (Part 2)
- [x] Voter eligibility (exclude / reinstate)
- [x] Cast vote
- [x] End voting
- [x] Reveal results (handles ties)
- [x] View functions (session info, my vote, admin checks, results)

### Frontend
- [x] Connect MetaMask wallet (Part 1)
- [x] Show wallet info (address / network / balance) (Part 1)
- [x] Show basic session info: admin / status / topic (Part 1)
- [x] Show voting options
- [x] Admin panel (prepare round, eligibility, end voting, reveal results)
- [x] Participant panel (vote, own status)
- [x] Warnings shown next to restricted actions
- [x] Receipt details and events shown in the activity log
- [ ] Tested on Sepolia with MetaMask

### Documentation (PDF)
- [ ] Group info + who is submitting
- [ ] System overview + diagram
- [ ] Functional breakdown
- [ ] Screenshots with captions
- [ ] Reflection



## Notes
- Built from concepts covered in Weeks 1-8 (structs, mappings + parallel
  arrays, enums, `require`, Web3.js `.call()`/`.send()`), no outside
  frameworks or generators.
- Based on our Assignment 1 voting contract, adapted for text-based options,
  repeated rounds, eligibility management and a frontend.
