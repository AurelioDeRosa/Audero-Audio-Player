var Player = {
   media: null,
   mediaTimer: null,
   isPlaying: false,
   initMedia: function(path) {
      Player.media = new Media(
         path,
         function() {
            console.log('Media file readed succesfully');
            if (Player.media !== null)
               Player.media.release();
            Player.resetLayout();
         },
         function(error) {
            navigator.notification.alert(
               'Unable to read the media file.',
               function(){},
               'Error'
            );
            Player.changePlayButton('play');
            console.log('Unable to read the media file (Code): ' + error.code);
         }
      );
   },
   playPause: function(path) {
      if (Player.media === null)
         Player.initMedia(path);

      if (Player.isPlaying === false)
      {
         Player.media.play();
         Player.mediaTimer = setInterval(
            function() {
               Player.media.getCurrentPosition(
                  function(position) {
                     if (position > -1)
                     {
                        $('#media-played').text(Utility.formatTime(position));
                        Player.updateSliderPosition(position);
                     }
                  },
                  function(error) {
                     console.log('Unable to retrieve media position: ' + error.code);
                     $('#media-played').text(Utility.formatTime(0));
                  }
               );
            },
            1000
         );
         var counter = 0;
         var timerDuration = setInterval(
            function() {
               counter++;
               if (counter > 20)
                  clearInterval(timerDuration);

               var duration = Player.media.getDuration();
               if (duration > -1)
               {
                  clearInterval(timerDuration);
                  $('#media-duration').text(Utility.formatTime(duration));
                  $('#time-slider').attr('max', Math.round(duration));
                  $('#time-slider').slider('refresh');
               }
               else
                  $('#media-duration').text('Unknown');
            },
            100
         );

         Player.changePlayButton('pause');
      }
      else
      {
         Player.media.pause();
         clearInterval(Player.mediaTimer);
         Player.changePlayButton('play');
      }
      Player.isPlaying = !Player.isPlaying;
   },
   stop: function() {
      if (Player.media !== null)
      {
         Player.media.stop();
         Player.media.release();
      }
      clearInterval(Player.mediaTimer);
      Player.media = null;
      Player.isPlaying = false;
      Player.resetLayout();
   },
   resetLayout: function() {
      $('#media-played').text(Utility.formatTime(0));
      Player.changePlayButton('play');
      Player.updateSliderPosition(0);
   },
   updateSliderPosition: function(seconds) {
      var $slider = $('#time-slider');

      if (seconds < $slider.attr('min'))
         $slider.val($slider.attr('min'));
      else if (seconds > $slider.attr('max'))
         $slider.val($slider.attr('max'));
      else
         $slider.val(Math.round(seconds));

      $slider.slider('refresh');
   },
   seekPosition: function(seconds) {
      if (Player.media === null)
         return;

      Player.media.seekTo(seconds * 1000);
      Player.updateSliderPosition(seconds);
   },
   changePlayButton: function(imageName) {
      var background = $('#player-play')
      .css('background-image')
      .replace('url(', '')
      .replace(')', '');

      $('#player-play').css(
         'background-image',
         'url(' + background.replace(/images\/.*\.png$/, 'images/' + imageName + '.png') + ')'
      );
   }
};