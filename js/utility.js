var Utility = {
   formatTime: function(milliseconds) {
      if (milliseconds <= 0)
         return '00:00';

      var seconds = Math.round(milliseconds);
      var minutes = Math.floor(seconds / 60);
      if (minutes < 10)
         minutes = '0' + minutes;

      seconds = seconds % 60;
      if (seconds < 10)
         seconds = '0' + seconds;

      return minutes + ':' + seconds;
   },
   endsWith: function(string, suffix) {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
   }
};