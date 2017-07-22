//Data model
var locations = [
    {title: 'Campuzano Fine Mexican Food', location: {lat:32.482586,lng:-96.99423370000001}},
    {title: 'Ellis County BBQ', location: {lat:32.476594,lng:-96.98378099999999}},
    {title: 'Mockingbird Nature Park', location: {lat:32.4980242,lng:-96.96453369999999}},
    {title: 'Big Cigar Racing', location: {lat:32.5052189,lng:-96.91816799999999}},
    {title: 'Midlothian Heritage High School', location: {lat:32.4846421,lng:-96.9440862}},
    {title: 'Branded Burger Co.', location: {lat:32.4823516,lng:-96.9942736}},
    {title: 'Games Unplugged', location: {lat:32.4755504,lng:-96.98215709999999}},
    {title: 'The Philly Cheese Steak Factory', location: {lat:32.4478457,lng:-96.99794229999999}},
    {title: 'Main Street Games', location: {lat:32.4710552,lng:-96.956988}}
];


var ViewModel = function() {

    //Forces the content to stay within the viewmodel
    var that = this;

    this.myInfoWindow = new google.maps.InfoWindow();

    //This will hold the objects in the locations array. The observable array will
    //automatically update any bound DOM elements whenever the array changes.
    this.locList = ko.observableArray(locations);

    //Array to hold location markers
    this.markers = ko.observableArray([]);

    //Intialize the current location
    this.selectLoc = ko.observable('');

    //Create the location markers and push to the observable array
    this.createMarkers = this.locList().forEach(function(location) {

        //Get position and title from the locList array
        var position = location.location;
        var title = location.title;

        //Create the markers
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            //icon: defaultIcon,
            animation: google.maps.Animation.DROP
        });

        //Change the animation if the marker is clicked
        marker.addListener('click', function() {
            this.setAnimation(google.maps.Animation.BOUNCE);
            //Call external function to setTimeout in order to deal with closure. Advice on
            //a better way to do this would be appreciated.
            //https://coderwall.com/p/_ppzrw/be-careful-with-settimeout-in-loops
            setDelay(this);
            //console.log(this);
            populateInfoWindow(this,that.myInfoWindow);
        });

        that.markers.push(marker);

        //Add the marker as a property to the location object
        location.marker = marker;
    });

    //Initial placement of markers
    this.placeMarkers = function() {
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < that.markers().length; i++) {
            that.markers()[i].setMap(map);
            //Extend the boundaries of the map to show all markers
            bounds.extend(that.markers()[i].position);
        }
        map.fitBounds(bounds);
    };

    //Hide markers
    this.hideMarkers = function() {
        for (var i = 0; i < that.markers().length; i++) {
            that.markers()[i].setVisible(false);
        }
    };

    //http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    this.filteredItems = ko.computed(function() {
        var filter = that.selectLoc().toLowerCase();

        if(!filter) {
            //Initial placement of markers
            that.placeMarkers();

            //This was the only way I could figure out to set all the markers back
            //to visible if the input box was cleared.
            return ko.utils.arrayFilter(that.locList(), function(item) {
                item.marker.setVisible(true);

                //Return the filtered list to the DOM element that displays list items.
                //return loc;
                return that.locList();
            });

        } else {
            return ko.utils.arrayFilter(that.locList(), function(item) {
                //https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript
                var locPick = (item.title.toLowerCase().indexOf(filter) > -1);

                //Hide the items marker if the filter value substring does not exist within
                //any of the location list values, or show if the filter value does exist
                item.marker.setVisible(locPick);

                //Return the filtered list to the DOM element that displays list items.
                return locPick;

            });
        }
    });

    //Animate and open marker when list item clicked. Tried to do this by simulating a click
    //of the existing marker but couldn't get it to work.
    this.listActivateMarker = function(item) {
        //item.marker.click();
        item.marker.setAnimation(google.maps.Animation.BOUNCE);
        setDelay(item.marker);
        populateInfoWindow(item.marker,that.myInfoWindow);
    };

};

//Variable to hold the map
var map;

//Flickr API info
var flickrKey = '60a4a12c25ae2f6cca0c8e9dbabf0e07';
var flickrSecret = 'b429da77cd8c0841';

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

function populateInfoWindow(marker, infowindow) {
    if(infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }

}

function getPlacesDetail(marker, infowindow) {
    //TODO - Will use this to get additional info for
    //each marker at the time it is selected.
    var service = new google.maps.PlacesService(map);

}

//setTimeout to terminate bounce animation on markers
function setDelay(marker) {
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
}

//Toggle slide the select list if hamburger button is clicked.
/*https://codepen.io/g13nn/pen/eHGEF*/
$('.hamburger').click(function () {
    $('#select-box').toggle('slide');
});


//https://stackoverflow.com/questions/18873425/slidetoggle-not-displaying-div-when-screen-size-returns-to-bigger-size
$(window).resize(function() {
    var width = $(window).width();

    //If the select list has been toggled off and the screen is returned to > 992px
    //, toggle back on.
    if (width > 992 && $('#select-box').is(':hidden')) {
        $('#select-box').removeAttr('style');
    }

    //If the view begins over 992, then reduces below hide the select list.
    if (width < 992 && $('#select-box').is(':visible')) {
        $('#select-box').hide();
    }
});