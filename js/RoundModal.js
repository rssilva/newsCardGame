var roundModal = {
	$el: $('#round-confirm-modal'),
	open: function () {
		this.$el.removeClass('display-none');
	},
	close: function () {
		this.$el.addClass('display-none');
	},
	bindEvents: function () {
		var that = this;

		this.$el.find('.ok-button').on('click', function () {
			$(window).trigger('confirmRound');
			that.close();
		});
	}
}