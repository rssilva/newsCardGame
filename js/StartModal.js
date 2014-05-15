var exports = {};

(function () {
	var StartModal = function (options) {
		return {
			init: function () {
				this.options 	= options;
				this.$el 		= this.options.$el;

				this.bindEvents();
			},

			open: function () {
				this.options.$el.removeClass('display-none');
			},

			close: function () {
				this.options.$el.addClass('display-none');
			},

			onOptionClicked: function (option) {
				if (option === 'initial') {
					this.toInitialOptions();
				} else if (option === 'start') {
					this.toGameModeOptions();
				} else if (option === 'instructions') {
					this.toInstructions();
				}
			},

			toInitialOptions: function () {
				this.$el.find('.start-options-list').removeClass('display-none');

				this.$el.find('.game-instructions').addClass('display-none');
				this.$el.find('.game-options').addClass('display-none');
			},

			toGameModeOptions: function () {
				this.$el.find('.start-options-list').addClass('display-none');
				this.$el.find('.game-instructions').addClass('display-none');

				this.$el.find('.game-options').removeClass('display-none');
			},

			toInstructions: function () {
				this.$el.find('.game-instructions').removeClass('display-none');

				this.$el.find('.start-options-list').addClass('display-none');
				this.$el.find('.game-options').addClass('display-none');
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

				$el.find('.back-to-start-options').on('click', function () {
					that.onOptionClicked('initial');
				});
			}
		}
	};

	exports.StartModal = StartModal;
})();