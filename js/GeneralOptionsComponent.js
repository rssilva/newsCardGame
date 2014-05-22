(function () {
	var GeneralOptionsComponent = function (gameMaster) {
		return {
			init: function () {
				var that = this, 
					container = $('.game-general-options'),
					musicButton = container.find('.general-music-button'),
					isMuted = this.isMuted();

				this.configButton = container.find('.general-configurations-button');

				this.bindEvents();

				if (isMuted) {
					musicButton.addClass('isMuted');
					$(window).trigger('muteAction', {isMuted: isMuted});
				}

				musicButton.on('click', function () {
					musicButton.toggleClass('isMuted');
					musicButton.find('.button-mask').toggleClass('isMuted')

					that.onMusicButtonClick(musicButton)
				});

				this.configButton.on('click', function () {
					that.configButton.toggleClass('opened');

					that.onConfigButtonClick(that.configButton);
				});
			},

			isMuted: function () {
				var isMuted = exports.getCookie('mano-a-mano-isMuted');

				if (isMuted === 'true') {
					isMuted = true;
				}

				if (isMuted === 'false' || isMuted === '') {
					isMuted = false;
				}

				return isMuted;
			},

			onMusicButtonClick: function (el) {
				var isMuted = el.hasClass('isMuted');

				exports.createCookie('mano-a-mano-isMuted', isMuted, 3)

				$(window).trigger('muteAction', {isMuted: isMuted});
			},

			onConfigButtonClick: function (el) {
				$(window).trigger('generalConfigClicked', {isOpened: el.hasClass('opened')});
			},

			bindEvents: function () {
				var that = this;

				$(window).on('configOpened', function () {
					that.configButton.addClass('opened');
				});

				$(window).on('configClosed', function () {
					that.configButton.removeClass('opened');
					$(window).trigger('generalConfigClicked', {isOpened: false});
				});
			}
		}
	}

	exports.GeneralOptionsComponent = GeneralOptionsComponent;
})();