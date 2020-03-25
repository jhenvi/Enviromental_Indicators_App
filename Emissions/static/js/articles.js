d3.select("#populate").on("click",populate)
function populate(){
  d3.json("/alldata").then(function(data){
    for (i=0;i<(data[0].year).length;i++){
      d3.select("#year").append("option").attr("value",(data[0].year[i])).text(data[0].year[i])
    }
    for (j=0;j<(data[0].country).length;j++){
      d3.select("#country").append("option").attr("value",(data[0].country[j])).text(data[0].country[j])
    }
  })
  
}

// grabbing the country and field
d3.select("#shownews").on("click",grabber)
function grabber(){
  var countryInput = d3.selectAll("#country").property("value")
  var yearInput  = d3.selectAll("#year").property("value")
  var newsurl = "/api/news/" + yearInput +"/" + countryInput
  console.log(newsurl)
  d3.json(newsurl).then(function(response) {
    tablemaker(response)
  })
}

function tablemaker(df){
  console.log(df[0].links[0])
  for (i =0;i<(df[0].articles).length;i++){
    var row = d3.select("tbody").append("tr")
    row.append("td").text(i)
    row.append("td").text(df[0].articles[i])
    row.append("td").text(df[0].links[i])
  }
}