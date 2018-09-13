// Read and set any environment variables using the dotenv package
require("dotenv").config();

// Import the node-spotify-api package in order to retrieve info from the Spotify API
var Spotify = require('node-spotify-api');

// Import the 'keys.js' file and store it in a variable
var keys = require('./keys.js');

// Access your keys' information
var spotify = new Spotify(keys.spotify);

var request = require("request");
var moment = require("moment");

var args = process.argv;
var command;

if (args.length > 2) {
    command = args[2];
}
else {
    console.log("No command provided to LIRI.");
}

// Remove first 3 arguments from the array of command-line arguments, 
// then join the remaining arguments with a space in between each pair of arguments
var commandlineinput = args.slice(3).join(" ");

switch(command) {
    case 'concert-this':
        //console.log("concert");
        // var request = require("request");
        // var moment = require("moment");
        var artist = commandlineinput;
        var bandsInTownURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        request(bandsInTownURL, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var output = JSON.parse(body);
                for (var i = 0; i < output.length; i++) {
                    //console.log(output[i]);
                    console.log("Name of the venue: " + output[i].venue.name);
                    var region = output[i].venue.region;
                    if (region != '') {
                        region = region + ", ";
                    }
                    console.log("Location of venue: " + output[i].venue.city + ", " + region + 
                        output[i].venue.country);
                    var date = moment(output[i].datetime).format("MM/DD/YYYY");
                    console.log("Date of the event: " + date + "\r\n");
                }
            }
        });
        break;

    case 'spotify-this-song':
        //console.log("spotify");
        // If no song is provided on the command line, then the program defaults to the song 
        // "The Sign" by Ace of Base
        var song = "the sign ace of base";
        if (commandlineinput != "") {
            song = commandlineinput;
        }
        spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        //spotify.search({ type: 'track', query: song}, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            //console.log(JSON.stringify(data,null,2));
            //var results = data.tracks.items;
            // for (var i = 0; i < results.length; i++) {
            //     console.log("Artist(s): " + results[i].album.artists[0].name);
            //     console.log("Name of the song: " + results[i].name);
            //     console.log("Preview link of the song from Spotify: " + results[i].preview_url);
            //     console.log("Album that the song is from: " + results[i].album.name);
            // }
            console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
            console.log("Name of the song: " + data.tracks.items[0].name);
            console.log("Preview link of the song from Spotify: " + data.tracks.items[0].preview_url);
            console.log("Album that the song is from: " + data.tracks.items[0].album.name + "\r\n");
        });
        break;

    case 'movie-this':
        console.log("movie");
        // If the user doesn't type a movie in on the command line, then the program defaults  
        // to the movie "Mr. Nobody"
        var movie = "Mr. Nobody";
        if (commandlineinput != "") {
            movie = commandlineinput;
        }
        var omdbURL = "https://www.omdbapi.com/?t=" + movie + "&plot=short&apikey=trilogy";
        request(omdbURL, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var output = JSON.parse(body);
                //console.log(output);
                console.log("Title of the movie: " + output.Title);
                console.log("Year the movie came out: " + output.Year);
                console.log("IMDB Rating of the movie: " + output.Ratings[0]['Value']);
                console.log("Rotten Tomatoes Rating of the movie: " + output.Ratings[1]['Value']);
                console.log("Country where the movie was produced: " + output.Country);
                console.log("Language of the movie: " + output.Language);
                console.log("Plot of the movie: " + output.Plot);
                console.log("Actors in the movie: " + output.Actors + "\r\n");
            }
        });
        break;

    case 'do-what-it-says':
        console.log("something else");
        break;

    default:
        console.log("default");
        break;
}