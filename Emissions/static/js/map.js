// Create a map object
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  });

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);

// #-----------------------------------------------------------

var urlworldmap = "/api/emission/wholeworld/2016/Emissions_per_capita"
d3.json(urlworldmap).then(function(response){
    console.log(response)
    // worldmap(response)
    var countries = response.emissionData;
    for (var i = 0; i < countries.length; i++) {

        // Conditionals for countries emissions
        var color = "yellow";
        if (countries[i].value > 4) {
          color = "orange";
        }
        else if (countries[i].value > 15) {
          color = "blue";
        }
        else if (countries[i].value> 20) {
          color = "green";
        }
        else {
          color = "red";
        }

        // Add circles to map
        L.circle(countries[i].location, {
          fillOpacity: 0.75,
          color: "yellow",
          fillColor: color,
          // Adjust radius

          radius: countries[i].value * 15000
        }).bindPopup("<h3>" + countries[i].country + "</h3> <hr> <h5>emissions: " + countries[i].value + " "+ countries[i].unit + "</h3>").addTo(myMap);
      }
});

