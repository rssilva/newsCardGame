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
				frontDiv = $('<div class="front"></div>');
				frontDiv.append($('<span class="card-name"></span>').text('???'));
				
				for (attribute in this.deck[counter].attributes) {
					span = $('<span isattr="true" class="' + attribute + '"></span>').text('???');
					frontDiv.append(span);
				}
				
				li.append(frontDiv, coverDiv.clone());
				ol.append(li);
			}

			this.deckHtml.append(ol.children());
		},
		
		flipFirstCard : function () {
			var listSize = this.deckHtml.find('li').length,
				firstCard = this.deck[listSize - 1],
				attribute;

			this.firstCardHtml = this.deckHtml.find('li:last-child');

			if (firstCard && !this.firstCardHtml.hasClass('flipped')) {
				this.firstCardHtml = this.deckHtml.find('li:last-child');
				this.firstCardHtml.find('.card-name').text(firstCard.name);

				for (attribute in firstCard.attributes) {
					this.firstCardHtml.find('.' + attribute).text(firstCard.attributes[attribute]);
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

			card.find('[isattr="true"]').on('click', function (e) {
				var src = e.target;

				//avoid multiple clicks in different attributes
				if (!that.attributeClicked) {
					that.attributeClicked = true;

					$(window).trigger('attributeClicked', {
						attribute: src.className,
						val: src.innerText
					});
				}
			});
		},

		removeFlipped: function () {
			var that = this;

			//removes the attributes events to avoid memody leak
			this.firstCardHtml.find('[isattr="true"]').off('click');
			this.firstCardHtml.remove();
		},
		
		bindEvents : function () {
			var player = this;
		
			$('#start').on('click', function () {
				this.remove();
				player.flipFirstCard();
			});
		}
	}
}