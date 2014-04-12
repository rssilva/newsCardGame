var Computer = function () {
	return {
		init : function () {
			this.deckHtml = $('#computer');
			this.deck = [];
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
					span = $('<span class="' + attribute + '"></span>').text('???');
					frontDiv.append(span);
				}
				
				li.append(frontDiv, coverDiv.clone());
				ol.append(li);
			}

			this.deckHtml.append(ol.children());
		},


		flipFirstCard : function () {
			var listSize 	= this.deckHtml.find('li').length,
				firstCard 	= this.deck[listSize - 1],
				values    	= {},
				attribute;

			this.firstCardHtml = this.deckHtml.find('li:last-child');

			if (!this.firstCardHtml.hasClass('flipped')) {
				this.firstCardHtml = this.deckHtml.find('li:last-child');
				this.firstCardHtml.find('.card-name').text(firstCard.name);

				for (attribute in firstCard.attributes) {
					this.firstCardHtml.find('.' + attribute).text(firstCard.attributes[attribute]);
					values[attribute] = firstCard.attributes[attribute];
				}
				
				this.firstCardHtml.addClass('flipped');
			}

			this.firstCardHtml.addClass('flipped');

			values.name = this.firstCardHtml.find('.card-name').text();

			return values;
		},

		removeFlipped: function () {
			this.firstCardHtml.remove();
		},
	}
}