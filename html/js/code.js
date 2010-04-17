$(document).ready(function(){
var latlng = new google.maps.LatLng(-34.397, 150.644);
var myOptions = {
    zoom: 8,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.TERRAIN
};
var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

function correctHeight() {
    var window_height = $(window).height();
    var header_height = $("#search-container").offset().top;
    $("#search-results").height(window_height - header_height - 20); //-20 for padding
    $("#map_canvas").height(window_height - header_height);
}
correctHeight();
jQuery.event.add(window, "resize", correctHeight);

});
