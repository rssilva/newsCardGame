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

		bindEvents: function () {
			var that = this;

			this.options.$el.find('.game-options').find('li').on('click', function () {
				$(window).trigger('gameModeChoosed', {
					mode: $(this).data('mode')
				});

				that.close();
			});
		}
	}
};