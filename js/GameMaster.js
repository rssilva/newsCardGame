(function () {
	exports.dictionary = {
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
				this.currentRound 	= 0;
				this.isStarted 		= false;
				this.isEnded 		= false;

				this.cacheElements();

				this.instantiateModules();
				
				this.loadCards('js/cardsList.json');
				this.bindEvents();
			},

			instantiateModules: function () {
				this.instantiateStartModal();
				this.configRoundModal();
				this.instantiateSoundModule();

				this.instantiateGeneralOptions();

				this.gameMode = new exports.GameModeModule({
					gameMaster: this
				});
				this.gameMode.init();

				this.player = new exports.Player();			
				this.player.init();
				
				this.computer = new exports.Computer();
				this.computer.init();
			},

			instantiateStartModal: function () {
				this.startModal = new exports.StartModal({
					$el: $('#start-modal')
				});

				this.startModal.init();
				this.startModal.open();
			},

			configRoundModal: function () {
				this.roundModal = exports.roundModal;
			},

			instantiateSoundModule: function () {
				this.soundModule = new exports.SoundModule();
				this.soundModule.init();
				this.soundModule.playMusic('music');
			},

			instantiateGeneralOptions: function () {
				this.generalOptionsComponent = new exports.GeneralOptionsComponent(this);
				this.generalOptionsComponent.init();
			},

			cacheElements: function () {
				this.wrapper 			 = $('#wrapper');
				this.presentationWrapper = $('.presentation-wrapper');
				this.gameWrapper 		 = $('.game-wrapper');
				this.userScore			 = $('.score-user').find('.score-number');
				this.pcScore	 		 = $('.score-computer').find('.score-number');
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
				var pcData;

				this.soundModule.playEffect('snap');
				pcData = this.computer.flipFirstCard(); //get all attributes

				this.compareData(playerData, pcData, playerData.attribute);
			},

			setScore: function (playerScore, pcScore) {
				this.userScore.text(this.score.player);
				this.pcScore.text(this.score.pc);
			},

			evaluateResult: function (playerValue, pcValue) {
				var result = '';

				if (playerValue > pcValue) {
					result = 'won';
					this.score.player++;
				} else if (playerValue == pcValue) {
					result = 'draw';
				} else {
					result = 'loose';
					this.score.pc++;
				}

				return result;
			},

			highlightLoser: function (result) {
				if (result === 'won') {
					this.computer.firstCardHtml.append('<div class="looser"></div>');

					this.computer.firstCardHtml.find('.ribbon').addClass('ribbon-looser').removeClass('display-none');
					this.player.firstCardHtml.find('.ribbon').addClass('ribbon-winner').removeClass('display-none');
				} else if (result === 'loose') {
					this.player.firstCardHtml.append('<div class="looser"></div>');

					this.computer.firstCardHtml.find('.ribbon').addClass('ribbon-winner').removeClass('display-none');
					this.player.firstCardHtml.find('.ribbon').addClass('ribbon-looser').removeClass('display-none');
				}
			},

			highlightAttribute: function (attr) {
				var queryClass = '.' + attr;
				
				this.player.firstCardHtml.find(queryClass).addClass('highlighted-attribute');
				this.computer.firstCardHtml.find(queryClass).addClass('highlighted-attribute');
			},

			compareData: function (playerData, pcData, attr) {
				var that 		= this,
					roundData,
					result		= '';
					playerValue = playerData.val,
					pcValue 	= pcData[attr];
					
				result = this.evaluateResult(playerValue, pcValue);

				this.setScore();

				setTimeout(function () {
					that.highlightLoser(result);
					that.highlightAttribute(attr);
					that.roundModal.open(result);
				}, 1000);

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
					this.onGameEnd();
				} else {
					this.roundEnded = true;
					
					this.checkEndProximity();
				}
			},

			/**
			 * Checks if the end is coming MUAHAHAHA... and loads the riot end song
			 */
			checkEndProximity: function () {
				var totalRounds = this.gameMode.selectedMode.rounds;

				if (totalRounds / 2 > this.currentRound) {
					if (!this.finalSoundLoaded) {
						this.soundModule.loadEffect('riot', 'audio/riot');
						this.soundModule.effects['riot'].setVolume(30);
						this.finalSoundLoaded = true;
					}
				}
			},

			onGameEnd: function () {
				var that = this;

				this.isEnded = true;

				if (this.score.player > this.score.pc) {
					this.soundModule.playEffect('riot');
				}

				setTimeout(function () {
					that.evaluateRate();
					that.roundModal.close();
				}, 1500);
			},

			evaluateRate: function () {
				var totalRounds = this.gameMode.selectedMode.rounds,
					page 		= 'p1',
					extension   = ['.', 'h', 't', 'm', 'l'].join(''),
					percentage  = this.score.player/totalRounds * 100;

				if (percentage > 80) {
					page = 'c17';
				} else if (50 < percentage && percentage <= 80) {
					page = 'm2';
				}

				page += extension;

				this.getScreen(page);
			},

			getScreen: function (url) {
				var that = this;

				$.ajax({
			        type: 'GET',
			        url: url,
			        dataType: 'html',
			        success: function(data) {
						that.appendScreen(data);
		        	},
		        	error: function (e) {
		        		console.log(e)
		        	}
	     		});
			},

			appendScreen: function (data) {
				this.wrapper.find('#logo').addClass('display-none');
				this.wrapper.removeClass('field-image');
				this.wrapper.append(data);
				this.gameWrapper.addClass('display-none');
			},

			onRoundConfirmed: function () {
				if (this.roundEnded) {
					this.removeFlipped();
					this.soundModule.playEffect('snap');
					this.player.flipFirstCard();

					this.roundEnded = false;
				}
			},

			removeFlipped: function () {
				this.player.removeFlipped();
				this.computer.removeFlipped();
			},

			onGameModeScreen: function () {
				this.soundModule.loadEffect('startWhistle', 'audio/startWhistle');
				this.soundModule.loadEffect('snap', 'audio/snap')
			},

			onGameModeChoosed: function (data) {
				var that = this;

				this.gameWrapper.removeClass('display-none');
				this.presentationWrapper.addClass('display-none');
				this.wrapper.addClass('field-image');

				this.gameMode.setMode(data.mode);
				this.isStarted = true;

				this.soundModule.playEffect('startWhistle');

				setTimeout(function () {
					that.soundModule.playEffect('snap');
					that.player.flipFirstCard();
				}, 300);
			},

			onGeneralConfigClicked: function (isOpened) {
				if (isOpened) {
					this.startModal.onOptionClicked('configurations');
					this.gameWrapper.addClass('display-none');
					this.wrapper.find('#share-container').addClass('display-none');
				} else {
					this.startModal.onOptionClicked('initial');
				}

				if (this.isStarted && isOpened) {
					this.startModal.$el.removeClass('display-none');
				}

				if (this.isStarted && !isOpened) {
					this.gameWrapper.removeClass('display-none');
					this.startModal.$el.addClass('display-none');
				}

				if (!this.isStarted) {
					this.startModal.$el.removeClass('display-none');
				}

				if (this.isEnded && isOpened) {
					this.gameWrapper.addClass('display-none');
					this.startModal.$el.removeClass('display-none');
					this.wrapper.find('#share-container').addClass('display-none');
				}

				if (this.isEnded && !isOpened) {
					this.gameWrapper.addClass('display-none');
					this.startModal.$el.addClass('display-none');
					this.wrapper.find('#share-container').removeClass('display-none');
				}
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

				$(window).on('onGameModeScreen', function () {
					that.onGameModeScreen();
				});

				$(window).on('generalConfigClicked', function (e, data) {
					that.onGeneralConfigClicked(data.isOpened)
				});
			}
		}
	};

	window.onload = function () {
		var GM = new GameMaster();
		GM.init();
	};
})();