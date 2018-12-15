var locations = [
    {title: 'Antiguo Real Hospital de San Juan de Dios.', location: {lat: 19.702536, lng:-101.1912921}},
    {title: 'Universidad Michoacana de San Nicolás de Hidalgo.', location: {lat: 19.7034052, lng: -101.1947411}},
    {title: 'Catedral de Morelia', location: {lat: 19.702423, lng: -101.1923185}},
    {title: 'Museo Casa Natal de Morelos', location: {lat: 19.7007562, lng: -101.1925578}},
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
    //all lists to adjust the boundaries of the map
    var bounds = new google.maps.LatLngBounds();
    largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
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
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.marker = marker;
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
            }
        }

var Location = function(data) {
    this.name =  data.name;
    this.location = data.location;
    this.marker = data.marker;
};
function error() {
    alert("Google Maps has failed to load. Please try again.");
}
function ViewModel() {
    self = this;
    // Stores and upates markers in knockout.js observable array
    this.myLocations = ko.observableArray();
    //Iterates over markers array and creates copies in the locations observable array
    for ( var i = 0; i < markers.length; i++) {
        self.myLocations.push(markers[i])
    }
    //Iterates over markers array and creates copies in the locations observable array
    var wikiUrl = 'http://es.wikipedia.org/w/api.php?action=opensearch&search=' + markers.title + '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function (response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }
            ;

            clearTimeout(wikiRequestTimeout);
        }
    });

    // Filter Marker
    this.filteredLocations = ko.computed(function() {
        var filter = self.search().toLowerCase();
        if (!filter) {
            self.myLocations().forEach(function(item){
                item.setVisible(true);
            });
            return self.myLocations();
        } else {
            return ko.utils.arrayFilter(self.myLocations(), function(item) {
                var match = item.name.toLowerCase().indexOf(filter) >= 0;
                item.setVisible(match);
                return match;
            })
        }}, self);

    this.listViewClick = function (marker) {
        google.maps.event.trigger(marker, 'click');
    };

}



function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle('active');
}