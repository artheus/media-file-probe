var util = require('util'),
    spawn = require('child_process').spawn,
    EventEmitter = require('events').EventEmitter,
    readline = require('readline'),
    fs = require('fs');


function MediaFileProbe() {
  if (!(this instanceof MediaFileProbe)) return new MediaFileProbe();

  self = this;
  
  EventEmitter.call(this);

  this.probe = function(mediaFile) {

    var child = spawn('ffprobe', ['-show_format', '-show_streams', mediaFile]);

    var metadataLines = readline.createInterface({
      input: child.stdout,
      output: process.stdout,
      terminal: false
    });

    var result = '';

    var outputMatch = /(\[(STREAM|FORMAT)\]([\s\S]*?)\[\/\2\])+/gm

    metadataLines.on('line', function(line) {
      result += line + '\n';
    });

    child.on('close', function(code){
      var matches = result.match(outputMatch);

      var outputData = {'stream': {}, 'format': {}};

      var streamIndex = 0;
      var formatIndex = 0;

      matches.forEach(function(group) {
        var groupArray = group.split('\n');
        var type = groupArray.shift().slice(1,-1).toLowerCase();

        // Remove the last element (closing brackets)
        groupArray.pop();

        var groupIndex = (type === 'stream') ? streamIndex++ : formatIndex++;

        outputData[type][groupIndex] = {};
        var itemList = {};

        groupArray.forEach(function(item){
          var itemSplit = item.split('=');

          var itemName = itemSplit[0];
          var itemValue = itemSplit[1];

          var itemNameSplit = itemName.split(':');

          switch(itemValue.toLowerCase()) {
            case 'n/a':
              itemValue = null;
              break;
            case 'false':
              itemValue = false;
              break;
            case 'true':
              itemValue = true;
              break;
          }

          if(itemNameSplit.length === 2) {
            if (outputData[type][groupIndex][itemNameSplit[0].toLowerCase()] == undefined)
              outputData[type][groupIndex][itemNameSplit[0].toLowerCase()] = {};

            outputData[type][groupIndex][itemNameSplit[0].toLowerCase()][itemNameSplit[1]] = itemValue
          } else {
            outputData[type][groupIndex][itemName] = itemValue;
          }
        });
      });

      self.emit('metadata', outputData);    
    });

    return self;
  }
}

util.inherits(MediaFileProbe, EventEmitter);

module.exports = MediaFileProbe;