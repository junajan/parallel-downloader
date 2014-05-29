var http = require('http');
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');

// url of mp3 files
var url = "http://www.project98.com/podcast/startups-for-the-rest-of-us-";
var urlTld = ".mp3";

// concurency of downloads - only 10 concurrent downloading at the time
var CONCURENCY = 10;

// last podcast ID
var maxId = 186;


/**
 * Left pad by zeros
 */
function lZeroPad(str) {

	var pad = "000";
	str = String(str);
	return pad.substring(0, pad.length - str.length) + str;
}

/**
 * Download single file
 */
function download(id, done) {

    var link = url + lZeroPad(id) + urlTld;
    var fileName = link.split("/");
    console.log(" > Downloading ID: "+ id, fileName[fileName.length -1]);

    var file = fs.createWriteStream("downloads/" + fileName[fileName.length -1]);
    var request = http.get(link, function(response) {
        response.pipe(file);
        console.log(" < Downloaded ID: ", id);
        done(null);
    });
}

/**
 * Get IDs in array (for async eachLimit function)
 */
function makeIds(min, max) {
    var out = [];
    
    for (var i = min; i <= max; i++)
        out.push(i);

    return out;
}

/**
 * Download all podcasts in parallel
 */
function downloadAll(count) {

    var all = makeIds(1, count);
    
	mkdirp('downloads', function(err) { 
	    async.eachLimit(all, CONCURENCY, download, function() {
			console.log( "====== Downloaded ALL ======" );
	    });
	});
}


downloadAll(maxId);