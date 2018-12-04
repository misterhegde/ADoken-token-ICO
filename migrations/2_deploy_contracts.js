var ADoken = artifacts.require("./ADoken.sol");
var ADokenSale = artifacts.require("./ADokenSale.sol");


module.exports = function(deployer) {
  deployer.deploy(ADoken, 1000).then(function(){
  	//token price is 0.001 ether
  	var tokenPrice = 1000000000000000;
  	return deployer.deploy(ADokenSale, ADoken.address, tokenPrice)
  });
};
