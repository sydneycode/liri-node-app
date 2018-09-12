// Read and set any environment variables using the dotenv package
//require("dotenv").config();

// Import the 'keys.js' file and store it in a variable
//var keys = require('keys.js');

// Access your keys' information
//var spotify = new Spotify(keys.spotify);


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
        var request = require("request");
        var moment = require("moment");
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
        console.log("spotify");
        break;

    case 'movie-this':
        console.log("movie");
        break;

    case 'do-what-it-says':
        console.log("something else");
        break;
        
    default:
        console.log("default");
        break;
}