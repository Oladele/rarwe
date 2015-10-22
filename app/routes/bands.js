import Ember from 'ember';

// Definitions: Use Model defs instead of Ember.Object

import Band from '../models/band';
// var Band = Ember.Object.extend({ 
// 	name: '',
// 	slug: Ember.computed('name', function(){
// 		return this.get('name').dasherize();
// 	}),
// });

import Song from '../models/song';
// var Song = Ember.Object.extend({ 
// 	title: '',
// 	rating: 0,
// 	band: ''
// });


// Songs Seed Data
var blackDog = Song.create({ 
	title: 'Black Dog', 
	band: 'Led Zeppelin', 
	rating: 3
});

var yellowLedbetter = Song.create({ 
	title: 'Yellow Ledbetter',
	band: 'Pearl Jam',
	rating: 4
});

var daughter = Song.create({ 
	title: 'Daughter',
	band: 'Pearl Jam',
	rating: 5
});

var pretender = Song.create({ 
	title: 'The Pretender', 
	band: 'Foo Fighters', 
	rating: 2
});

//Bands Seed Data
var BandsCollection = Ember.Object.extend({
	content: [],
	sortProperties: ['name:desc'],
	sortedContent: Ember.computed.sort('content', 'sortProperties'),
});

var ledZeppelin = Band.create({ 
	name: 'Led Zeppelin', 
	songs: [blackDog] 
});

var pearlJam = Band.create({ 
	name: 'Pearl Jam', 
	songs: [daughter, yellowLedbetter],
	description: 'Pearl Jam is an American rock band, formed in Seattle, Washington in 1990.'
});

var fooFighters = Band.create({ 
	name: 'Foo Fighters', 
	songs: [pretender] 
});


var bands = BandsCollection.create();
bands.get('content').pushObjects([ledZeppelin, pearlJam, fooFighters]);

export default Ember.Route.extend({
	model: function(){
		return bands;
	},

	actions: {
		didTransition: function() {
      document.title = 'Bands - Rock & Roll';
    },

		createBand: function(){
			var name = this.get('controller').get('name');
			var band = Band.create({ name: name });
			bands.get('content').pushObject(band);
			this.get('controller').set('name','');
			this.transitionTo('bands.band.songs', band);
		}
	}
});
