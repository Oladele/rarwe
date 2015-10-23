import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'rarwe/tests/helpers/start-app';
import Pretender from 'pretender';
import httpStubs from '../helpers/http-stubs';

var server;

module('Acceptance | bands', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
    server.shutdown();
  }
});

// Test listing of bands
// ************************
test('visiting /bands', function(assert) {
  
  server = new Pretender(function() {
    var data = [ 
      {
        id: 1,
        type: "bands",
        attributes: {
          name: "Radiohead"
        }
      }, 
      {
        id: 2,
        type: "bands",
        attributes: {
          name: "Long Distance Calling"
        }
      },
    ];
    httpStubs.stubBands(this, data); 
  });


  visit('/bands');

  andThen(function() {
    assertLength(assert, '.band-link', 2, "All band links are rendered");
    assertLength(assert, '.band-link:contains("Radiohead")', 1, "First band link contains the band name");
    assertLength(assert, '.band-link:contains("Long Distance Calling")', 1, "The other band link contains the band name");
  });
});


// Test Creating a band
// ************************
test('Create a new band', function(assert) { 
  server = new Pretender(function() {
    httpStubs.stubBands(this,[
      {
        id: 1,
        attributes: {
          name: "Radiohead"
        }
      }
    ]);
    httpStubs.stubCreateBand(this, 2);
  });
  
  visit('/bands');
  fillIn('.new-band', 'Long Distance Calling');
  click('.new-band-button');


  andThen(function() {
    assert.equal(find('.band-link').length, 2, "All band links are rendered");
    assert.equal(find('.band-link:last').text().trim(), 'Long Distance Calling', "Created band appears at the end of the list");
    assert.equal(find('.nav a.active:contains("Songs")').length, 1, "The Songs tab is active");
  });
});

// Test Creating a song
// ************************
test('Create a new song in two steps', function(assert) { 
  server = new Pretender(function() {

    var dataBands = [
      {
        id: 1,
        type: "bands",
        attributes: {
          name: "Radiohead"
        }
      }
    ];

    httpStubs.stubBands(this,dataBands);
    httpStubs.stubSongs(this, 1, []);
    httpStubs.stubCreateSong(this, 2);
  });
  

  // visit('/');
  // click('.band-link:contains("Radiohead")');
  selectBand('Radiohead');
  click('a:contains("create one")');
  fillIn('.new-song', 'Killer Cars');
  // triggerEvent('.new-song-form', 'submit');
  submit('.new-song-form');

  
  andThen(function() {
    assert.equal(find('.songs .song:contains("Killer Cars")').length, 1, "Creates the song and displays it in the list");
  });
});





// Test Sorting
//*****************
test('Sort songs in various ways', function(assert) { server = new Pretender(function() {
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes: {
          name: "Them Crooked Vultures",
        }
      } 
    ]);
    
    httpStubs.stubSongs(this, 1, [
      {
        id: 1,
        attributes: {
          title: "Elephants",
          rating: 5
        }
      },
      {
        id: 2,
        attributes:{
          title: "New Fang",
          rating: 4 
        }
      },
      {
        id: 3,
        attributes: {
          title: "Mind Eraser, No Chaser",
          rating: 4 
        }
      },
      {
        id: 4,
        attributes: {
          title: "Spinning in Daffodils",
          rating: 5
        }
      }
    ]);
  });
  
  selectBand('Them Crooked Vultures');

  // Default order sorted by 'rating:desc', 'title:asc' 
  andThen(function() {
    
    assert.equal(currentURL(), '/bands/1/songs'); 

    assertTrimmedText(assert, '.song:first', 'Elephants', "The first song is the highest ranked, first in the alphabet");
      
    assertTrimmedText(assert, '.song:last', 'New Fang', "The last song is the lowest ranked, last in the alphabet");
  });
  
  click('button.sort-title-desc');

  // Url changes and song is sorted when user clicks to sortby title
  andThen(function() {
    
    assert.equal(currentURL(), '/bands/1/songs?sort=titleDesc'); assertTrimmedText(assert, '.song:first', 'Spinning in Daffodils', "The first song is the one that is the last in the alphabet");
    
    assertTrimmedText(assert, '.song:last', 'Elephants', "The last song is the one that is the first in the alphabet");
  
  });
  
  click('button.sort-rating-asc');

  // Url changes and song is sorted when user clicks to sortby rating
  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs?sort=ratingAsc'); assertTrimmedText(assert, '.song:first', 'Mind Eraser, No Chaser', "The first song is the lowest ranked, first in the alphabet");
    
    assertTrimmedText(assert, '.song:last', 'Spinning in Daffodils', "The last song is the highest ranked, last in the alphabet");
  });
});






// Test search
// ***************
test ('Search songs', (assert) =>{
  server = new Pretender(function(){
    httpStubs.stubBands(this, [
      {
        id: 1,
        attributes:{
          name: "Them Crooked Vultures",
        }
      }
    ]);
    
    httpStubs.stubSongs(this, 1, [
      {
        id: 1,
        attributes: {
          title: "Elephants",
          rating: 5
        }
      },
      {
        id: 2,
        attributes: {
          title: "New Fang",
          rating: 4
        }
      },
      {
        id: 3,
        attributes: {
          title: "Mind Eraser, No Chaser",
          rating: 4
        }
      },
      {
        id: 4,
        attributes: {
          title: "Spinning in Daffodils",
          rating: 5
        }
      },
      {
        id: 5,
        type: "songs",
        attributes: {
          title: "No One Loves Me & Neither Do I",
          rating: 5 
        }
      }
    ]);
  });


  visit('/bands/1');
  fillIn('.search-field', 'no');
  
  andThen(() => {
    assertLength(assert, '.song', 2, "The songs matching the search term are displayed");
  });

  click('button.sort-title-desc');
  
  andThen(() => {
    assertTrimmedText(assert, '.song:first', 'No One Loves Me & Neither Do I', "A matching song that comes later in the alphahet appears on top");

    assertTrimmedText(assert, '.song:last', 'Mind Eraser, No Chaser', "A matching song that comes sooner in the alphahet appears at the bottom ");
  });
});