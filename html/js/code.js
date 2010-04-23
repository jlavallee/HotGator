var HotGator = function() {
    var mapData;
    var dateLimit = new Date('3000-01-01');

    // This is to keep everything working even if console.log doesn't exist
    var debug = function(msg) {
        if (console.log) {
            console.log(msg);
        }
    };

    var generateDateList = function() {

        var today = new Date();
        // Generate a list
        // 4 days, 2 weeks, 1 month, 1 quarter, remaining
        // myDate.setDate(myDate.getDate()+5);
        today.setDate(today.getDate()+4);
        var fourdays = today.toDateString();
        today.setDate(today.getDate()+10);
        var twoweeks = today.toDateString();
        today.setDate(today.getDate()+14);
        var fourweeks = today.toDateString();
        today.setDate(today.getDate()+77);
        var quarter = today.toDateString();
        today.setDate(today.getDate()+266);
        var year = today.toDateString();
        var dates = [
            fourdays,
            twoweeks,
            quarter,
            year
                ];
        console.log(dates);
        return dates;

    };

    var dates = generateDateList();

    var createOptions = function(dates) {
        var optionList = '';

        $.each(dates, function(index,value) {
            optionList = optionList + '<option value="' + dates[0] + '">' + dates[0] + '</option>';
        });

        var headerText = 
            '<form action=""><label for="q">Limit?</label>'
            + '<select name="q" id="q" onchange="HOTGATOR.update(this)">'
            + optionList
            + '</select>'
            + '</form>';

        $("#search-header").append(headerText);
        console.log(headerText);
    };

    createOptions(dates);

    var dayIcon = [ 
            'img/sunday.png',
            'img/monday.png',
            'img/tuesday.png',
            'img/wednesday.png',
            'img/thursday.png',
            'img/friday.png',
            'img/saturday.png',
    ];

    var calagatorCallback =  function (data) {
        makeMap(data);
    };


    var update = function(form) {

        debug(form);
        var newdate = new Date($("select:first").val());
        if (!newdate) {
            return false;
        }

        dateLimit = newdate;
        debug(dateLimit);
        getCalagatorData();
        return false;
    };

    var makeMap = function(mapData) {

        // Cleanup 
        $(".eventlink").remove();

        var latlng = new google.maps.LatLng(45.5374054,  -122.65028);

        var myOptions = {
            zoom: 11,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        var map = new google.maps.Map($("#map_canvas")[0], myOptions);
        debug("made map");

        var correctHeight = function () {
            var window_height = $(window).height();
            var header_height = $("#search-container").offset().top;
            $("#search-container").height(window_height - header_height - 20); //-20 for padding
            $("#map_canvas").height(window_height - header_height);
        }
        correctHeight();

        jQuery.event.add(window, "resize", correctHeight);
        debug("made window");

        var infowindow = new google.maps.InfoWindow();

        var getDayIcon = function (date) {
            var d = new Date(date);
            return (dayIcon[d.getDay()]);
        }

        var add_info_window = function (map, marker, infowindow, event) {
            var ed = event.start_time.split('T');
            var properDate = ed[0].split('-');
            function open_info_window() {
                infowindow.open(map,marker);
                infowindow.setContent('<br/><h1>' + event.title + '</h1>'
                    + '<div>'
                    + '<div class="date">' + properDate[1] + '-' + properDate[2] + '-' + properDate[0]
                    + '<br/>'
                    + ed[1]
                    + '</div>'
                    + ' '
                    + event.venue.title
                    + '</div>'
                );
            }
            google.maps.event.addListener(marker, 'click', open_info_window);
            $("#event-" + event.id).click(open_info_window);
        }

        var lastDate = '0000-00-00';
        debug("About to loop through events with " + dateLimit );

        // Loop through all events
        $.each(mapData, function(index,event){ 
            
            if (!event.venue)  { 
                return true;
            }
            var place = new google.maps.LatLng(event.venue.latitude, event.venue.longitude);

            // Filter dates of events
            // TODO: add update of the search-container
            var eventDate = event.start_time.split('T');
            var comparedate = new Date(eventDate[0]);
            if (comparedate > dateLimit) {
                debug("skipping event on day" + eventDate[0]);
                return true;
            }
            var day = new Date(eventDate[0]).getDay();
            var marker = new google.maps.Marker({
                  position: place, 
                  map: map, 
                  title: event.title,
                  icon: dayIcon[day]
            });   

            if (eventDate[0] == lastDate)
                $("#search-container").append( '<div class="eventlink">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="event-' + event.id + '"> ' + event.title + '</a></div>');
            else
                $("#search-container").append( '<div class="eventlink"><br/>' + eventDate[0] + ' <br/>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" id="event-' + event.id + '"> ' + event.title + '</a></div>');

            lastDate = eventDate[0];
            add_info_window(map, marker, infowindow, event);

        });
    };

    return {
        makeMap: makeMap,
        calagatorCallback: calagatorCallback,
        update: update
    };


}();
