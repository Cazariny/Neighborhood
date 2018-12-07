var locations = [
    {title: 'Antiguo Real Hospital de San Juan de Dios.', location: {lat: 19.7014449, lng:-101.1912001}},
    {title: 'Universidad Michoacana de San Nicolás de Hidalgo.', location: {lat: 19.7034052, lng: -101.1947411}},
    {title: 'Catedral de Morelia', location: {lat: 19.702423, lng: -101.1945125}},
    {title: 'Museo Casa Natal de Morelos', location: {lat: 19.7006295, lng: -101.193861}},
    {title: 'Biblioteca Pública de la Universidad Michoacana', location: {lat: 19.7032583, lng: -101.1954469}},
    {title: 'Palacio Legislativo de Michoacán', location: {lat:19.7029558, lng: -101.1905739}}
];
var map;

// Create a new blank array for all the listing markers.
var markers = [];

var largeInfowindow;

function mapInit() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 19.702721, lng: -101.194019},
        zoom: 17,
        mapTypeControl: false
    });

    largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();


    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
        // Extend boundaries for every marker that we make
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
    //Activate knockout
    ko.applyBindings(new ViewModel());
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

var Location = function(data) {
    this.name =  data.name;
    this.location = data.location;
    this.marker = data.marker;
}
function error() {
    alert("Google Maps has failed to load. Please try again.");
}
function ViewModel() {
   self= this;
   //Updates and stores the search
    this.search = ko.observable("");
    //Stores markers in an observable array
    this.loc=ko.observableArray();
    //copy the locations array into an observable array
    for (var i = 0; i <markers.lenght; i++){
        self.loc.push(markers[i])
    }
    this.placestr = ko.observable();

    var wikiUrl = 'http://es.wikipedia.org/w/api.php?action=opensearch&search=' + placestr() + '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    this.listViewClick = function(marker) {
        google.maps.event.trigger(marker, 'click');
    }

    this.filteredLocations = ko.computed(function() {
        var filter = self.search().toLowerCase();
        if (!filter) {
            self.loc().forEach(function(item){
                item.setVisible(true);
            });
            return self.myLocations();
        } else {
            return ko.utils.arrayFilter(self.myLocations(), function(item) {
                var match = item.name.toLowerCase().indexOf(filter) >= 0
                item.setVisible(match);
                return match;
            })
        }}, self);
}
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle('active');
}