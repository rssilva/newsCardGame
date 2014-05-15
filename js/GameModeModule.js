(function () {
	var GameModeModule = function (options) {
		return {
			init: function () {
				this.options = options;
				this.gameMaster = options.gameMaster;
			},

			setMode: function (mode) {
				this.selectedMode = new this.Mode(mode);

				this.selectedMode.init({
					gameMaster: this.gameMaster
				});
			},

			isOver: function () {
				return this.selectedMode.isOver();
			},

			Mode: function (name) {
				var list = {
					definedRounds: {
						init: function (options) {
							this.rounds 	= options.rounds || 5;
							this.gameMaster = options.gameMaster;
						},

						isOver: function () {
							var response = {
								isOver: false
							};

							if (this.gameMaster && this.gameMaster.currentRound === this.rounds) {
								response.isOver = true;
							}

							return response;
						}
					},

					complete: {
						init: function (options) {
							this.rounds = options.rounds || 3;
							this.gameMaster = options.gameMaster;
						},

						isOver: function () {
							var playerRest 		= this.gameMaster.player.deck.length,
								computerRest 	= this.gameMaster.computer.deck.length,
								currentRound 	= this.gameMaster.currentRound,
								response 		= {isOver: false};

							if (playerRest === currentRound || computerRest === currentRound) {
								response.isOver = true;
							}

							return response;
						}
					}
				};

				return list[name];
			}
		}
	};

	exports.GameModeModule = GameModeModule;
})();