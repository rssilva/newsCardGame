(function () {
	var SoundModule = function (options) {
		return {
			init: function () {
				this.options = options;
				this.musics = {};
				this.effects = {};

				this.config();

				this.start();
				this.bindEvents();
			},

			config: function () {
				var musicOn 	= exports.getCookie('mano-a-mano-musicOn'),
					effectsOn 	= exports.getCookie('mano-a-mano-effectsOn');

				if (musicOn === 'true' || musicOn === '') {
					this.musicOn = true;
				}

				if (musicOn === 'false') {
					this.musicOn = false;
				}

				if (effectsOn === 'true' || effectsOn === '') {
					this.effectsOn = true;
				}

				if (effectsOn === 'false') {
					this.effectsOn = false;
				}
			},

			start: function () {
				this.isSupported 	= typeof buzz !== 'undefined' && buzz.isSupported();
				this.extension 		= this.getExtension();
				
				/*
				this.sounds.startWhistle = new buzz.sound('../sound/startWhistle' + extension);
				this.sounds.snap    	 = new buzz.sound('../sound/snap' + extension);
				this.sounds.riot	 	 = new buzz.sound('../sound/riot' + extension);
				this.sounds.music1	     = new buzz.sound('../sound/music1' + extension, {loop: true});
				*/

				this.loadMusic('music', 'audio/music1', {loop: true});
			},

			loadMusic: function (name, url, options) {
				if (!this.musics[name]) {
					this.musics[name] = new buzz.sound(url + this.extension, options);
				}
			},

			loadEffect: function (name, url, options) {
				if (!this.effects[name]) {
					this.effects[name] = new buzz.sound(url + this.extension, options);
				}
			},

			getExtension: function () {
				var extension = null;

				if (this.isSupported) {
					if (buzz.isOGGSupported()) {
						extension = '.ogg';
					} else if (buzz.isMP3Supported()) {
						extension = '.mp3';
					}
				}

				return extension;
			},

			playMusic: function (music) {
				if (this.musics[music] && this.musicOn) {
					this.musics[music].play();
					this.musics[music].setVolume(10);
				}
			},

			stopMusic: function (music) {
				if (this.musics[music]) {
					this.musics[music].stop();
				}
			},

			playEffect: function (effect) {
				if (this.effects[effect]) {
					this.effects[effect].play()
				}
			},

			stopEffect: function (effect) {
				if (this.effects[effect]) {
					this.effects[effect].stop()
				}
			},

			updateConfigurations: function (config) {
				this.musicOn 	= config.musicOn;
				this.effectsOn 	= config.effectsOn;

				this.updateMusic();
			},

			updateMusic: function () {
				if (this.musicOn) {
					this.playMusic('music');
				} else {
					this.stopMusic('music');
				}
			},

			mute: function () {

			},

			unMute: function () {

			},

			bindEvents: function () {
				var that = this;

				$(window).on('updateConfigurations', function (e, data) {
					that.updateConfigurations(data)
				})
			}
		}
	};

	exports.SoundModule = SoundModule;
})();