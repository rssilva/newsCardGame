var exports = {};

(function () {
	var StartModal = function (options) {
		return {
			init: function () {
				this.options = options;
				this.bindEvents();
			},

			open: function () {
				this.options.$el.removeClass('display-none');
			},

			close: function () {
				this.options.$el.addClass('display-none');
			},

			onFirstOptionClicked: function (option) {
				if (option === 'start') {
					this.options.$el.find('.start-options-list').addClass('display-none');
					this.options.$el.find('.game-options').removeClass('display-none');
				}
			},

			bindEvents: function () {
				var that = this;

				this.options.$el.find('.game-options').find('li').on('click', function () {
					$(window).trigger('gameModeChoosed', {
						mode: $(this).data('mode')
					});

					that.close();
				});

				this.options.$el.find('.start-options-list').find('li').on('click', function () {
					that.onFirstOptionClicked($(this).data('option'))
				});
			}
		}
	};

	exports.StartModal = StartModal;
})();