var twitterKeys = require('./keys.js');
var inquirer = require('inquirer');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('spotify');

var spotifySearchArtists = [];

var client = new Twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

inquirer.prompt([

  {
    type: "list",
    name: "liriCommands",
    message: "Hi. I'm Liri, what can I do for you?",
    choices: ["Read tweets.", "Play music.", "Find movie info.", "Die."]
  }
]).then(function(answer){
  console.log("Answers are: "+ answer.liriCommands);
  switch (answer.liriCommands) {
    case "Read tweets.":
      var params = {screen_name: 'stephenwoosley'};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          console.log("*************** TWEETS ******************************");
          for (var t = 0; t < 3; t++){
            console.log("Tweet #"+(t+1) + ": " + tweets[t].text);
            console.log("----------" + tweets[t].created_at);
          }
          console.log("*****************************************************");
        }
      });
      break;
    case "Play music.":
      inquirer.prompt([
        {
          type: "input",
          name: "song",
          message: "Which song should I search for?",
          default: "The Sign by Ace of Base"
        }
      ]).then(function(response){
        console.log("*************** SPOTIFY *****************************");
        Spotify.search({ type: 'track', query: response.song }, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            for (var s = 0; s < 3; s++){
              var currentArtist = data.tracks.items[s].artists[0].name;
              var currentTrackName = data.tracks.items[s].name;
              var previewLink = data.tracks.items[s].external_urls.spotify;
              var albumName = data.tracks.items[s].album.name;
              console.log("--- Result " + (s + 1)+ ": \n Artist: " + currentArtist + "\n Track: "+ currentTrackName + "\n Link: " + previewLink + "\n Album: " + albumName);
              spotifySearchArtists.push(currentArtist);
            };
            console.log("*****************************************************");
            // console.log("before songList prompt");
        }); // end SPOTIFY SEARCH
      });
      break;
    case "Find movie info.":

      break;
    // case "Read tweets":
    //
    //   break;
    // default:

  }
});


// first.then(function() {
//   inquirer.prompt([
//   {
//     type: "list",
//     name: "songList",
//     message: "Do any of these artists ring a bell?",
//     choices: [spotifySearchArtists[0], spotifySearchArtists[2], spotifySearchArtists[2], spotifySearchArtists[3], spotifySearchArtists[4]]
//   }
//   ]).then(function(choice){
//       console.log("chosen artist is "+ choice.songList);
//   }); // end inquirer prompt then INSIDE SPOTIFY STUFF
// }); // end first.then function
