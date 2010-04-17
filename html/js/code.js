$(document).ready(function(){

function correctHeight() {
    var window_height = $(window).height();
    var header_height = $("#search-container").offset().top;
    $("#search-results").height(window_height - header_height - 20); //-20 for padding
    $("#search-map").height(window_height - header_height);
}
correctHeight();
jQuery.event.add(window, "resize", correctHeight);
});
