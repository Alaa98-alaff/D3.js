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

const g = svg.append("g").attr("class", "main-container");

// TOOLTIP
const tip = d3
  .tip()
  .attr("class", "d3-tip")
  .html((d) => {
    console.log(d);
    let text = `<span style='font-size:11px'>Country:</span> <span style='color:red; font-size:10px'>${d.properties.name}</span><br>`;
    text += `<span style='font-size:11px'>Population:</span> <span style='color:red; font-size:10px'>${d3.format(
      ",.0f"
    )(d.total)}</span><br>`;
    return text;
  });

g.call(tip);

function handleData() {
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ).then((geoData) => {
    d3.csv("data.csv").then((pop) => {
      for (let i = 0; i < geoData.features.length; i++) {
        for (let j = 0; j < pop.length; j++) {
          if (geoData.features[i].id === pop[j].iso_code)
            geoData.features[i].total = pop[j].population;

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
          }
        }
      }
      update(geoData);
    });
  });
}

function update(data) {
  // Draw the map
  g.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    //   set the color of each country
    .attr("fill", (d) => {
      return colorScale(d.total);
    });
}

function init() {
  handleData();
}

init();
