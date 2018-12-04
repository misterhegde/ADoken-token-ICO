pragma solidity ^0.4.19;
//@title ADoken token ICO sale
//@author Aditya Hegde
//@notice Connect to Rinkeby or any other test network and deploy to see the ICO sale in action

contract ADoken {

	string public name = "ADoken";
	string public symbol = "ADokenSym";
	uint public totalSupply;

	event Transfer(address indexed _from, address indexed _to, uint _value); //mentions that transfer has happened
	event Approval(address indexed _owner, address indexed _spender, uint _value); //mentions that approval has happened
	



	mapping (address => uint) public balanceOf;
	mapping (address => mapping (address => uint)) public allowance;  /*my address approves the spender to spend some coins.
		So the mapping inside the mapping keeps track of addresses that i've approved*/
	
	

	constructor(uint _initialSupply) public {  //to specify total number of tokens
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
		
	}
	function transfer(address _to, uint _value) public returns(bool success) {

		require(balanceOf[msg.sender] >= _value);  //require that the sender has enough tokens to send 

		balanceOf[msg.sender] -= _value;   //deduct from the sender
		balanceOf[_to] += _value;     //update the balance of the receiver with the tokens
		Transfer(msg.sender, _to, _value);
		return true;
		
		}

		//approval function. ie: the spender can spend coins on my behalf
	function approve(address _spender, uint _value) public returns(bool success)  {
		
		allowance[msg.sender][_spender] = _value;
		Approval(msg.sender, _spender, _value);   //trigger event that the owner has approved the transfer		
		return true;	
		}

		// this is the transfer approval function
	function transferFrom(address _from, address _to, uint _value) public returns(bool success) {

		require(_value <= balanceOf[_from]); // make sure it has enough balance to send

		require(_value <= allowance[_from][msg.sender]); //msg.sender is the 3rd party here which is approved by the _from account to spend the value on its behalf
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;
		Transfer(_from, _to, _value);
		return true;
	}
	
			
}

