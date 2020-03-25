// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {  top: 20,  right: 40,  bottom: 60,  left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the csv file
// =================================
d3.csv("/data/historicTemp.csv").then(function(tempData) {
// Step 4: Parse the data
// Format the data and convert to numerical and date values
// =================================
//Create a function to parse date and time
var parseTime = d3.timeParse("%Y");

// Format the data
  tempData.forEach(function(data) {
  console.log(data)

    data.year = parseTime(data.year);
    data.noSmoothing = data.noSmoothing;
    data.lowessFive = data.lowessFive;

    console.log(data.year)
    console.log(data.noSmoothing)
    console.log(data.lowessFive)
  });

  // Step 5: Create Scales
  //= ============================================
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(tempData, d => d.year))
    .range([-1, width]);
    console.log(xTimeScale)

  var yLinearScale1 = d3.scaleLinear()
    .domain([-1, d3.max(tempData, d => d.noSmoothing)])
    .range([height, 0]);
    console.log(yLinearScale1)
  var yLinearScale2 = d3.scaleLinear()
    .domain([-1, d3.max(tempData, d => d.lowessFive)])
    .range([height, 0]);
    console.log(yLinearScale2)
  // Step 6: Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2).ticks(10);

 // Step 7: Append the axes to the chartGroup
 // ==============================================
 // Add bottomAxis
  chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

  // Add leftAxis to the left side of the display
  chartGroup.append("g")
  .call(leftAxis);

  // Add rightAxis to the right side of the display
  chartGroup.append("g")
  .attr("transform", `translate(${width}, 0)`)
  .call(rightAxis);


  // Step 8: Set up two line generators and append two SVG paths
  // ==============================================
  // Line generators for each line
  var line1 = d3
    .line()
    .x(d => xTimeScale(d.year))
    .y(d => yLinearScale1(d.noSmoothing));

  var line2 = d3
    .line()
    .x(d => xTimeScale(d.year))
    .y(d => yLinearScale2(d.lowessFive));


  // Append a path for line1
  chartGroup.append("path")
    .data([tempData])
    .attr("d", line1)
    .classed("line blue", true);
    // .attr("stroke", "red");

  // Append a path for line2
  chartGroup.append("path")
    .data([tempData])
    .attr("d", line2)
    .classed("line green", true);


// NEW! Step 9: Add color coded titles to the x-axis
 
  chartGroup.append("text")
    // Position the text
    // Center the text:
    // (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor)
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "green")
    .text("Annual Mean Temperature");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "blue")
    .text("Lowess Smoothing");


}).catch(function(error) {
  console.log(error);
});
// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // When the browser window is resized, responsify() is called.
// d3.select(window).on("resize", makeResponsive);


