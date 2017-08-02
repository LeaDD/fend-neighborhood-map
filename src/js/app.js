//Variable to hold the map
var map;
var midlo = {lat : 32.482361, lng : -96.99444889999999};

//Flickr API info
var fsClient_ID = '1F5ZQMD1CLQPF4Q1M0MCR1E2DI5SD1PDLZNG2WYNA3PHQMY4';
var fsClient_Secret = 'DKCV4XJIO3O1ENQGIRCMTH3RRR4140FFGRNUC2H3RFETWZQ4';
var fsURL = 'https://api.foursquare.com/v2/venues/search?ll=' + midlo.lat.toString() +
    ',' + midlo.lng.toString() + '&radius=1000&client_id=' + fsClient_ID + '&client_secret=' +
    fsClient_Secret + '&limit=35&categoryId=4d4b7104d754a06370d81259,' +
    '4d4b7105d754a06374d81259&v=20170723';

//Variable to hold the Foursquare venues that we will get from an API call.
var locations = [];

var ViewModel = function() {

    //Forces the content to stay within the viewmodel
    var that = this;

    //LatLng object which defines the area needed to contain the markers.
    var bounds = new google.maps.LatLngBounds();

    this.myInfoWindow = new google.maps.InfoWindow({
        maxWidth: 250
    });

    //This will hold the objects in the locations array. The observable array will
    //automatically update any bound DOM elements whenever the array changes.
    this.locList = ko.observableArray(locations);

    //Array to hold location markers
    this.markers = ko.observableArray([]);

    //Intialize the current location
    this.selectLoc = ko.observable('');

    //Create the location markers and push to the observable array
    this.createMarkers = function() {
        this.locList().forEach(function(location) {

            //Create the markers and give each properties from the corresponding
            //Foursquare venue.
            var marker = new google.maps.Marker({
                position: location.location,
                title: location.title,
                phone: location.phone,
                address1: location.address1,
                address2: location.address2,
                url: location.url,
                checkins: location.checkins,
                animation: google.maps.Animation.DROP
            });

            //Change the animation if the marker is clicked
            marker.addListener('click', function() {
                this.setAnimation(google.maps.Animation.BOUNCE);
                //Call external function to setTimeout in order to deal with closure. Advice on
                //a better way to do this would be appreciated.
                //https://coderwall.com/p/_ppzrw/be-careful-with-settimeout-in-loops
                setDelay(this);
                populateInfoWindow(this,that.myInfoWindow);
                //Re-center the map on the selected marker.
                //REVIEWER SUGGESTION - THANK YOU!!!
                map.panTo(this.getPosition());
            });

            that.markers.push(marker);

            //Add the marker as a property to the location object
            location.marker = marker;
        });
    };

    //Initial placement of markers
    this.placeMarkers = function() {
        that.createMarkers();

        for (var i = 0; i < that.markers().length; i++) {
            that.markers()[i].setMap(map);
            //Extend the boundaries of the map to show all markers
            bounds.extend(that.markers()[i].position);
        }
        map.fitBounds(bounds);
    };

    //Show markers
    this.showMarkers = function() {
        for (var i = 0; i < that.markers().length; i++) {
            that.markers()[i].setVisible(true);
        }
    };

    //Hide markers
    this.hideMarkers = function() {
        for (var i = 0; i < that.markers().length; i++) {
            that.markers()[i].setVisible(false);
        }
    };

    //Call Foursquare API to get locations in a radius around a (currently) hard coded
    //set of coordinates.
    this.getLocations = function(fsURL) {
        $.getJSON(fsURL, function(data) {
            var venues = data.response.venues;

            //return venues;
            for (var i = 0; i < venues.length; i++) {
                var venue = {};

                //Provide default values after || in case no data returned for each data point
                //REVIEWER SUGGESTION - THANK YOU!!!
                venue.title = venues[i].name;
                venue.url = venues[i].url || 'No URL provided';
                venue.address1 = venues[i].location.formattedAddress[0] || 'No address provided';
                venue.address2 = venues[i].location.formattedAddress[1];
                venue.checkins = venues[i].stats.checkinsCount || 'No checkin data';
                venue.phone = venues[i].contact.formattedPhone || 'No phone provided';
                venue.lat = venues[i].location.lat;
                venue.lng = venues[i].location.lng;
                venue.location = {lat: venues[i].location.lat, lng: venues[i].location.lng};

                locations.push(venue);
            }
            that.placeMarkers();
        }).fail(function(err) {
        window.alert('There was an error loading the locations from Foursquare. ' +
            'Error message: ' + err.responseText);
        });
    }(fsURL);

    //Computed observable to manage hiding and displaying list items and markers
    //http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    this.filteredItems = ko.computed(function() {
        var filter = that.selectLoc().toLowerCase();

        if(!filter) {
            //If there is no input in the filter then show all markers and list items.
            that.showMarkers();
            return that.locList();
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

    //Toggle slide the select list if hamburger button is clicked.
    //https://codepen.io/g13nn/pen/eHGEF
    //https://codepen.io/e-river/pen/EGIbe
    //REVIEWER SUGGESTION - THANK YOU!!! - The full suggestion was to use the click and CSS
    //bindings to achieve this effect. I have implemented the click binding but not sure what
    //was meant by using CSS binding. The sample codepen provided by the reviewer shows how to
    //hide/display, but I wanted to use the slide transition.
    this.toggleSlide = function() {
        $('#select-box').toggle('slide');
    };

    //Resize to display all markers if user changes viewport size.
    //REVIEWER SUGGESTION - THANK YOU!!!
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds);
    });


};

//Dynamically size the vertical elements in order to eliminate vertical scrolling
function vertSize() {
    //Get the vertical dimentsions of the viewport and the banner element
    var vpHeight = $(window).height();
    var titleHeight = $('.title').height();
    var mapBlockHeight = vpHeight - titleHeight;

    //Dynamically resize the map block based on the height of the banner element
    $('#map-block').height(mapBlockHeight);
}

function initMap() {
    //Style the map
    //https://snazzymaps.com/style/2/midnight-commander
    var styles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];

    map = new google.maps.Map(document.getElementById('map'), {
        center: midlo,
        zoom: 13,
        mapTypeControl: true,
        styles: styles
    });

    //Initialize vertical elements based on viewport dimensions
    vertSize();

    ko.applyBindings(new ViewModel());
}

//Build out the infowindow with the various data fields from Foursquare.
function populateInfoWindow(marker, infowindow) {
    if(infowindow.marker != marker) {
        infowindow.marker = marker;

        //Style the infowindow
        //https://codepen.io/Marnoto/pen/xboPmG
        var innerHTML = '<div id="iw-container"><div class="iw-title">';

        if (marker.title) {
            innerHTML += marker.title + '</div>';
        }

        if (marker.address1) {
            innerHTML += '<br>' + marker.address1;
        }

        if (marker.address2) {
            innerHTML += '<br>' + marker.address2;
        }

        if (marker.phone) {
            innerHTML += '<br><strong>' + marker.phone + '</strong>';
        }

        if (marker.url) {
            innerHTML += '<br>Site: ' + marker.url;
        }

        if (marker.checkins) {
            innerHTML += '<hr><strong>FourSquare Checkins: </strong>' + marker.checkins;
        }

        innerHTML += '</div>';

        infowindow.setContent(innerHTML);
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

function mapLoadError() {
    window.alert('Google maps failed to load. Please check your connection or try again later.');
}

//Handle screen resizing
//https://stackoverflow.com/questions/18873425/slidetoggle-not-displaying-div-when-screen-size-returns-to-bigger-size
$(window).resize(function() {
    var width = $(window).width();

    vertSize();

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