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

  // Country data
  var countries = [
    {
      country: "Brazil",
      location: [-14.2350, -51.9253],
      emissions:34.8794

    },
    {
      country: "Germany",
      location: [51.1657, 10.4515],
      emissions: 56.3452
    },
    {
      country: "Italy",
      location: [41.8719, 12.5675],
      emissions: 51.5258
    },
    {
      country: "Argentina",
      location: [-38.4161, -63.6167],
      emissions: 52.7472
    },
    {
      country: "Australia",
      location: [-25.274398, 133.775136],
      emissions: 73.1571
    },
    {
      country: "United Kingdom",
      location: [55.378051, -3.435973],
      emissions: 49.4704
    },
    {
      country: "France",
      location: [46.2276, 2.2137],
      emissions: 28.2857
    },
    {
      country: "European Union",
      location: [54.526, 15.2551],
      emissions: 56.2856
    },
    {
      country: "Canada",
      location: [56.130366, -106.346771],
      emissions: 45.9332
    },
    {
      country: "China",
      location: [35.86166, 104.195397],
      emissions: 72.8068
    },
    {
      country: "Indonesia",
      location: [-0.789275, 113.921327],
      emissions:47.3092
    },
    {
      country: "India",
      location: [20.593684, 78.96288],
      emissions: 58.1650
    },
    {
      country: "Japan",
      location: [36.204824,138.252924 ],
      emissions: 64.1463
    },
    {
      country: "Russia",
      location: [61.52401,105.318756],
      emissions: 48.9662
    },
    {
      country: "Saudi Arabia",
      location: [23.885942, 45.079162 ],
      emissions: 59.9257
    },
    {
      country: "South Africa",
      location: [-30.559482, 22.937506],
      emissions: 75.9806
    },
    {
      country: "Mexico",
      location: [23.634501,-102.552784 ],
      emissions: 57.5396
    },
    {
      country: "South Korea",
      location: [35.907757, 127.766922 ],
      emissions: 49.8307
    },
     {
      country: "Turkey",
      location: [38.963745, 35.243322],
      emissions: 59.1882
    },
    {
      country: "United_States",
      location: [37.09, -95.71],
      emissions: 53.3572
    }
  ];
  
  
  // Loop through the countries array and create one marker for each country object
  
  for (var i = 0; i < countries.length; i++) {
  
    // Conditionals for countries emissions
    var color = "yellow";
    if (countries[i].emissions > 60) {
      color = "orange";
    }
    else if (countries[i].emissions > 40) {
      color = "blue";
    }
    else if (countries[i].emissions > 20) {
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
  
      radius: countries[i].emissions * 5000
    }).bindPopup("<h1>" + countries[i].country + "</h1> <hr> <h3>emissions: " + countries[i].emissions + "</h3>").addTo(myMap);
  }
  
  // function updateLegend(country, emissions) {
  
  //     "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
  //     "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
  //     "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
  //     "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
  // }
  
  
