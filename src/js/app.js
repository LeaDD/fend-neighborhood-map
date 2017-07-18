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

    this.myInfoWindow = new google.maps.InfoWindow();

    //This will hold the objects in the locations array. The observable array will
    //automatically update any bound DOM elements whenever the array changes.
    this.locList = ko.observableArray(locations);

    //Array to hold location markers
    this.markers = ko.observableArray([]);

    //Intialize the current location
    this.selectLoc = ko.observable('');

    //Create the location markers and push to the observable array
    this.locList().forEach(function(location) {
        // for(var i = 0; i < this.locList().length; i++) {
            //Get position and title from the locList array
            var position = location.location;
            var title = location.title;

            var marker = new google.maps.Marker({
                position: position,
                title: title,
                //icon: defaultIcon,
                animation: google.maps.Animation.DROP
            });

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

    //http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    this.filteredItems = ko.computed(function() {
        var filter = that.selectLoc().toLowerCase();

        if(!filter) {
            return that.locList();
        } else {
            return ko.utils.arrayFilter(that.locList(), function(item) {
                var loc = item.title.toLowerCase();
                var test = loc.indexOf(filter)
                //https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript

                item.marker.setVisible(test != -1)
                console.log(test != -1);
                return loc.indexOf(filter) !== -1;

            });
        }
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

    // this.filteredMarkers = ko.computed(function() {
    //     var filter = that.selectLoc().toLowerCase();

    //     if(!filter) {
    //         //Initial marker placement
    //         that.placeMarkers();
    //      } else {
    //         that.hideMarkers();
    //         return ko.utils.arrayFilter(that.markers(), function(item) {
    //             var loc = item.title.toLowerCase();
    //             //console.log(item);
    //             if ($('#select-box').val() === '' || loc.indexOf(filter) !== -1) {
    //                 //item.setVisible(false);
    //                 //that.placeMarkers();
    //                 item.setVisible(true);
    //                 console.log($('#select-box').val());
    //             }
    //         });
    //      }
    // });

    //Trying to have marker open when list item clicked. Not quite there yet.
    this.clickMarker = function(item) {
        var index = 0;
        var marker;

        for (var i = 0; i < that.markers().length; i++) {
            //console.log(that.markers()[i].title);
            if (that.markers()[i].title === item.title) {
                //console.log('TRUE');
                index = i;
                break;
            }
        }

        console.log(that.markers()[index]);
    };

    //this.createMarkers();
    this.placeMarkers();

    // this.locList().forEach(function(x) {
    //     console.log(x);
    // })
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