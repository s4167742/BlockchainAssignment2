// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingPlatform {

    // Part 1: roles & lifecycle state (done)
    // TODO Part 2: round setup (topic + text options)
    // TODO Part 3: voter eligibility (exclude / reinstate)
    // TODO Part 4: casting votes
    // TODO Part 5: ending voting + revealing results
    // TODO Part 6: view/helper functions for the frontend

    // Tracks what stage the current round is at.
    enum VotingState { NotStarted, Voting, Ended, Revealed }

    address public admin;
    VotingState public state;

    // Only the admin may call functions that use this.
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can do this");
        _;
    }

    // Whoever deploys the contract becomes the admin. Nothing is hardcoded.
    constructor() {
        admin = msg.sender;
        state = VotingState.NotStarted;
    }
}
