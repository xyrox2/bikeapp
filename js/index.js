var deviceReadyDeferred = $.Deferred();
var jqmReadyDeferred = $.Deferred();

var app = {
    // Application Constructor
    init: function() {
        $(document).ready(function() {
          // Handler for .ready() called.
          document.addEventListener("deviceready", this.onDeviceReady, true);
        });

        this.maps();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    login: function() {

    },
    maps: function() {
        var map;

        function initialize() {
          var mapOptions = {
            zoom: 6
          };
          map = new google.maps.Map(document.getElementById('map-canvas'),
              mapOptions);

          // Try HTML5 geolocation
          if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);

              var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
              });

              map.setCenter(pos);
            }, function() {
              handleNoGeolocation(true);
            });
          } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
          }
        }

        function handleNoGeolocation(errorFlag) {
          if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
          } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
          }

          var options = {
            map: map,
            position: new google.maps.LatLng(60, 105),
            content: content
          };

          var infowindow = new google.maps.InfoWindow(options);
          map.setCenter(options.position);
        }

        google.maps.event.addDomListener(window, 'load', initialize);

        function getRealContentHeight() {
            var header = $.find("div[data-role='header']:visible");
            var footer = $.find("div[data-role='footer']:visible");
            var content = $.find("div[data-role='content']:visible:visible");
            var viewport_height = $(window).height();

            var content_height = viewport_height - $(header).outerHeight() - $(footer).outerHeight();
            if(($(content).outerHeight() - $(header).outerHeight() - $(footer).outerHeight()) <= viewport_height) {
                content_height -= ($(content).outerHeight() - $(content).height());
            }
            console.log(content_height);
            return content_height;
        }

        $('#map-canvas').height(getRealContentHeight());
    }
};
