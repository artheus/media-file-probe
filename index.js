#!/usr/bin/env node

// This index file is just for showing how to use the module.

var opts = require('minimist')(process.argv.slice(2)),
	MediaFileProbe = require('./mediafileprobe');

var probe = new MediaFileProbe();
var filename = opts._[0];

probe
	.probe(filename)
	.on('metadata', function(data) {
		console.log(data);
	});