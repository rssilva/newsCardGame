var Computer = function () {
	return {
		init : function () {
			this.deckHtml = $('#computer');
			this.deck = [];
		},

		getPlayerClass: function (name) {
			var playerClass = name.toLowerCase();

			playerClass = playerClass.replace(/ /g, '-');

			playerClass = playerClass.replace(/[^a-z ]/g, '');

			return playerClass
		},
		
		renderDeck : function () {
			var deckSize 	= this.deck.length,
				ol 			= $('<ol></ol>'),
				coverDiv 	= $('<div class="cover"></div>'),
				frontDiv, counter, li, span, attribute;
			
			for (counter = 0; counter < deckSize; counter++) {
				li = $('<li class="card card-' + counter + '"></li>')
				frontDiv = $('<div class="front"></div>');
				frontInnerDiv = $('<div class="front-inner"></div>');
				frontInnerDiv.append($('<span class="avatar"></span>'));
				frontInnerDiv.append($('<span class="card-name"></span>').html('???'));
				
				for (attribute in this.deck[counter].attributes) {
					span = $('<span data-attr="' + attribute + '" data-attribute="' + dictionary[attribute] + '" class="attribute ' + attribute + '"></span>').html('???');
					frontInnerDiv.append(span);
				}
				
				frontDiv.append(frontInnerDiv);
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

			if (firstCard && !this.firstCardHtml.hasClass('flipped')) {
				this.firstCardHtml = this.deckHtml.find('li:last-child');
				//this.firstCardHtml.find('.avatar').css('background-image', 'url(img/' + firstCard.uriName + 'computer.png');
				playerClass = this.getPlayerClass(firstCard.name);
				this.firstCardHtml.find('.card-name').html(firstCard.name);
				this.firstCardHtml.find('.avatar').addClass(playerClass + ' right-player');

				for (attribute in firstCard.attributes) {
					this.firstCardHtml.find('.' + attribute).html(firstCard.attributes[attribute]);
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