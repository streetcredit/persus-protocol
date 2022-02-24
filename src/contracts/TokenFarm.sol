// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;

    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public {
        require(_amount > 0, "Amount cannot be 0");
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender]+= _amount;
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function issueTokens() public {
        require(msg.sender == owner, "Caller is not the owner");
        for (uint i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint balance = stakingBalance[staker];
            if(balance > 0) {
                dappToken.transfer(staker, balance);
            }
        }
    }

    function unstakeTokens(uint _amount) public {
        uint balance = stakingBalance[msg.sender];
        require(_amount > 0, "Amount cannot be 0");
        require(balance > 0, "Not currently staking");
        require(balance - _amount >= 0, "Insufficient balance");
        daiToken.transfer(msg.sender, _amount);
        stakingBalance[msg.sender] -= _amount;
        if(stakingBalance[msg.sender] <= 0) {
            isStaking[msg.sender] = false;
        }
    }

}