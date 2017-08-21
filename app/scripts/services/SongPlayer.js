(function() {
     function SongPlayer(Fixtures) {
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
           * @function setSong
           * @desc Stops currently playing song and loads new audio file as currentBuzzObject
           * @param {Object} song
           */
          var setSong = function(song) {
            if (currentBuzzObject) {
              currentBuzzObject.stop();
              SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
              formats: ['mp3'],
              preload: true
            });

            SongPlayer.currentSong = song;
          };

          /**
          * @function playSong
          * @desc Plays currentBuzzObject and makes song.playing true
          * @param {Object} song
          */
          var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
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
     };

     /**
     * @function SongPlayer.previous
     * @desc Switchs song playing to previous song
     */
     SongPlayer.previous = function() {
       var currentSongIndex = getSongIndex(SongPlayer.currentSong);
       currentSongIndex--;

       if (currentSongIndex < 0) {
         currentBuzzObject.stop();
         SongPlayer.currentSong.playing = null;
       } else {
         var song = currentAlbum.songs[currentSongIndex];
         setSong(song);
         playSong(song);
       }
     };

          return SongPlayer;
     }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['Fixtures', SongPlayer]);
 })();
