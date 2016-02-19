# Media File Probe

[![Build Status](https://travis-ci.org/artheus/media-file-probe.svg)](https://travis-ci.org/artheus/media-file-probe.svg)
[![Dependency Status](https://david-dm.org/artheus/media-file-probe.svg)](https://david-dm.org/artheus/media-file-probe.svg)

Tiny module, using ffprobe, to collect metadata about media files.

## Install
```bash
npm install media-file-probe
```

## Usage
```javascript
var mediaprober = require('media-file-probe')();

mediaprober.probe('/Users/artheus/somemediafile.mov').on('metadata', function(data){
	// Now you can read the media file data from the data variable
});

```

## CLI
There is also a cli tool included that simply does what is in the example usage above and then prints the metadata.
You can use it like this

```bash
npm install -g media-file-probe

media-file-probe /Users/artheus/somemediafile.mov
{
	... Lots o' metadata ...
}
```
