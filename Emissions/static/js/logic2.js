//Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
// Define outdoors map, satellite map, and grayscale map layers
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 15,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 15,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});
var grayMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 15,
  id: "mapbox.light",
  accessToken: API_KEY
});
// Create map object with tile layers.
var map = L.map("map", {
  center: [
    49.28, -123.12
  ],
  zoom: 2.5,
  layers: [grayMap, satellite, outdoors]
});
grayMap.addTo(map);
var tectonicPlates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

//Add a number of base maps to choose from as
//well as separate out our two different data sets
//into overlays that can be turned on and off independently.
var baseMaps = {
  Satellite: satellite,
  Grayscale: grayMap,
  Outdoors: outdoors
};
var overlays = {
  "Tectonic Plates": tectonicPlates,
  Earthquakes: earthquakes
};
// Add control to the map to change layers
L
  .control
  .layers(baseMaps, overlays)
  .addTo(map);
//Your data markers should reflect the magnitude of the earthquake in their size and color.
// add d3.geoJSON data and add colors
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  //Earthquakes with higher magnitudes should appear larger and darker in color.
  // marker colors
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  //Include popups that provide additional information about the earthquake when a marker is clicked.
  // Create radius plotted, add circle marker
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }
  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(earthquakes);
    earthquakes.addTo(map);

    var legend = L.control({
    position: "bottomright"
  });
  // legend details
  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#00eaee",
      "#d4ee00",
      "#eecc00",
      "#eeca00",
      "#ea822c",
      "#ea2c39"
    ];
    // looping intervals
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'>&nbsp&nbsp&nbsp&nbsp</i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(map);
  //Data on tectonic plates can be found at https://github.com/fraxen/tectonicplates.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(plateData) {
      L.geoJson(plateData, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicPlates);
      tectonicPlates.addTo(map);
    });
});











