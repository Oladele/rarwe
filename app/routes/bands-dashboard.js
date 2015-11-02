import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return this.store.findAll('band');
	},

	actions: {
		didTransition: function() {
      document.title = 'Bands - Dashboard';
    }
	}
});
