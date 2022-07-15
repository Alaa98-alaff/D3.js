// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3
  .geoMercator()
  .scale(70)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

d3.queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  )
  .defer(
    d3.csv,
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv",
    function (d) {
      data.set(d.code, +d.pop);
    }
  )
  .await(ready);

function ready(error, topo) {
  console.log(topo);
  // Draw the map
  svg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    //   set the color of each country
    .attr("fill", function (d) {
      d.total = data.get(d.id) || 0;
      console.log(d.total);
      return colorScale(d.total);
    })
    .on("mouseover", (d) => console.log(d));
}
