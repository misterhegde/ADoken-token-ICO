pragma solidity ^0.4.19;

import "./ADoken.sol";



contract ADokenSale {
	
	ADoken public ADokencontract;
	address admin;
	uint public tokenPrice;
	uint public tokenSold;

	event Sell(address _buyer, uint _amount);

	constructor (ADoken _adokencontract, uint _tokenprice) {
		admin = msg.sender;
		ADokencontract = _adokencontract;
		tokenPrice = _tokenprice;


	}

	function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

	function buyTokens (uint _noOfTokens) public payable {

		require(msg.value == multiply(_noOfTokens, tokenPrice)); //require that value is equal to tokens
		
		require(ADokencontract.balanceOf(this) >= _noOfTokens); //require that there are enough token in this contract
		
		require(ADokencontract.transfer(msg.sender, _noOfTokens)); //buy functionality
		
		tokenSold += _noOfTokens; //keep track of tokens sold

		Sell(msg.sender, _noOfTokens); //trigger the event
		
	}

	function endSale() public {

		require(msg.sender == admin);  //require that only admin can end the sale

		require (ADokencontract.transfer(admin, ADokencontract.balanceOf(this))); //transfer the leftover balance to admin
		admin.transfer(address(this).balance); //transfer the balance to the admin
		
		
		
	}
	

	
}
