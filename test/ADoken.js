var ADoken = artifacts.require("./ADoken.sol");

contract('ADoken', function(){
	var tokenInstance;

	it('initializes contract with correct values', function(){
		return ADoken.deployed().then(function(i){
			tokenInstance = i;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name,'ADoken', 'has correct name');
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,'ADokenSym', 'has correct symbol');
		});
	});


	it('sets the number of tokens', function(){
		return ADoken.deployed().then(function(i){
			tokenInstance = i;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(), 1000, 'sets the total supply to 1000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(), 1000, 'allocates initial supply to the admin account');

		});
	});
})