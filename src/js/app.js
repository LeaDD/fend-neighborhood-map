//Data model
var locations = [
    {title: 'Campuzano Fine Mexican Food', location: {lat:32.482586,lng:-96.99423370000001}},
    {title: 'Ellis County BBQ', location: {lat:32.476594,lng:-96.98378099999999}},
    {title: 'Mockingbird Nature Park', location: {lat:32.4980242,lng:-96.96453369999999}},
    {title: 'Big Cigar Racing', location: {lat:32.5052189,lng:-96.91816799999999}},
    {title: 'Midlothian Heritage High School', location: {lat:32.4846421,lng:-96.9440862}}
];


var ViewModel = function() {

    //Forces the content to stay within the viewmodel
    var that = this;

    //This will hold the objects in the locations array. The observable array will
    //automatically update any bound DOM elements whenever the array changes.
    this.locList = ko.observableArray(locations);

    //Intialize the current location
    this.selectLoc = ko.observable('');

    //Array to hold location markers
    var markers = [];

    for(var i = 0; i < this.locList().length; i++) {
        //Get position and title from the locList array
        var position = this.locList()[i].location;
        var title = this.locList()[i].title;

        //Create marker per location and put into markers array
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            //icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: i
        });

        markers.push(marker);
    }

    function placeMarkers() {
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            //Extend the boundaries of the map to show all markers
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    //http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    this.filteredItems = ko.computed(function() {
        var filter = that.selectLoc().toLowerCase();

        if(filter === '') {
            //console.log('Empty!!!');
            return that.locList();
        } else {
            return ko.utils.arrayFilter(that.locList(), function(item) {
                //console.log(item);
                return item.title === 'Campuzano Fine Mexican Food';
            });
        }
    });


    placeMarkers();
};

//Variable to hold the map
var map;

function initMap() {

    //Style the map
    //https://snazzymaps.com/style/2/midnight-commander
    var styles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.482361, lng: -96.994448899999},
        zoom: 13,
        mapTypeControl: true,
        styles: styles
    });

    ko.applyBindings(new ViewModel());
}

