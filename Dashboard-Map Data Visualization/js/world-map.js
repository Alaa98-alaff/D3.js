import {
  getHoveredData,
  handleUnHovered,
  handleEnterdPath,
} from "./gdp-chart.js";
import { filterMapData } from "../helpers/filterMapData.js";

let geoData, selectedCont;

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
  .scale(130)
  .center([0, 45])
  .translate([width / 2, height / 2]);

// Data and color scale
let colorScale = d3
  .scaleThreshold()
  .domain([1000000, 10000000, 100000000, 300000000, 1000000000, 5000000000])
  .range(d3.schemeBlues[7]);

const mapG = mapSVG.append("g").attr("class", "main-container");

export function handleData(time, data, countries) {
  filterMapData(geoData, data, time, countries);
  renderMap(geoData, countries);
}

let clickedElIndex;
const mapPaths = document.querySelector(".main-container").children;

function handleMouseOver(data) {
  if (!selectedCont) this.setAttribute("stroke", "black");
  getHoveredData(data.properties.name);
}

function handleMouseOut(data) {
  for (let i = 0; i < mapPaths.length; i++) {
    if (
      i !== clickedElIndex &&
      mapPaths[i].getAttribute("stroke") !== "purple"
    ) {
      mapPaths[i].setAttribute("stroke", "none");
    }
  }

  handleUnHovered(data.properties.name);
}

function handleMouseEnter(data) {
  for (let i = 0; i < mapPaths.length; i++) {
    mapPaths[i].setAttribute("stroke", "none");
    if (mapPaths[i] === this) clickedElIndex = i;
  }

  d3.select(this).attr("stroke", "black");

  document.getElementById("continent-select").value = "all";
  handleEnterdPath(data);
}

// HANLDE CLICK outside the map
document.querySelector(".charts").addEventListener("click", (e) => {
  for (let i = 0; i < mapPaths.length; i++) {
    mapPaths[i].setAttribute("stroke", "none");
  }
  document.getElementById("continent-select").value = "all";
});

function renderMap(data) {
  // JOIN new data with the old elements.
  let paths = mapG.selectAll("path").data(data.features, (d) => d);

  // EXIT old elements not present in new data.
  paths.exit().remove();

  // ENTER new elements present in new data.
  paths
    .enter()
    .append("path")
    .attr("country", (d) => d.properties.name)
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    //   set the color of each country
    .attr("fill", (d) => colorScale(d.total))
    .attr("selected-country", (d) => d.selectedCountry)
    .merge(paths)
    .attr("stroke", (d) => (d.selectedCountry ? "purple" : "none"))
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", handleMouseEnter);
}

document.getElementById("continent-select").addEventListener("change", (e) => {
  clickedElIndex = undefined;
  if (e.target.value !== "all") selectedCont = true;
});
