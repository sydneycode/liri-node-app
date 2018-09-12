// Read and set any environment variables using the dotenv package
require("dotenv").config();

// Import the 'keys.js' file and store it in a variable
var keys = require('keys.js');

// Access your keys' information
var spotify = new Spotify(keys.spotify);

switch(command) {
    case 'concert-this':
        console.log("concert");
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