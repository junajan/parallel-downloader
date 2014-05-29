var http = require('http');
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');

var url = "http://www.project98.com/podcast/startups-for-the-rest-of-us-";
var urlTld = ".mp3";

function lZeroPad(str) {

	var pad = "000";
	str = String(str);
	return pad.substring(0, pad.length - str.length) + str;
}

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

function makeIds(min, max) {
    var out = [];
    
    for (var i = min; i <= max; i++) {
        out.push(i);
    }

    return out;
}

function downloadAll(count) {

    var all = makeIds(1, count);

	mkdirp('downloads', function(err) { 
	    async.eachLimit(all, 5, download, function() {
			console.log( "====== Downloaded ALL ======" );
	    });
	});
}


downloadAll(186);