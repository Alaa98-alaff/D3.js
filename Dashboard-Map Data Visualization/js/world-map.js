import {
  getHoveredData,
  handleUnHovered,
  handleEnterdPath,
} from "./gdp-chart.js";
import { filterMapData } from "../helpers/filterMapData.js";

let geoData;

// Get the world map DATA
d3.json(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
).then((data) => (geoData = data));

// The svg
let mapSVG = d3.select("#world-map"),
  width = +mapSVG.attr("width"),
  height = +mapSVG.attr("height");

// Map and projection
let projection = d3
  .geoMercator()
  .scale(125)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
let colorScale = d3
  .scaleThreshold()
  .domain([1000000, 10000000, 100000000, 300000000, 1000000000, 5000000000])
  .range(d3.schemeBlues[7]);

const mapG = mapSVG.append("g").attr("class", "main-container");

export function handleData(time, data) {
  filterMapData(geoData, data, time);
  renderMap(geoData);
}

function handleMouseOver(data) {
  d3.select(this).style("stroke", "black");
  getHoveredData(data.properties.name);
}

function handleMouseOut(data) {
  d3.select(this).style("stroke", "none");
  handleUnHovered(data.properties.name);
}

function handleMouseEnter(data) {
  handleEnterdPath(data);
}

function renderMap(data) {
  // JOIN new data with the old elements.
  let paths = mapG.selectAll("path").data(data.features, (d) => d);

  // EXIT old elements not present in new data.
  paths.exit().remove();

  // ENTER new elements present in new data.
  paths
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    //   set the color of each country
    .attr("fill", (d) => colorScale(d.total))
    .merge(paths)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleMouseEnter);
}
