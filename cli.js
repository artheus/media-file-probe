#!/usr/bin/env node

var opts = require('minimist')(process.argv.slice(2)),
    MediaFileProbe = require('media-file-probe');

var probe = new MediaFileProbe();
var filename = opts._[0];

probe
	.probe(filename)
	.on('metadata', function(data) {
		console.log(data);
	});