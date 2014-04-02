var GameMaster = function () {
	return {
		init : function () {
			this.player = new Player();			
			this.player.init();
			
			this.computer = new Computer();
			this.computer.init();
			
			this.loadCards('js/cardsList.json');
		},
		
		loadCards : function (_url) {
			var loop = this;
		
			$.ajax({
		        type: 'GET',
		        url: _url,
		        dataType: 'json',   
		        success: function(_data) {
					loop.shuffleCards(_data.availableCards);
	        	},
	        	error: function (_data) {
	        		console.log('error', _data);
	        	}
     		});
		},
		
		shuffleCards : function (_availableCards) {
			var shuffledDeck = _availableCards.sort(function() {return 0.5 - Math.random();});
			
			this.splitCards(shuffledDeck);
		},
		
		splitCards : function (_shuffledDeck) {
			var deckSize = _shuffledDeck.length,
				counter = 0;
			
			for (counter = 0; counter < deckSize; counter++) {
				if (counter % 2 === 0) {
					this.player.deck.push(_shuffledDeck[counter]);
				} else {
					this.computer.deck.push(_shuffledDeck[counter]);
				}
			}
			
			this.player.renderDeck();
			this.computer.renderDeck();
		}
	}
};

window.onload = function () {
	var GM = new GameMaster();
	GM.init();
};