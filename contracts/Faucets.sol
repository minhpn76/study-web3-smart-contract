// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucets {

  address[] public players;
  
  function getPlayersAddress() public payable {    
    require(msg.value >= 0.00000001 ether);
    players.push(msg.sender); 
  }

  function getAllPlayerAddress() view public returns (address[] memory name) {
    return players;
  }
}