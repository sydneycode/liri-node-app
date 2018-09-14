// Read and set any environment variables using the dotenv package
require("dotenv").config();

// Import the node-spotify-api package in order to retrieve info from the Spotify API
var Spotify = require('node-spotify-api');

// Import the 'keys.js' file and store it in a variable
var keys = require('./keys.js');

// Access your keys' information
var spotify = new Spotify(keys.spotify);

// Require the request, moment, and fs packages
var request = require("request");
var moment = require("moment");
var fs = require("fs");

// Store the array of command-line arguments in the args variable
var args = process.argv;

var command;
if (args.length > 2) {
    command = args[2];
}

// Remove first 3 arguments from the array of command-line arguments, 
// then join the remaining arguments with a space in between each pair of arguments
var commandlineinput = args.slice(3).join(" ");

var liriCommand = args.slice(2).join(" ");

function getInfo(instruction, input) {
    var dataToLog = "";
    switch(instruction) {
        case 'concert-this':
            //console.log("concert");
            var artist = input;
            var bandsInTownURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
            request(bandsInTownURL, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    var output = JSON.parse(body);
                    for (var i = 0; i < output.length; i++) {
                        //console.log(output[i]);
                        dataToLog += "Name of the venue: " + output[i].venue.name + "\r\n";
                        var region = output[i].venue.region;
                        if (region != '') {
                            region = region + ", ";
                        }
                        dataToLog += "Location of venue: " + output[i].venue.city + ", " + region + 
                            output[i].venue.country + "\r\n";
                        var date = moment(output[i].datetime).format("MM/DD/YYYY");
                        dataToLog += "Date of the event: " + date + "\r\n\r\n"; 
                    }

                    // Log the data to the console and write it to the log file
                    console.log(dataToLog);
                    writeInfoToFile(liriCommand + "\r\n" + dataToLog);
                }
            });
            
            break;

        case 'spotify-this-song':
            //console.log("spotify");
            // If no song is provided on the command line, then the program defaults to the song 
            // "The Sign" by Ace of Base
            var song = "the sign ace of base";
            if (input != "") {
                song = input;
            }
            //spotify.search({ type: 'track', query: song}, function(err, data) {
            spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
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
                // Get the necessary data for one song
                dataToLog += "Artist(s): " + data.tracks.items[0].album.artists[0].name + "\r\n";
                dataToLog += "Name of the song: " + data.tracks.items[0].name + "\r\n";
                dataToLog += "Preview link of the song from Spotify: " + data.tracks.items[0].preview_url + "\r\n";
                dataToLog += "Album that the song is from: " + data.tracks.items[0].album.name + "\r\n\r\n";

                // Log the data to the console and write it to the log file
                console.log(dataToLog);
                writeInfoToFile(liriCommand + "\r\n" + dataToLog);
            });
            break;

        case 'movie-this':
            //console.log("movie");
            // If the user doesn't type a movie in on the command line, then the program defaults  
            // to the movie "Mr. Nobody"
            var movie = "Mr. Nobody";
            if (input != "") {
                movie = input;
            }
            var omdbURL = "https://www.omdbapi.com/?t=" + movie + "&plot=short&apikey=trilogy";
            request(omdbURL, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    var output = JSON.parse(body);
                    //console.log(output);
                    dataToLog =
                        "Title of the movie: " + output.Title + "\r\n" +
                        "Year the movie came out: " + output.Year + "\r\n" +
                        "IMDB Rating of the movie: " + output.Ratings[0]['Value'] + "\r\n" +
                        "Rotten Tomatoes Rating of the movie: " + output.Ratings[1]['Value'] + "\r\n" +
                        "Country where the movie was produced: " + output.Country + "\r\n" +
                        "Language of the movie: " + output.Language + "\r\n" +
                        "Plot of the movie: " + output.Plot + "\r\n" +
                        "Actors in the movie: " + output.Actors + "\r\n\r\n";
                    
                    // Log the data to the console and write it to the log file
                    console.log(dataToLog);
                    writeInfoToFile(liriCommand + "\r\n" + dataToLog);
                }
            });
            break;

        case 'do-what-it-says':
            //console.log("something else");
            fs.readFile("random.txt", "utf8", function(error, data) {
                // Handle any errors by printing to the console
                if (error) {
                    return console.log(error);
                }
                //console.log(data);
            
                // Split up the two comma-separated strings from the input file
                var dataArr = data.split(",");
                //console.log(dataArr);
                getInfo(dataArr[0], dataArr[1]);            
            });
            break;

        default:
            //console.log("default");
            console.log("No command provided to LIRI");
            break;
    }
}

function writeInfoToFile(info) {
    fs.appendFile("log.txt", info, function(err) {
        // Log any errors to the console
        if (err) {
          console.log(err);
        }
        else {
          console.log("Content added to log.txt");
        }
    });
}

getInfo(command, commandlineinput);
