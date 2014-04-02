var Player = function () {
	return {
		init : function () {
			this.deckHtml = $('#player');
			this.deck = [];
			this.firstCardHtml = this.deckHtml.find('li:first-child');
			
			this.bindEvents();
		},
		
		renderDeck : function () {
			var deckSize = this.deck.length,
				coverDiv = $('<div class="cover"></div>'),
				frontDiv, counter, li, span, attribute;
			
			for (counter = 0; counter < deckSize; counter++) {
				li = $('<li class="card card-' + counter + '"></li>')
				frontDiv = $('<div class="front"></div>');
				frontDiv.append($('<span class="card-name"></span>').text('???'));
				
				for (attribute in this.deck[counter].attributes) {
					span = $('<span class="' + attribute + '"></span>').text('???');
					frontDiv.append(span);
				}
				
				li.append(frontDiv, coverDiv.clone());
				this.deckHtml.append(li);
			}
		},
		
		flipFirstCard : function () {
			var firstCard = this.deck[this.deck.length-1],
				attribute;
		
			this.firstCardHtml = this.deckHtml.find('li:last-child');
			this.firstCardHtml.find('.card-name').text(firstCard.name);
			
			for (attribute in firstCard.attributes) {
				this.firstCardHtml.find('.' + attribute).text(firstCard.attributes[attribute]);
			}
			
			this.firstCardHtml.addClass('flipped');
		},
		
		bindEvents : function () {
			var player = this;
		
			this.deckHtml.on('click', function () {
				player.flipFirstCard();
			});
		}
	}
}