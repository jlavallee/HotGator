HOTGATOR = function() {

    var mapData;

    var dayIcon = [ 
            'img/sunday.png',
            'img/monday.png',
            'img/tuesday.png',
            'img/wednesday.png',
            'img/thursday.png',
            'img/friday.png',
            'img/saturday.png',
    ];

    function calagatorCallback (data) { 
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

        function getDayIcon(date) {
            var d = new Date(date);
            return (dayIcon[d.getDay()]);
        }

        function add_info_window(map, marker, infowindow, event) {
            function open_info_window() {
                infowindow.open(map,marker);
                infowindow.setContent('<h1>' + event.title + '</h1>'
                    + '<div>'
                    + '<div class="date">' + event.start_time 
                    + '</div>'
                    + ' '
                    + '</div>'


                );
            }
            google.maps.event.addListener(marker, 'click', open_info_window);
            $("#event-" + event.id).click(open_info_window);
        }

        // Loop through all events
        $.each(mapData, function(index,event){ 
            if (!event.venue)  { 
                return true;
            }
            var place = new google.maps.LatLng(event.venue.latitude, event.venue.longitude);
            var eventDate = event.start_time.split('T');
            var day = new Date(eventDate[0]).getDay();
            var marker = new google.maps.Marker({
                  position: place, 
                  map: map, 
                  title: event.title,
                  icon: dayIcon[day]
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
