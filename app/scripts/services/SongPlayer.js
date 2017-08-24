(function() {
     function SongPlayer($rootScope, Fixtures) {
          var SongPlayer = {};

          /**
          * @desc Currently playing album
          * @type {Object}
          */
          var currentAlbum = Fixtures.getAlbum();

          /**
          * @desc Buzz object audio file
          * @type {Object}
          */
          var currentBuzzObject = null;

          /**
          * @function stopSong
          * @desc Stops current song and sets song.playing to null
          */
          var stopSong = function() {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
          };

           /**
           * @function setSong
           * @desc Stops currently playing song and loads new audio file as currentBuzzObject
           * @param {Object} song
           */
          var setSong = function(song) {
            if (currentBuzzObject) {
              SongPlayer.currentSong.paused = false;
              stopSong();
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
              formats: ['mp3'],
              preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
              $rootScope.$apply(function() {
                SongPlayer.currentTime = currentBuzzObject.getTime();
              });
            });

            SongPlayer.currentSong = song;
          };

          SongPlayer.volume = 50;

          /**
          * @function playSong
          * @desc Plays currentBuzzObject and makes song.playing true
          * @param {Object} song
          */
          var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
            song.paused = false;
          };

          /**
          * @function getSongIndex
          * @desc Finds index of current song playing
          @param {Object} song
          */
          var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
          };

          /**
          * @desc Song selection from album view
          * @type {Number}
          */
          SongPlayer.currentSong = null;

          /**
          * @desc Current playback time (in seconds) of currently playing song
          * @type {Number}
          */
          SongPlayer.currentTime = null;

          /**
          * @function SongPlayer.play
          * @desc Sets and plays new song or restarts play on paused song
          * @param {Object} song
          */
         SongPlayer.play = function(song) {

           song = song || SongPlayer.currentSong;

           if (SongPlayer.currentSong !== song) {
             setSong(song);
             playSong(song);

        } else if (SongPlayer.currentSong === song) {
          if (currentBuzzObject.isPaused()) {
           playSong(song);
          }
        }
     };

     /**
     * @function SongPlayer.pause
     * @desc Pauses current song if clicked and sets song.playing to false
     * @param {Object} song
     */
     SongPlayer.pause = function(song) {

       song = song || SongPlayer.currentSong;
       currentBuzzObject.pause();
       song.playing = false;
       song.paused = true;
     };

     /**
     * @function SongPlayer.previous
     * @desc Switchs song playing to previous song
     */
     SongPlayer.previous = function() {
       var currentSongIndex = getSongIndex(SongPlayer.currentSong);
       currentSongIndex--;

       if (currentSongIndex < 0) {
         SongPlayer.currentSong.paused = true;
         stopSong();
         currentSongIndex = 0;
       } else {
         var song = currentAlbum.songs[currentSongIndex];
         setSong(song);
         playSong(song);
       }
     };

     /**
     * @function SongPlayer.next
     * @desc switches song playing to next song
     */
     SongPlayer.next = function() {
       var currentSongIndex = getSongIndex(SongPlayer.currentSong);
       console.log(currentSongIndex);
       currentSongIndex++;

       if (currentSongIndex == currentAlbum.songs.length) {
         SongPlayer.currentSong.paused = true;
         stopSong();
         currentSongIndex = currentAlbum.songs.length -1;
       } else {
         var song = currentAlbum.songs[currentSongIndex];
         setSong(song);
         playSong(song);
       }
     };

     /**
     * @function setCurrentTime
     * @desc Set current time (in seconds) of currently playing song
     * @param {Number} time
     */
     SongPlayer.setCurrentTime = function(time) {
       if (currentBuzzObject) {
         currentBuzzObject.setTime(time);
       }
     };

     SongPlayer.setVolume = function(value) {
       if (currentBuzzObject) {
         currentBuzzObject.setVolume(value);
       }
     };

          return SongPlayer;
     }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope','Fixtures', SongPlayer]);
 })();
