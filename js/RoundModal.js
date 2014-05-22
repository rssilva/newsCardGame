(function () {
	var roundModal = {
		$el: $('#round-confirm-modal'),
		label: {
			'won': 		'Parabéns',
			'loose': 	'Não foi dessa vez',
			'draw': 	'Empate'
		},
		open: function (result) {
			var that = this;

			this.$el[0].textContent = this.label[result];
			this.$el.removeClass('display-none');

			setTimeout(function () {
				$(window).trigger('confirmRound');
				that.close();
			}, 1000);
		},
		close: function () {
			this.$el.addClass('display-none');
		}
	}

	exports.roundModal = roundModal;
})();