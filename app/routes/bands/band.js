import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		var bands = this.modelFor('bands');
		return bands.get('content').findBy('slug', params.slug);
		// params.slug is now 'pearl-jam'
	},

	afterModel: function(band) {
		var description = band.get('description');
		if (Ember.isEmpty(description)) {
			this.transitionTo('bands.band.songs');
		} else {
      this.transitionTo('bands.band.details');
    }
	}	
});