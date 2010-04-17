HOTGATOR = function() {

    var mapData;

    function calagatorCallback (data) { 
            console.log(data);
            makeMap(data);
    };

    var calagatorData = function() {
        var ajaxCall = $.getScript("http://calagator.org/events.json?callback=HOTGATOR.calagatorCallback");
    };

    calagatorData();

    var makeMap = function(mapData) {

        var latlng = new google.maps.LatLng(45.5374054,  -122.65028);
        var myOptions = {
            zoom: 11,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        function correctHeight() {
            var window_height = $(window).height();
            var header_height = $("#search-container").offset().top;
            $("#search-container").height(window_height - header_height - 20); //-20 for padding
            $("#map_canvas").height(window_height - header_height);
        }
        correctHeight();
        jQuery.event.add(window, "resize", correctHeight);

        var infowindow = new google.maps.InfoWindow();

        function add_info_window(map, marker, infowindow, event) {
            function open_info_window() {
                infowindow.open(map,marker);
                console.log(event.start_time);
                infowindow.setContent('<h1>' + event.title + '</h1>'
                    + '<div>'
                    + '<div class="date"><abbr class="dtstart" title="' + event.start_time 
                    + '">Saturday, April 17, 2010 from 10am</abbr>&ndash;<abbr class="dtend" title="'
                    + event.end_time
                    + '">7pm</abbr></div>'
                    + '</div>'


                );
            }
            google.maps.event.addListener(marker, 'click', open_info_window);
            $("#event-" + event.id).click(open_info_window);
        }

        // Loop through all events
        $.each(mapData, function(index,event){ 

            var place = new google.maps.LatLng(event.venue.latitude, event.venue.longitude);
            var marker = new google.maps.Marker({
                  position: place, 
                  map: map, 
                  title:event.title
            });   

            $("#search-container").append('<a href="#" id="event-' + event.id + '"> ' + event.title + '</a><br/>');

            add_info_window(map, marker, infowindow, event);

        });
    };

    return {
        makeMap: makeMap,
        calagatorCallback: calagatorCallback
    };

}();
