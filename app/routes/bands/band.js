import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		var bands = this.modelFor('bands');
		// return bands.get('content').findBy('slug', params.slug);
		// params.slug is now 'pearl-jam'
		return this.store.findRecord('band', params.id);
		// use ember data to fetch from server
	}
});