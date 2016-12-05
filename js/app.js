
var DrumKit = function( drums ){
	self = this;
	self.drums = drums;
	self.curDrum = 0;

	for( var i = 0; i < self.drums.length; i++ ){
		self.drums[i].howl = new Howl({
			src: [self.drums[i].src]
		});

		self.drums[i].howl.once('load', function(){
			this.play();
		});
		console.log( self.drums[i] );
	}
};

var myDrumKit = new DrumKit([
	{
		id: 1,
		name: 'Snare',
		src: 'audio/snare.mp3'
	},
	{
		id: 2,
		name: 'High Tom',
		src: 'audio/tomhi.mp3'
	},
	{
		id: 3,
		name: 'Mid Tom',
		src: 'audio/tommid.mp3'
	},
	{
		id: 4,
		name: 'High Hat',
		src: 'audio/highhat.mp3'
	},
	{
		id: 5,
		name: 'Cowbell',
		src: 'audio/cowbell.mp3'
	},
	{
		id: 6,
		name: 'Bass',
		src: 'audio/bass.mp3'
	},
	{
		id: 7,
		name: 'Chimes',
		src: 'audio/chimes.mp3'
	}

]);