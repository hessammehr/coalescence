function* axes(xtitle, ytitle, changeLimits) {

  var margin = {top: 20, right: 25, bottom: 30, left: 50},
  width = 480 - margin.left - margin.right,
  height = 180 - margin.top - margin.bottom;

  var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colors = d3.scale.category10();
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);
  var x_axis = d3.svg.axis().scale(x).orient("bottom")
  var y_axis = d3.svg.axis().scale(y).orient("left");
  var x_node = svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");
  var y_node =svg.append("g")
  .attr("class", "y axis");

  x_node.append("text")
  .attr("transform", "translate("+ width + ", 0)")
  .text(xtitle);
  y_node.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text(ytitle);

  var l = d3.svg.line()
  .x(function(d,n) { return x(n); })
  .y(function(d) { return y(d); })
  .interpolate("monotone");
  var p = svg.append("path")
  .attr("class", "line")
  .attr("stroke", colors(1));

  var first = true;
  while(true) {
    data = yield svg;
    var ymin = Math.min.apply(null, data);
    var ymax = Math.max.apply(null, data);
    if (changeLimits || first) {
      first = false;
      x.domain([0, data.length]);
      y.domain([ymin, ymax]);
    }
    // update axes
    x_node.call(x_axis);
    y_node.call(y_axis);

    p.datum(data)
    .attr("d", l);
  }
}

function monitor(g, a, i) {
  setInterval(function() {
    a.next(g.next().value);
  }, i)
}
