/**
 * Initiate a new DrumKit object, which will allow the user to play a virtual drumset
 * by pressing keys associated with a given drum sample.
 *
 * @param {Object[]} drums Array of drum objects for this DrumKit
 * @param {string} drums[].name The name of this drum
 * @param {string} drums[].src The path to the sound file for this drum
 * @param {string} drums[].key The key values which will trigger this drum to play when pressed (see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
 * @param {string} drums[].elId The ID of the DOM element representing this drum
 * @param {boolean} allowContinuous Whether to allow overlapping drum KeyboardEvents to trigger a drum. Defaults to false, which will require that the drum completes before a user can trigger it again.
 */
var DrumKit = function( drums, allowContinuous ){
	// Store global properties for this DrumKit
	self = this;
	self.allowContinuous = allowContinuous || false; // Whether this DrumKit allows the same drum to be hit continuously (i.e. overlapping)
	self.drums = drums; // Array of drums in this DrumKit
	self.loadedDrums = 0; // Number of drums in this Drumkit whose audio field have loaded
	self.allDrumsLoaded = false; // If all the DrumKit audio files have loaded
	self.keyMap = {}; // Object mapping key values to a DOM element ID and Howler object for playing drum sounds

	// Iterate through each drum passed to this DrumKit, and initiate Howler object and relevant event handlers
	for( var i = 0; i < self.drums.length; i++ ){
		var curDrum = self.drums[i];

		// Create a Howler object to control this drum's sound
		curDrum.howl = new Howl({
			src: [curDrum.src]
		});

		// Find the relevant DOM element and add the drum name to it
		el = document.getElementById( curDrum.elId );
		el.innerHTML = '<span class="drumName">' + curDrum.name + '</span>';

		// If a key was specified for this drum, add it to DrumKit.keyMap
		if( curDrum.key ){
			self.keyMap[curDrum.key] = {};
			curDrum.howl.drumKey = curDrum.key;
			self.keyMap[curDrum.key].sound = curDrum.howl;
			self.keyMap[curDrum.key].elId = curDrum.elId;

			el.innerHTML += '<span class="drumKey">' + self.keyNameToIcon( curDrum.key ) + '</span>';
		}

		// When this drum's Howler object plays, add an active class to the relevant DOM element
		curDrum.howl.on('play', function(){
			el = document.getElementById( self.keyMap[this.drumKey].elId );
			if( el.classList ){
				el.classList.add('active');
			}
			else{
				el.className += ' active';
			}
		});

		// When this drum's Howler object stops playing, remove the active class from the relevant DOM element
		curDrum.howl.on('end', function(){
			el = document.getElementById( self.keyMap[this.drumKey].elId );
			if (el.classList){
				el.classList.remove('active');
			}
			else{
				el.className = el.className.replace(new RegExp('(^|\\b)' + 'active'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		});

		/*
			Once this drum's howler object has loaded, increment the DrumKit.loadedDrums count.
			If all drums have been loaded, update DrumKit.allDrumsLoaded flag and set up event handler
			for playing drum sounds when the appropriate keys are pressed.
		*/
		curDrum.howl.once('load', function(){
			self.loadedDrums++;
			if( self.loadedDrums === self.drums.length ){
				self.allDrumsLoaded = true;

				document.addEventListener('keydown', (event) => {
	  				const keyName = event.key;
	  				if( self.keyMap[keyName] && ( self.allowContinuous || !self.keyMap[keyName].sound.playing() ) ){
	  					self.keyMap[keyName].sound.play();
	  				}
	  			});
			}
		});
	}
};

/**
 * Convenience function for mapping key values to icons/text to display to users on the front end
 *
 * @param  {string} keyName The key value generated by a KeyboardEvent (see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
 * @return {string}         The icon/text to display for this key on the front end of the site
 */
DrumKit.prototype.keyNameToIcon = function(keyName) {
	var keyIcon = '';
	switch( keyName ){
		case 'ArrowLeft':
		keyIcon += '&larr;';
		break;
		case 'ArrowRight':
		keyIcon += '&rarr;';
		break;
		case 'ArrowUp':
		keyIcon += '&uarr;';
		break;
		case 'ArrowDown':
		keyIcon += '&darr;';
		break;
		case ' ':
		keyIcon += '(space)';
		break;
	}

	return keyIcon;
};

// Instantiate a DrumKit and start playing!
var myDrumKit = new DrumKit([
	{
		name: 'Snare',
		src: 'audio/snare.mp3',
		key: 'ArrowUp',
		elId: 'snare'
	},
	{
		name: 'High Tom',
		src: 'audio/tomhi.mp3',
		key: 'ArrowLeft',
		elId: 'tomhi'
	},
	{
		name: 'High Hat',
		src: 'audio/highhat.mp3',
		key: 'ArrowRight',
		elId: 'highhat'
	},
	{
		name: 'Bass',
		src: 'audio/bass.mp3',
		key: 'ArrowDown',
		elId: 'bass'
	},
	{
		name: 'Chimes',
		src: 'audio/chimes.mp3',
		key:' ',
		elId: 'chimes'
	}
], true);
