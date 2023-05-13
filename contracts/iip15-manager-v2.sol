//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./iip15-manager-v1.sol";

contract IIP15ManagerV2 is IIP15ManagerV1 {

    function isApproved(address _contractAddress) public view returns (bool) {
        return contractRegistry[_contractAddress].isApproved;
    }

    function test() pure public returns(string memory) {
        return "upgraded";
    }
}