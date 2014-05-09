var dictionary = {
	"matches"		: "Partidas (sele&#231;&#227;o)",
	"goals"			: "Gols (sele&#231;&#227;o)",
	"titulos"		: "T&#205;tulos",
	"ataque"		: "Força de Ataque",
	"defesa"		: "Força de Defesa",
	"selecao"		: "Força da Sele&#231;&#227;o"
};

var GameMaster = function () {
	return {
		init : function () {
			this.statistics = [];
			this.score = {
				player: 0,
				pc: 0
			}

			this.instantiateStartModal();
			this.configRoundModal();

			this.currentRound = 0;

			this.presentationWrapper = $('.presentation-wrapper');
			this.gameWrapper = $('.game-wrapper');

			this.gameMode = new GameModeModule({
				gameMaster: this
			});
			this.gameMode.init();

			this.player = new Player();			
			this.player.init();
			
			this.computer = new Computer();
			this.computer.init();
			
			this.loadCards('js/cardsList.json');
			this.bindEvents();
		},

		instantiateStartModal: function () {
			this.startModal = new StartModal({
				$el: $('#start-modal')
			});

			this.startModal.init();
			this.startModal.open();
		},

		configRoundModal: function () {
			this.roundModal = roundModal;
			this.roundModal.bindEvents();
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
		},

		onAttributeClicked: function (playerData) {
			var pcData = this.computer.flipFirstCard(); //get all attributes

			this.compareData(playerData, pcData, playerData.attribute);
		},

		compareData: function (playerData, pcData, attr) {
			var that 		= this,
				roundData,
				result		= '';
				playerValue = playerData.val,
				pcValue 	= pcData[attr];
			
			if (playerValue > pcValue) {
				result = 'won';
				this.score.player++;
			} else if (playerValue == pcValue) {
				result = 'draw';
			} else {
				result = 'loose';
				this.score.pc++;
			}

			//adding all round data to an object will allow us
			//to have 'match statistics' for a future feature :)
			roundData = {
				playerData	: playerData,
				pcData		: pcData,
				attr 		: attr,
				result 		: result
			};

			this.onRoundEnd(roundData);
		},

		onRoundEnd: function (roundData) {
			var that = this,
				gameStatus;
			
			this.currentRound++;
			this.statistics.push(roundData);

			gameStatus = this.gameMode.isOver();

			if (gameStatus.isOver) {
				console.log('acabou o jogo!!!', this.score)
				alert('APONTA O ÁRBITRO!!! Jogador: ' + this.score.player + ' Computador: ' + this.score.pc)
			} else {
				//TODO: solve this like a real developer
				
				this.roundEnded = true;
				this.roundModal.open();
			}

		},

		onRoundConfirmed: function () {
			if (this.roundEnded) {
				this.removeFlipped();
				this.player.flipFirstCard();

				this.roundEnded = false;
			}
		},

		removeFlipped: function () {
			this.player.removeFlipped();
			this.computer.removeFlipped();
		},

		onGameModeChoosed: function (data) {
			var that = this;

			this.gameWrapper.removeClass('display-none');
			this.presentationWrapper.addClass('display-none');
			$('#wrapper').addClass('field-image');

			this.gameMode.setMode(data.mode);
			setTimeout(function () {
				that.player.flipFirstCard();
			}, 300);
		},

		bindEvents: function () {
			var that = this;

			//triggered on Player object to pass selected attribute and value
			$(window).on('attributeClicked', function (e, data) {
				that.onAttributeClicked(data);
			});

			//triggered on StartModal to choose the game mode
			$(window).on('gameModeChoosed', function (e, data) {
				that.onGameModeChoosed(data);
			});

			$(window).on('confirmRound', function () {
				that.onRoundConfirmed();
			});
		}
	}
};

window.onload = function () {
	var GM = new GameMaster();
	GM.init();
};