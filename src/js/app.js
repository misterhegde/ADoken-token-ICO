App = {
	web3Provider: null,
	contracts: {},
	account: '0x0',
	loading: false,
	tokenPrice: 1000000000000000,
	tokenSold: 0,
	tokenAvailable: 500,

	init: function(){
		console.log("app initialized")
		return App.initWeb3();
	},
	initWeb3: function(){
		if(typeof web3 != 'undefined'){
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);

		} else{
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
			web3 = new Web3(web3.currentProvider);
		}
		return App.initContracts();
	},
	initContracts: function(){
		$.getJSON("ADokenSale.json", function(adokenSale){
			App.contracts.ADokenSale = TruffleContract(adokenSale);
			App.contracts.ADokenSale.setProvider(App.web3Provider);
			App.contracts.ADokenSale.deployed().then(function(adokenSale){
				console.log("Token sale address:", adokenSale.address);
			});
				}).done(function(){
				$.getJSON("ADoken.json", function(adoken){
				  App.contracts.ADoken = TruffleContract(adoken);
				  App.contracts.ADoken.setProvider(App.web3Provider);
				  App.contracts.ADoken.deployed().then(function(adoken){
				 	 console.log("Token address:", adoken.address);
				 	});
				  App.listenForEvents();
				  return App.render();
			

			});
				

		})
	},

	listenForEvents: function() {
    App.contracts.ADokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },

	render: function(){
		if (App.loading) {
			return;
		}
		App.laoding = true;

		var loader = $('#loader');
		var content = $('#content');
		loader.show();
		content.hide();

		//load account data
		web3.eth.getCoinbase(function(err, account){
			if(err === null){
				console.log("account", account);
				App.account = account;
				$('#accountAddress').html("Your Account:" + account);
			}
		});

		App.contracts.ADokenSale.deployed().then(function(instance){
			adokenSaleInstance = instance;
			return adokenSaleInstance.tokenPrice();
		}).then(function(tokenPrice){
			App.tokenPrice = tokenPrice;
			console.log("tokenPrice", tokenPrice);
			$('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
			return adokenSaleInstance.tokenSold();
		}).then(function(tokenSold){
			App.tokenSold = tokenSold;
			console.log("tokenSold", tokenSold);
			$('.token-sold').html(App.tokenSold.toNumber());
			$('.token-available').html(App.tokenAvailable);

			var progressPercent = (App.tokenSold / App.tokenAvailable) * 100;
			console.log(progressPercent);
			$('#progress').css('width', progressPercent + '%');

			App.contracts.ADoken.deployed().then(function(instance){
				adokenInstance = instance;
				return adokenInstance.balanceOf(App.account);
			}).then(function(balance){
				$('.dapp-balance').html(balance.toNumber());
				App.laoding=false;
				loader.hide();
				content.show();
			})
		});

	},

	buyTokens: function() {
    	$('#content').hide();
    	$('#loader').show();
    	var numberOfTokens = $('#numberOfTokens').val();
    	App.contracts.ADokenSale.deployed().then(function(instance) {
      	return instance.buyTokens(numberOfTokens, {
        	from: App.account,
        	value: numberOfTokens * App.tokenPrice,
        	gas: 500000 // Gas limit
      	});
    	}).then(function(result) {
      	console.log("Tokens bought...")
      	$('form').trigger('reset') // reset number of tokens in form
      // Wait for Sell event
    });
  }
}





$(function(){
	$(window).load(function(){
		App.init();
	})

});
