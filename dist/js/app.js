function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:{lat:32.482361,lng:-96.994448899999},zoom:13,mapTypeControl:!0})}var locations=[{title:"Campuzano Fine Mexican Food",location:{lat:32.482586,lng:-96.99423370000001}},{title:"Ellis County BBQ",location:{lat:32.476594,lng:-96.983781}},{title:"Mockingbird Nature Park",location:{lat:32.4980242,lng:-96.96453369999999}},{title:"Big Cigar Racing",location:{lat:32.5052189,lng:-96.918168}},{title:"Midlothian Heritage High School",location:{lat:32.4846421,lng:-96.9440862}}],ViewModel=function(){var o=this;this.locList=ko.observableArray([]),locations.forEach(function(t){o.locList.push(t)}),this.currentLoc=ko.observable(this.locList()[0])},map;ko.applyBindings(new ViewModel);