var deviceReadyDeferred = $.Deferred();
var jqmReadyDeferred = $.Deferred();

var app = {
    // Application Constructor
    init: function() {
        this.map = null;
        this.marker = null;
        this.infowindow = null;
        this.watchID = null;
        app = this;

        app.onDeviceReady();
        $( '#map' ).on( 'pagebeforecreate', function(event){
            app.mapHeight();
            app.maps();
        });

        $( '#map' ).on( 'pagecreate', function(event){
            $(window).bind('pageshow resize orientationchange', function(e){
                app.mapHeight();
            });
        });
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
        var app = this;
        
    },
    login: function() {

    },
    loadMap: function() {
        var latlng = new google.maps.LatLng(55.17, 23.76);
        var myOptions = {
          zoom: 1,
          center: latlng,
          streetViewControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: true
        };
        map = new google.maps.Map($("map-canvas"), myOptions);
         
        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            //get geoposition once
            //navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true });
            //watch for geoposition change
            watchID = navigator.geolocation.watchPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true });
            this.watchID = watchID;  
        });

        function geo_error(error){
            //comment
            alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        };
         
        function geo_success(position) {
             
            map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            map.setZoom(15);
         
            var info = 
            ('Latitude: '         + position.coords.latitude          + '<br>' +
            'Longitude: '         + position.coords.longitude         + '<br>' +
            'Altitude: '          + position.coords.altitude          + '<br>' +
            'Accuracy: '          + position.coords.accuracy          + '<br>' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br>' +
            'Heading: '           + position.coords.heading           + '<br>' +
            'Speed: '             + position.coords.speed             + '<br>' +
            'Timestamp: '         + new Date(position.timestamp));
         
            var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            if(!this.marker){
                //create marker
                this.marker = new google.maps.Marker({
                    position: point,
                    map: map
                });
            }else{
                //move marker to new position
                this.marker.setPosition(point);
            }
            if(!this.infowindow){
                this.infowindow = new google.maps.InfoWindow({
                    content: info
                });
            }else{
                this.infowindow.setContent(info);
            }
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);
            }); 
        };
    },
    maps: function() {
        var map;
        var marker;

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
        };

        var mapOptions = {
            zoom: 15,
            disableDefaultUI: true
          };
          
          map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

          // Try HTML5 geolocation
          if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);

              /*var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: ''
              });*/
            marker = new google.maps.Marker({
                map: map,
                position: pos,
                title: 'Here are you!'
            });
            var circle = new google.maps.Circle({
              map: map,
              radius: 8000,    // ca 5 miles in metres
              fillColor: '#819FF7',
              strokeColor: '#5858FA',
              strokeWeight: 1,
              fillOpacity: 0.35
            });

            circle.bindTo('center', marker, 'position');

            marker.setPosition(pos);

              map.setCenter(pos);
            }, function() {
              handleNoGeolocation(true);
            });
          } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
          }
    },

    mapHeight: function() {
        var header = $.find("div[data-role='header']:visible");
        var footer = $.find("div[data-role='footer']:visible");
        var content = $.find("div[data-role='content']:visible:visible");
        var viewport_height = $(window).height();

        var content_height = viewport_height - $(header).outerHeight() - $(footer).outerHeight();
        if(($(content).outerHeight() - $(header).outerHeight() - $(footer).outerHeight()) <= viewport_height) {
            content_height -= ($(content).outerHeight() - $(content).height());
        }
        $(content).height(content_height);
        $('#map-canvas').height(content_height);
    }
};
