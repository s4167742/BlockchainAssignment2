// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingPlatform {

    //Part 1: roles & lifecycle state (done)
    //Part 2: round setup (topic + text options) (done)
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

    //Part 2: round setup (topic + text options)

    // One voting option and its running vote total.
    struct Option {
        string text;
        uint256 voteCount;
    }

    string public topic;
    Option[] private options;

    // Admin sets up a new round with a topic and at least 2 text options.
    // Can't be called while a round is already open - end it first.
    // NOTE: this only clears the options for now. Once we add voting and
    // eligibility in later parts, this function will also clear those
    // round-specific records before starting the next round.
    function prepareRound(string calldata _topic, string[] calldata _options) external onlyAdmin {
        require(state != VotingState.Voting, "Current round is still open, end it first");
        require(bytes(_topic).length > 0, "Topic cannot be empty");
        require(_options.length >= 2, "Need at least 2 options");

        for (uint256 i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length > 0, "Option text cannot be empty");
        }

        delete options; // clear previous round's options

        topic = _topic;
        for (uint256 i = 0; i < _options.length; i++) {
            options.push(Option(_options[i], 0));
        }

        state = VotingState.Voting;
    }
}
