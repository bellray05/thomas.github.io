<script type="text/javascript">
angular.module('myproducts.videoplay', []).directive('videoAutoCtrl',
  function() {
  return {
    require: '^uibCarousel',
    link: function(scope, element, attrs) {
      var video = element[0];
      var canplay = false;
      var rs = ["HAVE_NOTHING", "HAVE_METADATA", "HAVE_CURRENT_DATA", "HAVE_FUTURE_DATA", "HAVE_ENOUGH_DATA"];
      var ns = ["NETWORK_EMPTY", "NETWORK_IDLE", "NETWORK_LOADING", "NETWORK_NO_SOURCE"];

      function vinfo() {
        console.log("currentSrc = " + video.currentSrc);
        console.log("readyState = " + rs[video.readyState]);
        console.log("networkState = " + ns[video.networkState]);
        bufinfo();
      }

      function bufinfo() {
        // tr is a TimeRanges object
        tr = video.buffered
        if (tr.length > 0) {
          var ranges = ""
          for (i = 0; i < tr.length; i++) {
            s = tr.start(i);
            e = tr.end(i);
            ranges += s + '-' + e;
            if (i + 1 < tr.length) {
              ranges += ', '
            }
          }
          console.log("buffered time ranges: " + ranges);
        }
      }

      video.onerror = function () {
        console.log(video.error);
      }

      video.oncanplay = function () {
        canplay = true;
        if (!playing) {
          console.log("canplay!");
          vinfo();
        }
      }

      var playing = false;
      function playfulfilled(v) {
        console.log("visible so playing " + video.currentSrc.split('/').pop());
        playing = true;
      }

      function playrejected(v) {
        console.log("play failed", v);
      }

      function setstate(visible) {
        if (canplay) {
          if (visible) {
            p = video.play();
            if (p !== undefined) {
              p.then(playfulfilled, playrejected);
            }
          } else if (playing) {
            video.pause();
            console.log("invisible so paused");
            playing = false;
          }
        } else {
          console.log("!canplay, visible:", visible);
          vinfo();
        }
      }
      // Because $watch calls $parse on the 1st arg, the property doesn't need to exist on first load
      scope.$parent.$watch('active', setstate);
    }
  };
});
</script>