d3.select("#populate").on("click",populate)
function populate(){
  d3.json("/alldata").then(function(data){
    for (i=0;i<(data[0].indicator).length;i++){
      d3.select("#field").append("option").attr("value",(data[0].indicator[i])).text(data[0].indicator[i])
    }
    for (j=0;j<(data[0].country).length;j++){
      d3.select("#country").append("option").attr("value",(data[0].country[j])).text(data[0].country[j])
    }
  })
  
}

// grabbing the country and field
d3.select("#countrybutton").on("click",grabber)
function grabber(){
  var countryInput = d3.selectAll("#country").property("value")
  var fieldInput  = d3.selectAll("#field").property("value")
  var urlcountry = "/api/emission/" + countryInput +"/" + fieldInput
  console.log(urlcountry)
  d3.json(urlcountry).then(function(response) {
    countryemissions(response)
  })
}

function countryemissions(emission){
  
  historicemissioncountry=[]
  historicemissionindicator=[]
  historicemissionunit=[]
  historicemissionvalue=[]
  historicemissionvariable=[]
  historicemissionyear=[]
  projectedemissioncountry=[]
  projectedemissionindicator=[]
  projectedemissionunit=[]
  projectedemissionvalue=[]
  projectedemissionvariable=[]
  projectedemissionyear=[]
  emission.forEach(element => {
    for (z=0;z<element.variable.length;z++){
        if(element.variable[z]=="historic"){
          historicemissioncountry.push(element.country[z])
          historicemissionindicator.push(element.indicator[z])
          historicemissionunit.push(element.unit[z])
          historicemissionvalue.push(element.value[z])
          historicemissionvariable.push(element.variable[z])
          historicemissionyear.push(element.year[z])
        }
        else if(element.variable[z]=="projected_current_policy_min"){
          projectedemissioncountry.push(element.country[z])
          projectedemissionindicator.push(element.indicator[z])
          projectedemissionunit.push(element.unit[z])
          projectedemissionvalue.push(element.value[z])
          projectedemissionvariable.push(element.variable[z])
          projectedemissionyear.push(element.year[z])
        }
    }
  });
  var historicemission = [{
    "country":historicemissioncountry,
    "indicator:":historicemissionindicator,
    "unit":historicemissionunit,
    "value":historicemissionvalue,
    "variable":historicemissionvariable,
    "year":historicemissionyear
  }]
  var projectedemission = [{
    "country":projectedemissioncountry,
    "indicator:":projectedemissionindicator,
    "unit":projectedemissionunit,
    "value":projectedemissionvalue,
    "variable":projectedemissionvariable,
    "year":projectedemissionyear
  }]
  console.log(projectedemission)
  trace1 ={
    x:historicemission[0].year,
    y:historicemission[0].value,
    text:historicemission[0].value ,
    mode:"scatter",
    name:"Historic"
  } 
  trace2 ={
      x:projectedemission[0].year,
      y:projectedemission[0].value,
      text:projectedemission[0].value ,
      mode:"markers",
      name:"Projected",
  }

  ldata1=[trace1,trace2];
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