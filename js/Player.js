(function () {
	var Player = function () {
		return {
			init : function () {
				this.deckHtml = $('#player');
				this.deck = [];
				
				this.bindEvents();
			},
			
			renderDeck : function () {
				var deckSize 	= this.deck.length,
					ol 			= $('<ol></ol>'),
					coverDiv 	= $('<div class="cover"></div>'),
					frontDiv, counter, li, span, attribute;
				
				for (counter = 0; counter < deckSize; counter++) {
					li = $('<li class="card card-' + counter + '"></li>')
					li.append($('<div class="ribbon ribbon-player display-none"></div>'));
					frontDiv = $('<div class="front"></div>');
					frontInnerDiv = $('<div class="front-inner"></div>');
					frontInnerDiv.append($('<span class="avatar"></span>'));
					frontInnerDiv.append($('<span class="card-name"></span>').html('???'));
					
					for (attribute in this.deck[counter].attributes) {
						span = $('<span data-attr="' + attribute + '" data-attribute="' + exports.dictionary[attribute] + '" class="attribute ' + attribute + '"></span>').html('???');
						frontInnerDiv.append(span);
					}
					
					frontDiv.append(frontInnerDiv);
					li.append(frontDiv, coverDiv.clone());
					ol.append(li);
				}

				this.deckHtml.append(ol.children());
			},

			getPlayerClass: function (name) {
				var playerClass = name.toLowerCase();

				playerClass = playerClass.replace(/ /g, '-');

				playerClass = playerClass.replace(/[^a-z ]/g, '');

				return playerClass
			},
			
			flipFirstCard : function () {
				var listSize = this.deckHtml.find('li').length,
					firstCard = this.deck[listSize - 1],
					playerClass,
					attribute,
					bgImage;

				this.firstCardHtml = this.deckHtml.find('li:last-child');

				if (firstCard && !this.firstCardHtml.hasClass('flipped')) {				
					this.firstCardHtml = this.deckHtml.find('li:last-child');
					this.firstCardHtml.attr('title', firstCard.infoExtra);

					playerClass = this.getPlayerClass(firstCard.name);

					this.firstCardHtml.addClass(playerClass);
					this.firstCardHtml.find('.avatar').addClass('right-player')
					this.firstCardHtml.find('.card-name').html(firstCard.name);

					for (attribute in firstCard.attributes) {
						this.firstCardHtml.find('.' + attribute).html(firstCard.attributes[attribute]);
					}
					
					this.firstCardHtml.addClass('flipped');

					//binds the attributes clicks
					this.bindCardEvents(this.firstCardHtml)
				}

				this.firstCardHtml.addClass('flipped');
			},

			bindCardEvents: function (card) {
				var that = this;

				this.attributeClicked = false;

				card.find('.attribute').on('click', function (e) {
					var src = e.target;

					//avoid multiple clicks in different attributes
					that.onAtrributeClicked(src);
				});
			},

			onAtrributeClicked: function (src) {
				if (!this.attributeClicked) {
					this.attributeClicked = true;

					$(window).trigger('attributeClicked', {
						name 		: $(src.parentNode).find('.card-name').text(),
						attribute 	: $(src).data('attr'),
						val 		: src.textContent
					});
				}
			},

			removeFlipped: function () {
				var that = this;

				//removes the attributes events to avoid memory leak
				this.firstCardHtml.find('.attribute').off('click');
				this.firstCardHtml.remove();
			},
			
			bindEvents : function () {
				var player = this;
			
				// $('#start').on('click', function () {
				// 	this.remove();
				// 	player.flipFirstCard();
				// });
			}
		}
	}

	exports.Player = Player;
})();