var Computer = function () {
	return {
		init : function () {
			this.deckHtml = $('#computer');
			this.deck = [];
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
		}
	}
}