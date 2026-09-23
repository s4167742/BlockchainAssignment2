// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingPlatform {

    //part 1: roles and lifecycle state (done)
    //part 2: round setup, topic and text options (done)
    //part 3: voter eligibility, exclude and reinstate (done)
    //part 4: casting votes (done)
    //part 5: ending voting and revealing results (done)
    //part 6: view functions for the frontend (done)

    //the four stages a round can be in
    enum VotingState { NotStarted, Voting, Ended, Revealed }

    address public admin;
    VotingState public state;

    //admin only actions use this
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can do this");
        _;
    }

    //voting has to be open for the action to run
    modifier whileVotingOpen() {
        require(state == VotingState.Voting, "Voting is not open");
        _;
    }

    //results stay locked until the admin reveals them
    modifier afterReveal() {
        require(state == VotingState.Revealed, "Results have not been revealed yet");
        _;
    }

    //runs once on deploy, whoever deploys becomes admin, nothing hardcoded
    constructor() {
        admin = msg.sender;
        state = VotingState.NotStarted;
    }

    //part 2: round setup

    //one voting option and its vote total
    struct Option {
        string text;
        uint256 voteCount;
    }

    string public topic;
    Option[] private options;

    //part 3: voter eligibility

    //who the admin has blocked from voting this round
    mapping(address => bool) private excluded;
    //same info as a list, since you cant loop a mapping
    //lets the admin read the list back and lets prepareRound clear it
    address[] private excludedList;

    //part 4: vote records

    mapping(address => bool) private hasVoted;      //private so nobody can check another address
    mapping(address => uint256) private votedFor;   //which option they picked, also private
    address[] private votersWhoVoted;               //so prepareRound knows whose records to clear

    //events, the frontend reads these off the transaction receipt

    event RoundPrepared(string topic, uint256 optionCount);
    //no option index in here on purpose, events are public forever so logging
    //the choice would give away how someone voted, the voter address is already
    //visible in the transaction so it gives nothing extra away
    event VoteCast(address voter);
    event ParticipantExcluded(address participant);
    event ParticipantReinstated(address participant);
    event RoundEnded(uint256 totalVotesCast);
    event ResultsRevealed();

    //admin sets up a new round with a topic and at least 2 text options
    //cant run while a round is still open, end it first
    //also wipes everything from the last round before the new one starts
    function prepareRound(string calldata _topic, string[] calldata _options) external onlyAdmin {
        require(state != VotingState.Voting, "Current round is still open, end it first");
        require(bytes(_topic).length > 0, "Topic cannot be empty");
        require(_options.length >= 2, "Need at least 2 options");

        for (uint256 i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length > 0, "Option text cannot be empty");
        }

        //clear the last round's vote records
        for (uint256 i = 0; i < votersWhoVoted.length; i++) {
            address voter = votersWhoVoted[i];
            hasVoted[voter] = false;
            delete votedFor[voter];
        }
        delete votersWhoVoted;

        //clear the last round's exclusions
        for (uint256 i = 0; i < excludedList.length; i++) {
            excluded[excludedList[i]] = false;
        }
        delete excludedList;

        delete options; //clear the last round's options

        topic = _topic;
        for (uint256 i = 0; i < _options.length; i++) {
            options.push(Option(_options[i], 0));
        }

        state = VotingState.Voting;

        emit RoundPrepared(_topic, _options.length);
    }

    //part 3: exclude and reinstate

    //admin blocks someone from voting this round
    function excludeParticipant(address participant) external onlyAdmin whileVotingOpen {
        require(participant != admin, "The admin cannot be excluded");
        require(!excluded[participant], "Participant is already excluded");
        require(!hasVoted[participant], "Participant has already voted");

        excluded[participant] = true;
        excludedList.push(participant);

        emit ParticipantExcluded(participant);
    }

    //admin gives someone their voting rights back for this round
    function reinstateParticipant(address participant) external onlyAdmin whileVotingOpen {
        require(excluded[participant], "Participant is not excluded");

        excluded[participant] = false;

        //find where they sit in the list
        uint256 position = 0;
        for (uint256 i = 0; i < excludedList.length; i++) {
            if (excludedList[i] == participant) {
                position = i;
            }
        }

        //take them out by shifting the rest forward, then drop the last slot
        //same way we removed an item from an array in the week 4 tutorial
        for (uint256 i = position; i < excludedList.length - 1; i++) {
            excludedList[i] = excludedList[i + 1];
        }
        excludedList.pop();

        emit ParticipantReinstated(participant);
    }

    //admin only, participants check their own status with getMyStatus instead
    function getExcludedList() external view onlyAdmin returns (address[] memory) {
        return excludedList;
    }

    //part 4: casting votes

    //any wallet that isnt the admin and isnt excluded gets one vote
    function vote(uint256 optionIndex) external whileVotingOpen {
        require(msg.sender != admin, "The admin is not allowed to vote");
        require(!excluded[msg.sender], "You are not eligible to vote in this round");
        require(!hasVoted[msg.sender], "You have already voted");
        require(optionIndex < options.length, "That option does not exist");

        hasVoted[msg.sender] = true;
        votedFor[msg.sender] = optionIndex;
        options[optionIndex].voteCount += 1;
        votersWhoVoted.push(msg.sender);

        emit VoteCast(msg.sender);
    }

    //part 5: ending and revealing

    //admin closes voting, votes are final from here but results stay hidden
    function endRound() external onlyAdmin whileVotingOpen {
        state = VotingState.Ended;
        emit RoundEnded(votersWhoVoted.length);
    }

    //separate step from ending, only now do the counts become readable
    function revealResults() external onlyAdmin {
        require(state == VotingState.Ended, "Voting must be ended before results can be revealed");
        state = VotingState.Revealed;
        emit ResultsRevealed();
    }

    //part 6: view functions

    //open to anyone any time, option text only, no counts
    function getOptionCount() external view returns (uint256) {
        return options.length;
    }

    function getOptionText(uint256 index) external view returns (string memory) {
        require(index < options.length, "That option does not exist");
        return options[index].text;
    }

    //only ever reads msg.sender so nobody can check anyone else
    function hasUserVoted() external view returns (bool) {
        return hasVoted[msg.sender];
    }

    //same idea, you can only see your own choice
    function viewMyVote() external view returns (uint256) {
        require(hasVoted[msg.sender], "You have not voted yet");
        return votedFor[msg.sender];
    }

    //full results, every option next to its vote count
    //two lists because the frontend lines them up by index anyway
    function getResults() external view afterReveal returns (string[] memory, uint256[] memory) {
        string[] memory texts = new string[](options.length);
        uint256[] memory counts = new uint256[](options.length);

        for (uint256 i = 0; i < options.length; i++) {
            texts[i] = options[i].text;
            counts[i] = options[i].voteCount;
        }

        return (texts, counts);
    }

    //gives back the winning option numbers
    //one for a clear winner, more than one for a tie, empty if nobody voted
    function getWinner() external view afterReveal returns (uint256[] memory) {
        uint256 highestVotes = 0;

        //find the top vote count
        for (uint256 i = 0; i < options.length; i++) {
            if (options[i].voteCount > highestVotes) {
                highestVotes = options[i].voteCount;
            }
        }

        //nobody voted so there is no winner
        if (highestVotes == 0) {
            return new uint256[](0);
        }

        //count how many options hit that top number
        uint256 winnerCount = 0;
        for (uint256 i = 0; i < options.length; i++) {
            if (options[i].voteCount == highestVotes) {
                winnerCount++;
            }
        }

        //grab all of them, handles ties too
        uint256[] memory winners = new uint256[](winnerCount);
        uint256 index = 0;
        for (uint256 i = 0; i < options.length; i++) {
            if (options[i].voteCount == highestVotes) {
                winners[index] = i;
                index++;
            }
        }

        return winners;
    }

    //admin can check if someone is excluded and if they have voted, they need
    //that to run the round, it never shows what the person voted for
    function getParticipantStatus(address participant)
        external
        view
        onlyAdmin
        returns (bool isExcluded, bool voted)
    {
        return (excluded[participant], hasVoted[participant]);
    }

    //one call that tells the frontend everything it needs to know to work out
    //which buttons are allowed and what warning to show, never reverts
    function getMyStatus()
        external
        view
        returns (
            VotingState currentState,
            bool isAdmin,
            bool isExcluded,
            bool voted,
            uint256 optionCount
        )
    {
        return (
            state,
            msg.sender == admin,
            excluded[msg.sender],
            hasVoted[msg.sender],
            options.length
        );
    }
}
