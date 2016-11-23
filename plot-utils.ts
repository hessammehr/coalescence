import * as d3 from "d3";

export function* axes(xtitle, ytitle, changeLimits) {

  let margin = { top: 20, right: 25, bottom: 30, left: 50 },
    width = 480 - margin.left - margin.right,
    height = 180 - margin.top - margin.bottom;

  let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  let colors = d3.scaleOrdinal(d3.schemeCategory10);
  let x = d3.scaleLinear().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);
  let x_axis = d3.axisBottom(x);
  let y_axis = d3.axisLeft(y);
  let x_node = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");
  let y_node = svg.append("g")
    .attr("class", "y axis");

  x_node.append("text")
    .attr("transform", "translate(" + width + ", 0)")
    .text(xtitle);
  y_node.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(ytitle);

  let l = d3.line()
    .x(function (d, n) { return x(n) })
    .y(function (d) { return y(d[1]) });
  let p = svg.append("path")
    .attr("class", "line")
    .attr("stroke", colors("1"));

  let first = true;
  while (true) {
    let data = yield svg;
    let ymin = Math.min(...data);
    let ymax = Math.max(...data);
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

export function monitor(g, a, i) {
  setInterval(function () {
    a.next(g.next().value);
  }, i)
}
