(function () {
	var GeneralOptionsComponent = function (gameMaster) {
		return {
			init: function () {
				var that = this, 
					container = $('.game-general-options'),
					musicButton = container.find('.general-music-button'),
					configButton = container.find('.general-configurations-button'),
					isMuted = this.isMuted();

				if (isMuted) {
					musicButton.addClass('isMuted');
					$(window).trigger('muteAction', {isMuted: isMuted});
				}

				musicButton.on('click', function () {
					musicButton.toggleClass('isMuted');
					musicButton.find('.button-mask').toggleClass('isMuted')

					that.onMusicButtonClick(musicButton)
				});

				configButton.on('click', function () {
					configButton.toggleClass('opened')

					that.onConfigButtonClick(configButton);
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
				if (el.hasClass('opened')) {
					gameMaster.startModal.onOptionClicked('configurations');
				} else {
					gameMaster.startModal.onOptionClicked('initial');
				}
			}
		}
	}

	exports.GeneralOptionsComponent = GeneralOptionsComponent;
})();