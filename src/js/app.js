//Data model
var locations = [
    {title: 'Campuzano Fine Mexican Food', location: {lat:32.482586,lng:-96.99423370000001}},
    {title: 'Ellis County BBQ', location: {lat:32.476594,lng:-96.98378099999999}},
    {title: 'Mockingbird Nature Park', location: {lat:32.4980242,lng:-96.96453369999999}},
    {title: 'Big Cigar Racing', location: {lat:32.5052189,lng:-96.91816799999999}},
    {title: 'Midlothian Heritage High School', location: {lat:32.4846421,lng:-96.9440862}}
];

//Variable to hold the map
var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.482361, lng: -96.994448899999},
        zoom: 13,
        mapTypeControl: true
    });

}

var ViewModel = function() {

    var largeInfoWindow = new google.maps.InfoWindow();
    //Forces the content to stay within the viewmodel
    var that = this;

    //This will hold the objects in the locations array. The observable array will
    //automatically update any bound DOM elements whenever the array changes.
    this.locList = ko.observableArray([]);

    var markers = [];
    //Style the markers a bit
    //var defaultIcon = makeMarkerIcon('0091ff');

    //Push the locations objects to the observable array.
    locations.forEach(function(loc) {
        that.locList.push(loc);
    });


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

    for (var j = 0; j < markers.length; j++) {
        console.log(markers[j]);
    }


    this.currentLoc = ko.observable(this.locList()[0]);
};


ko.applyBindings(new ViewModel());