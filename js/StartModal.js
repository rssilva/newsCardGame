var exports = {};

(function () {
	exports.createCookie = function(name, value, days) {
	    var expires;
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        expires = "; expires=" + date.toGMTString();
	    }
	    else {
	        expires = "";
	    }
	    document.cookie = name + "=" + value + expires + "; path=/";
	}

	exports.getCookie = function (c_name) {
	    if (document.cookie.length > 0) {
	        c_start = document.cookie.indexOf(c_name + "=");
	        if (c_start != -1) {
	            c_start = c_start + c_name.length + 1;
	            c_end = document.cookie.indexOf(";", c_start);
	            if (c_end == -1) {
	                c_end = document.cookie.length;
	            }
	            return unescape(document.cookie.substring(c_start, c_end));
	        }
	    }
	    return "";
	}

	var StartModal = function (options) {
		return {
			init: function () {
				this.options 	= options;
				this.$el 		= this.options.$el;

				this.initConfigurations();

				this.bindEvents();
			},

			open: function () {
				this.options.$el.removeClass('display-none');
			},

			close: function () {
				this.options.$el.addClass('display-none');
			},

			initConfigurations: function () {
				var cookieConfig = this.getConfigFromCookie(),
					$configEl	 = this.options.$el.find('.game-configurations');

				if (cookieConfig.musicOn) {
					$configEl.find('.game-config-music-label').addClass('isOn');
				} else {
					$configEl.find('.game-config-music-label').removeClass('isOn');
				}

				if (cookieConfig.effectsOn) {
					$configEl.find('.game-config-effects-label').addClass('isOn');
				} else {
					$configEl.find('.game-config-effects-label').removeClass('isOn');
				}
			},

			getConfigFromCookie: function () {
				var data 		= {},
					musicOn 	= exports.getCookie('mano-a-mano-musicOn'),
					effectsOn 	= exports.getCookie('mano-a-mano-effectsOn');
				
				if (musicOn === 'true' || musicOn === '') {
					musicOn = true;
				}

				if (musicOn === 'false') {
					musicOn = false;
				}

				if (effectsOn === 'true' || effectsOn === '') {
					effectsOn = true;
				}

				if (effectsOn === 'false') {
					effectsOn = false;
				}

				data.musicOn 	= musicOn;
				data.effectsOn 	= effectsOn;

				return data;
			},

			onOptionClicked: function (option) {
				if (option === 'initial') {
					this.toInitialOptions();
				} else if (option === 'start') {
					this.toGameModeOptions();
				} else if (option === 'instructions') {
					this.toInstructions();
				} else if (option === 'configurations') {
					this.toConfigurations();
				}
			},

			toInitialOptions: function () {
				this.$el.find('.start-options-list').removeClass('display-none');

				this.$el.find('.game-options').addClass('display-none');
				this.$el.find('.game-instructions').addClass('display-none');
				this.$el.find('.game-configurations').addClass('display-none');
			},

			toGameModeOptions: function () {
				$(window).trigger('onGameModeScreen');

				this.$el.find('.game-options').removeClass('display-none');

				this.$el.find('.start-options-list').addClass('display-none');
				this.$el.find('.game-instructions').addClass('display-none');
				this.$el.find('.game-configurations').addClass('display-none');
			},

			toInstructions: function () {
				this.$el.find('.game-instructions').removeClass('display-none');

				this.$el.find('.start-options-list').addClass('display-none');
				this.$el.find('.game-options').addClass('display-none');
				this.$el.find('.game-configurations').addClass('display-none');
			},

			toConfigurations: function () {
				this.$el.find('.game-configurations').removeClass('display-none');

				this.$el.find('.game-instructions').addClass('display-none');
				this.$el.find('.start-options-list').addClass('display-none');
				this.$el.find('.game-options').addClass('display-none');

				$(window).trigger('configOpened');
			},

			updateConfigurations: function () {
				var $el = this.$el.find('.game-configurations'),
					data;

				data = {
					musicOn: 	$el.find('.game-config-music-label').hasClass('isOn'),
					effectsOn: 	$el.find('.game-config-effects-label').hasClass('isOn')
				};

				exports.createCookie('mano-a-mano-musicOn', data.musicOn, 3);
				exports.createCookie('mano-a-mano-effectsOn', data.effectsOn, 3);

				$(window).trigger('updateConfigurations', data);
			},

			bindEvents: function () {
				var that = this,
					$el = this.options.$el;

				$el.find('.game-options').find('li').on('click', function () {
					$(window).trigger('gameModeChoosed', {
						mode: $(this).data('mode')
					});

					that.close();
				});

				$el.find('.start-options-list').find('li').on('click', function () {
					that.onOptionClicked($(this).data('option'));
				});

				$el.find('.game-instructions').find('.back-to-start-options').on('click', function () {
					that.onOptionClicked('initial');
				});

				$el.find('.game-configurations').find('.back-to-start-options').on('click', function () {
					$(window).trigger('configClosed', {isOpened: false});
				});

				// $el.find('.game-configurations').find('.ok-config-button').on('click', function () {
				// 	that.updateConfigurations();
				// 	that.onOptionClicked('initial');
				// });

				$el.find('.game-config-music-label').on('click', function () {
					$(this).toggleClass('isOn');
					that.updateConfigurations();
				});

				$el.find('.game-config-effects-label').on('click', function () {
					$(this).toggleClass('isOn');
					that.updateConfigurations();
				});
			}
		}
	};

	exports.StartModal = StartModal;
})();