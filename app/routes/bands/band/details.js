import Ember from 'ember';

export default Ember.Route.extend({
	// Began by adding below model hook but since Ember 1.5.0 child routes inherit the model of their parent by default. That means we could remove the above _le altogether and the page would still work.
	// model: function(argument) {
	// 	return this.modelFor('bands.band');
	// }
});
