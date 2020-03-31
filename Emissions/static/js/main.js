
//Code adapted from:
// Copyright (c) 2013 Justin Palmer
// ES6 / D3 v4 Adaption Copyright (c) 2016 Constantin Gavrilete
// Removal of ES6 for D3 v4 Adaption Copyright (c) 2016 David Gotz
var width = 1200,
    height = 600;

var margin = {top: 20, right: 5, bottom: 20, left: 80};

var colors = ['#FFC300', '#FF5733', '#C70039', '#900C3F', '#A2119', '#F12A1F'];
var svg = d3.select("body").append("svg")
			.attr("width",width + margin.left + margin.right)
			.attr("height",height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
width = width - margin.left - margin.right;
height = height - margin.bottom - margin.top;
//var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
//    y = d3.scaleLinear().rangeRound([height, 0]);
d3.json("/data", function(d) {
  return {
    country : d.country,
    ind_name : d.ind_name,
    '2018' : +d["2018"],
    // '2016' : +d["2016"],
    // '2015' : +d["2015"],
    '2010' : +d["2010"],
    // '2005' : +d["2005"],
    '2000' : +d["2000"],
    // '1995' : +d["1995"],
    '1990' : +d["1990"],
    // '1985' : +d["1985"],
    '1980' : +d["1980"],
    // '1975' : +d["1975"],
    '1970' : +d["1970"],
    // '1965' : +d["1965"],
    '1960' : +d["1960"]
  };
}).then(function(data) {
//    console.log(data);

    var keys = d3.map(data, function(d){return(d.ind_name)}).keys()
    console.log(keys);

var x = d3.scaleBand().rangeRound([0, width], .1)

var y0 = d3.scaleSqrt().range([height, 0]);
var valueline = d3.line().x((d) => x(d.country)).y((d) => y0(d['2018']));

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

for (var i=0; i < keys.length; i++) {
    data1 = data.filter(function(d){return d.ind_name == keys[i];})
    x.domain(data.map(function(d) { return d.country; }));
    y0.domain([0, d3.max(data, d => Math.max(d['2018']))]);

    svg.append("path")
      .data([data1])
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke", function(d) {
        return colors[i];
        });

     g.selectAll("path")
    .data(data1)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return x(d.country)-margin.left; })
    .attr("cy", function(d) { return y0(d['2018'])-margin.top; })
    .style("fill", function(d,p,j) { return colors[i]; })
        .on("mouseover", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              // .html("Country:" + (d.country) + "<br>" + "Indicator:" + (d.ind_name) + "<br>" + "2018:" + d['2018']
              // + "<br>" + "2016:" + d['2016'] + "<br>" + "2015:" + d['2015'] + "<br>" + "2010:" + d['2010']
              // + "<br>" + "2005:" + d['2005'] + "<br>" + "2000:" + d['2000'] + "<br>" + "1995:" + d['1995']
              // + "<br>" + "1990:" + d['1990'] + "<br>" + "1985:" + d['1985'] + "<br>" + "1980:" + d['1980']
              // + "<br>" + "1975:" + d['1975'] + "<br>" + "1970:" + d['1970'] + "<br>" + "1965:" + d['1965']
              // + "<br>" + "1960:" + d['1960']);
              .html("Country:" + (d.country) + "<br>" + "Indicator:" + (d.ind_name) + "<br>" + "2018:" + d['2018']
              + "<br>" + "2010:" + d['2010']
              + "<br>" + "2000:" + d['2000']
              + "<br>" + "1990:" + d['1990'] 
              + "<br>" + "1980:" + d['1980']
              + "<br>" + "1970:" + d['1970']
              + "<br>" + "1960:" + d['1960']);
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});

}

var lineLegend = svg.selectAll(".lineLegend").data(keys)
    .enter().append("g")
    .attr("class","lineLegend")
    .attr("transform", function (d,i) {
            return "translate(" + 700 + "," + (i*20)+")";
        });

lineLegend.append("text").text(function (d) {return d;})
.style('fill', 'white')
.style("font-size", "14px")
    .attr("transform", "translate(25,9)"); //align texts with boxes

lineLegend.append("rect")
    .attr("fill", function (d, i) {return colors[i]; })
    .attr("width", 20).attr("height", 10);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y0 Axis
  svg.append("g")
      .attr("class", "axisSteelBlue")
      .call(d3.axisLeft(y0));

});
// d3.tip
// Tooltips for d3.js SVG visualizations

d3.functor = function functor(v) {
  return typeof v === "function" ? v : function() {
    return v;
  };
};

d3.tip = function() {

  var direction = d3_tip_direction,
      offset    = d3_tip_offset,
      html      = d3_tip_html,
      node      = initNode(),
      svg       = null,
      point     = null,
      target    = null

  function tip(vis) {
    svg = getSVGNode(vis)
    point = svg.createSVGPoint()
    document.body.appendChild(node)
  }

  // show the tooltip on the screen
  //
  // Returns a tip
  tip.show = function() {
    var args = Array.prototype.slice.call(arguments)
    if(args[args.length - 1] instanceof SVGElement) target = args.pop()

    var content = html.apply(this, args),
        poffset = offset.apply(this, args),
        dir     = direction.apply(this, args),
        nodel   = getNodeEl(),
        i       = directions.length,
        coords,
        scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
        scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

    nodel.html(content)
      .style('position', 'absolute')
      .style('opacity', 1)
      .style('pointer-events', 'all')

    while(i--) nodel.classed(directions[i], false)
    coords = direction_callbacks[dir].apply(this)
    nodel.classed(dir, true)
      .style('top', (coords.top +  poffset[0]) + scrollTop + 'px')
      .style('left', (coords.left + poffset[1]) + scrollLeft + 'px')

    return tip
  }

  // hide the tooltip
  //
  // Returns a tip
  tip.hide = function() {
    var nodel = getNodeEl()
    nodel
      .style('opacity', 0)
      .style('pointer-events', 'none')
    return tip
  }

  // Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns tip or attribute value
  tip.attr = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().attr(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.attr.apply(getNodeEl(), args)
    }

    return tip
  }

  // Proxy style calls to the d3 tip container.  Sets or gets a style value.
  // Returns tip or style property value
  tip.style = function(n, v) {
    // debugger;
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().style(n)
    } else {
      var args = Array.prototype.slice.call(arguments);
      if (args.length === 1) {
        var styles = args[0];
        Object.keys(styles).forEach(function(key) {
          return d3.selection.prototype.style.apply(getNodeEl(), [key, styles[key]]);
        });
      }
    }

    return tip
  }

    //
  // Returns tip or direction
  tip.direction = function(v) {
    if (!arguments.length) return direction
    direction = v == null ? v : d3.functor(v)

    return tip
  }

  // v - Array of [x, y] offset
  //
  // Returns offset or
  tip.offset = function(v) {
    if (!arguments.length) return offset
    offset = v == null ? v : d3.functor(v)

    return tip
  }

  // Returns html value or tip
  tip.html = function(v) {
    if (!arguments.length) return html
    html = v == null ? v : d3.functor(v)

    return tip
  }

  // Returns a tip
  tip.destroy = function() {
    if(node) {
      getNodeEl().remove();
      node = null;
    }
    return tip;
  }

  function d3_tip_direction() { return 'n' }
  function d3_tip_offset() { return [0, 0] }
  function d3_tip_html() { return ' ' }

  var direction_callbacks = {
    n:  direction_n,
    s:  direction_s,
    e:  direction_e,
    w:  direction_w,
    nw: direction_nw,
    ne: direction_ne,
    sw: direction_sw,
    se: direction_se
  };

  var directions = Object.keys(direction_callbacks);

  function direction_n() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.n.y - node.offsetHeight,
      left: bbox.n.x - node.offsetWidth / 2
    }
  }

  function direction_s() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.s.y,
      left: bbox.s.x - node.offsetWidth / 2
    }
  }

  function direction_e() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.e.y - node.offsetHeight / 2,
      left: bbox.e.x
    }
  }

  function direction_w() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.w.y - node.offsetHeight / 2,
      left: bbox.w.x - node.offsetWidth
    }
  }

  function direction_nw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.nw.y - node.offsetHeight,
      left: bbox.nw.x - node.offsetWidth
    }
  }

  function direction_ne() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.ne.y - node.offsetHeight,
      left: bbox.ne.x
    }
  }

  function direction_sw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.sw.y,
      left: bbox.sw.x - node.offsetWidth
    }
  }

  function direction_se() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.se.y,
      left: bbox.e.x
    }
  }

  function initNode() {
    var node = d3.select(document.createElement('div'))
    node
      .style('position', 'absolute')
      .style('top', '0')
      .style('opacity', '0')
      .style('pointer-events', 'none')
      .style('box-sizing', 'border-box')

    return node.node()
  }

  function getSVGNode(el) {
    el = el.node()
    if(el.tagName.toLowerCase() === 'svg')
      return el

    return el.ownerSVGElement
  }

  function getNodeEl() {
    if(node === null) {
      node = initNode();
      // re-add node to DOM
      document.body.appendChild(node);
    };
    return d3.select(node);
  }


  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}
  function getScreenBBox() {
    var targetel   = target || d3.event.target;

    while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
        targetel = targetel.parentNode;
    }

    var bbox       = {},
        matrix     = targetel.getScreenCTM(),
        tbbox      = targetel.getBBox(),
        width      = tbbox.width,
        height     = tbbox.height,
        x          = tbbox.x,
        y          = tbbox.y

    point.x = x
    point.y = y
    bbox.nw = point.matrixTransform(matrix)
    point.x += width
    bbox.ne = point.matrixTransform(matrix)
    point.y += height
    bbox.se = point.matrixTransform(matrix)
    point.x -= width
    bbox.sw = point.matrixTransform(matrix)
    point.y -= height / 2
    bbox.w  = point.matrixTransform(matrix)
    point.x += width
    bbox.e = point.matrixTransform(matrix)
    point.x -= width / 2
    point.y -= height / 2
    bbox.n = point.matrixTransform(matrix)
    point.y += height
    bbox.s = point.matrixTransform(matrix)

    return bbox
  }

  return tip
};