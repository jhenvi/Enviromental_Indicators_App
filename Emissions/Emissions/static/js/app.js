// creating colored world map

var mapConfig = {
  center: [43.28, 72.23],
  zoom: 5
}
// const API_KEY = "pk.eyJ1IjoiamhlbnZpIiwiYSI6ImNrNXg1MGI1NTFsd3kzZnJ6Nm1jbThqMm8ifQ.FHsSJ8kiRegzlZra9l3I8Q";
var tileURL = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"

var tileConfig = {
maxZoom: 13,
id: "mapbox.streets",
accessToken: API_KEY
}

var geoJSONurl = 'static/data/countries.geo.json'

function colorChooser(countryname,emission) {
  var max,min,emissionvalue=0;
  for (i=0;i<emission.length;i++){
    if (countryname==emission.country[i]){
      max = Math.max(Number(emission.value))
      min = Math.min(Number(emission.value))
      emissionvalue = emission.value[i]
      if (emissionvalue>=min && emissionvalue<(0.20*max)) {return "green"}
      else if (emissionvalue>=(0.20*max) && emissionvalue<(0.40*max)) {return "blue"}
      else if (emissionvalue>=(0.40*max) && emissionvalue<(0.60*max)) {return "yellow"}
      else if (emissionvalue>=(0.60*max) && emissionvalue<(0.80*max)) {return "orange"}
      else {return "red"}
    }
  }
};


function worldmap(emission){
  // L.map.off();
  L.map.remove();
  var map = L.map("map", mapConfig)
  var mapLayer = L.tileLayer(tileURL, tileConfig).addTo(map)
  d3.json(geoJSONurl, function(data) {
    console.log(data)
    L.geoJSON(data, {
        style: function(feature) {
            return {
                color: "white",
                fillColor: colorChooser(feature.properties.name,emission[0]),
                fillOpacity: 0.5,
                weight: 1.5
              };
        }, 
        onEachFeature : function (feature, layer) {
                layer.on({
                    mouseover: function(event) {
                        layer = event.target, 
                        layer.setStyle({
                            fillOpacity: 0.75
                        });
                    }, 
                    mouseout: function(event) {
                        layer = event.target, 
                        layer.setStyle({
                            fillOpacity: 0.5
                        })
                    }
                });
                layer.bindPopup("<h1>" + feature.properties.name + "</h1><hr><h2>" + feature.id + "</h2>");
        }
    }).addTo(map);
  });

}
// creating world emissions line chart

function worldemissions(emission){
  
  trace1 ={
    x:emission[0].year,
    y:emission[0].value,
    text:emission[0].value ,
    mode:"scatter",
  } 
  ldata1=[trace1];
  layout1 = {
      title: `${emission[0].country[0]} ${emission[0].indicator[0]} v/s Time`,
      showlegend: true,
      /*height: 600,
      width: 1200,*/
      xaxis: { 
          title:"Year"
      },
      yaxis: { 
        title:`${emission[0].indicator[0]} in ${emission[0].unit[0]} `
    },
    }
  Plotly.newPlot("scatter",ldata1,layout1,{responsive:true})
}

//putting options in the dropdown
d3.select("#populate").on("click",populate)
function populate(){
  d3.json("/alldata").then(function(data){
    for (i=0;i<(data[0].indicator).length;i++){
      d3.select("#fieldworld").append("option").attr("value",(data[0].indicator[i])).text(data[0].indicator[i])
      d3.select("#field").append("option").attr("value",(data[0].indicator[i])).text(data[0].indicator[i])
    }
    for (j=0;j<(data[0].country).length;j++){
      d3.select("#country").append("option").attr("value",(data[0].country[j])).text(data[0].country[j])
    }
    for (k=0;k<(data[0].year).length;k++){
      d3.select("#year").append("option").attr("value",(data[0].year[k])).text(data[0].year[k])
    }
  })

}

// grabbing the Emissions type and year for the world map
d3.select("#homebutton").on("click",grabberhome)
function grabberhome(){
  var fieldInputWorld  = d3.selectAll("#fieldworld").property("value")
  var fieldYear  = d3.selectAll("#year").property("value")
  var urlworldmap = "/api/emission/wholeworld/" + fieldYear + "/" + fieldInputWorld
  console.log(urlworldmap)
  d3.json(urlworldmap).then(function(response){
    console.log(response)
    worldmap(response)
  });
// grabbing the field for world graph
  var urlworldgraph = "/api/emission/World/" + fieldInputWorld
  console.log(urlworldgraph)
  d3.json(urlworldgraph).then(function(response) {
    worldemissions(response)
  })
}

function searchappend(){

    var grabcountry = d3.select("#country").property("value")
    console.log(grabcountry)
    var grabsector = d3.select("#sector").property("value")
    console.log(grabsector)
    var grabind = d3.select("#indicator").property("value")
    console.log(grabind)
    var grabdefinition = d3.select("#definition").property("value")
    console.log(grabdefinition)
    var grabunit = d3.select("#unit").property("value")
    console.log(grabunit)

   // check for country
    if ((tableData.map(a=>a.country)).includes(grabcountry)){

        console.log("running running")

        var tableData1 = tableData.filter(function(row){
            if(grabcountry==row.country){return true}
            else{return false}
        });

    }
    else if (grabcountry==""){
        var tableData1 = tableData;
        console.log("nothing")
    }
    else if (grabcountry=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    // check for sector
    if ((tableData1.map(a=>a.sector)).includes(grabsector)){
        console.log("sector")
        var tableData1 = tableData1.filter(row=>grabsector==row.sector)
    }
    else if (grabsector==""){
        var tableData1 = tableData1;
        console.log("sectornothing")
    }
    else if (grabsector=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    // check for indicator
    if ((tableData1.map(a=>a.ind)).includes(grabind)){
        console.log("state")
        var tableData1 = tableData1.filter(row=>grabind==row.indicator)
    }
    else if (grabind==""){
        var tableData1 = tableData1;
        console.log("indnothing")
    }
    else if (grabind=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    // check for definition
    if ((tableData1.map(a=>a.definition)).includes(grabdefinition)){
        console.log("country")
        var tableData1 = tableData1.filter(row=>grabdefinition==row.definition)
    }
    else if (grabdefinition==""){
        var tableData1 = tableData1;
        console.log("definitionnothing")
    }
    else if (grabdefinition=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    // check for unit
    if ((tableData1.map(a=>a.unit)).includes(grabunit)){
        console.log("shape")
        var tableData1 = tableData1.filter(row=>grabunit==row.unit)
    }
    else if (grabunit==""){
        var tableData1 = tableData1;
        console.log("unitnothing")
    }
    else if (grabunit=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    //console.log(Object.values(tableData1.map(row=>row.dateTime)));

    tableData1.forEach(addin)
}


function addin(tablerows){
    var row = tbody.append("tr")
    row.append("td").text(tablerows.country)
    row.append("td").text(tablerows.sector)
    row.append("td").text(tablerows.indicator)
    row.append("td").text(tablerows.definition)
    row.append("td").text(tablerows.unit)
    row.append("td").text(tablerows.reference)
}
// creating colored world map

var mapConfig = {
  center: [43.28, 72.23],
  zoom: 5
}
// const API_KEY = "pk.eyJ1IjoiamhlbnZpIiwiYSI6ImNrNXg1MGI1NTFsd3kzZnJ6Nm1jbThqMm8ifQ.FHsSJ8kiRegzlZra9l3I8Q";
var tileURL = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"

var tileConfig = {
maxZoom: 13,
id: "mapbox.streets",
accessToken: API_KEY
}

var geoJSONurl = 'static/data/countries.geo.json'

function colorChooser(countryname,emission) {
  var max,min,emissionvalue=0;
  for (i=0;i<emission.length;i++){
    if (countryname==emission.country[i]){
      max = Math.max(Number(emission.value))
      min = Math.min(Number(emission.value))
      emissionvalue = emission.value[i]
      if (emissionvalue>=min && emissionvalue<(0.20*max)) {return "green"}
      else if (emissionvalue>=(0.20*max) && emissionvalue<(0.40*max)) {return "blue"}
      else if (emissionvalue>=(0.40*max) && emissionvalue<(0.60*max)) {return "yellow"}
      else if (emissionvalue>=(0.60*max) && emissionvalue<(0.80*max)) {return "orange"}
      else {return "red"}
    }
  }
};


function worldmap(emission){
  // L.map.off();
  L.map.remove();
  var map = L.map("map", mapConfig)
  var mapLayer = L.tileLayer(tileURL, tileConfig).addTo(map)
  d3.json(geoJSONurl, function(data) {
    console.log(data)
    L.geoJSON(data, {
        style: function(feature) {
            return {
                color: "white",
                fillColor: colorChooser(feature.properties.name,emission[0]),
                fillOpacity: 0.5,
                weight: 1.5
              };
        }, 
        onEachFeature : function (feature, layer) {
                layer.on({
                    mouseover: function(event) {
                        layer = event.target, 
                        layer.setStyle({
                            fillOpacity: 0.75
                        });
                    }, 
                    mouseout: function(event) {
                        layer = event.target, 
                        layer.setStyle({
                            fillOpacity: 0.5
                        })
                    }
                });
                layer.bindPopup("<h1>" + feature.properties.name + "</h1><hr><h2>" + feature.id + "</h2>");
        }
    }).addTo(map);
  });

}
// creating world emissions line chart

function worldemissions(emission){
  
  trace1 ={
    x:emission[0].year,
    y:emission[0].value,
    text:emission[0].value ,
    mode:"scatter",
  } 
  ldata1=[trace1];
  layout1 = {
      title: `${emission[0].country[0]} ${emission[0].indicator[0]} v/s Time`,
      showlegend: true,
      /*height: 600,
      width: 1200,*/
      xaxis: { 
          title:"Year"
      },
      yaxis: { 
        title:`${emission[0].indicator[0]} in ${emission[0].unit[0]} `
    },
    }
  Plotly.newPlot("scatter",ldata1,layout1,{responsive:true})
}

//putting options in the dropdown
d3.select("#populate").on("click",populate)
function populate(){
  d3.json("/alldata").then(function(data){
    for (i=0;i<(data[0].indicator).length;i++){
      d3.select("#fieldworld").append("option").attr("value",(data[0].indicator[i])).text(data[0].indicator[i])
      d3.select("#field").append("option").attr("value",(data[0].indicator[i])).text(data[0].indicator[i])
    }
    for (j=0;j<(data[0].country).length;j++){
      d3.select("#country").append("option").attr("value",(data[0].country[j])).text(data[0].country[j])
    }
    for (k=0;k<(data[0].year).length;k++){
      d3.select("#year").append("option").attr("value",(data[0].year[k])).text(data[0].year[k])
    }
  })

}

// grabbing the Emissions type and year for the world map
d3.select("#homebutton").on("click",grabberhome)
function grabberhome(){
  var fieldInputWorld  = d3.selectAll("#fieldworld").property("value")
  var fieldYear  = d3.selectAll("#year").property("value")
  var urlworldmap = "/api/emission/wholeworld/" + fieldYear + "/" + fieldInputWorld
  console.log(urlworldmap)
  d3.json(urlworldmap).then(function(response){
    console.log(response)
    worldmap(response)
  });
// grabbing the field for world graph
  var urlworldgraph = "/api/emission/World/" + fieldInputWorld
  console.log(urlworldgraph)
  d3.json(urlworldgraph).then(function(response) {
    worldemissions(response)
  })
}

function searchappend(){

    var grabcountry = d3.select("#country").property("value")
    console.log(grabcountry)
    var grabsector = d3.select("#sector").property("value")
    console.log(grabsector)
    var grabind = d3.select("#indicator").property("value")
    console.log(grabind)
    var grabdefinition = d3.select("#definition").property("value")
    console.log(grabdefinition)
    var grabunit = d3.select("#unit").property("value")
    console.log(grabunit)

   // check for country
    if ((tableData.map(a=>a.country)).includes(grabcountry)){

        console.log("running running")

        var tableData1 = tableData.filter(function(row){
            if(grabcountry==row.country){return true}
            else{return false}
        });

    }
    else if (grabcountry==""){
        var tableData1 = tableData;
        console.log("nothing")
    }
    else if (grabcountry=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    // check for sector
    if ((tableData1.map(a=>a.sector)).includes(grabsector)){
        console.log("sector")
        var tableData1 = tableData1.filter(row=>grabsector==row.sector)
    }
    else if (grabsector==""){
        var tableData1 = tableData1;
        console.log("sectornothing")
    }
    else if (grabsector=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    // check for indicator
    if ((tableData1.map(a=>a.ind)).includes(grabind)){
        console.log("state")
        var tableData1 = tableData1.filter(row=>grabind==row.indicator)
    }
    else if (grabind==""){
        var tableData1 = tableData1;
        console.log("indnothing")
    }
    else if (grabind=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    // check for definition
    if ((tableData1.map(a=>a.definition)).includes(grabdefinition)){
        console.log("country")
        var tableData1 = tableData1.filter(row=>grabdefinition==row.definition)
    }
    else if (grabdefinition==""){
        var tableData1 = tableData1;
        console.log("definitionnothing")
    }
    else if (grabdefinition=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    // check for unit
    if ((tableData1.map(a=>a.unit)).includes(grabunit)){
        console.log("shape")
        var tableData1 = tableData1.filter(row=>grabunit==row.unit)
    }
    else if (grabunit==""){
        var tableData1 = tableData1;
        console.log("unitnothing")
    }
    else if (grabunit=="refresh"){
        window.location.reload();
    }
    else{
        var tableData1 = [];
        console.log("search doesn't match")
    }
    //console.log(Object.values(tableData1.map(row=>row.dateTime)));

    tableData1.forEach(addin)
}


function addin(tablerows){
    var row = tbody.append("tr")
    row.append("td").text(tablerows.country)
    row.append("td").text(tablerows.sector)
    row.append("td").text(tablerows.indicator)
    row.append("td").text(tablerows.definition)
    row.append("td").text(tablerows.unit)
    row.append("td").text(tablerows.reference)
}
