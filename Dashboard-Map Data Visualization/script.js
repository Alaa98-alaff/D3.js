// The svg
var mapSVG = d3.select("#world-map"),
  width = +mapSVG.attr("width"),
  height = +mapSVG.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3
  .geoMercator()
  .scale(125)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
var colorScale = d3
  .scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

const mapG = mapSVG.append("g").attr("class", "main-container");

function handleData() {
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ).then((geoData) => {
    d3.csv("data/population-data.csv").then((pop) => {
      for (let i = 0; i < geoData.features.length; i++) {
        for (let j = 0; j < pop.length; j++) {
          if (geoData.features[i].id === pop[j].iso_code) {
            geoData.features[i].total = pop[j][2014];
          }

          // Handle the missing data
          switch (geoData.features[i].id) {
            case "SDS":
              geoData.features[i].total = "11190000 ";
              break;
            case "ABV":
              geoData.features[i].total = "3500000";
              break;
            case "OSA":
              geoData.features[i].total = "1873000";
              break;
            case "ATF":
              geoData.features[i].total = "100";
              break;
            case "ESH":
              geoData.features[i].total = "4984";
              break;
            case "FLK":
              geoData.features[i].total = "3530";
              break;
            case "TWN":
              geoData.features[i].total = "23852000";
              break;
          }
        }
      }
      start(geoData);
    });
  });
}

function handleMouseOver(data) {
  d3.select(this).style("stroke", "black");
}

function handleMouseOut(data) {
  d3.select(this).style("stroke", "none");
}

function start(data) {
  // Draw the map
  mapG
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    //   set the color of each country
    .attr("fill", (d) => {
      return colorScale(d.total);
    })
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
}

function init() {
  handleData();
}

init();
