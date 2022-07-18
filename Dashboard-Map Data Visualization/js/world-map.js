import { getHoveredData, handleUnHovered } from "./gdp-chart.js";

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
  // d3.json(
  //   "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  // ).then((geoData) => {
  for (let i = 0; i < geoData.features.length; i++) {
    for (let j = 0; j < data[time].length; j++) {
      // Handle the data and missing data
      if (geoData.features[i].properties.name === data[time][j].country) {
        geoData.features[i].total = data[time][j].population;
      } else if (
        geoData.features[i].properties.name === "USA" &&
        data[time][j].country === "United States"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name = "United States";
      } else if (
        geoData.features[i].properties.name === "United Republic of Tanzania" &&
        data[time][j].country === "Tanzania"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Tanzania";
      } else if (
        geoData.features[i].properties.name === "Ivory Coast" &&
        data[time][j].country === "Cote d'Ivoire"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Cote d'Ivoire";
      } else if (
        geoData.features[i].properties.name ===
          "Democratic Republic of the Congo" &&
        data[time][j].country === "Congo, Dem. Rep."
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Congo, Dem. Rep.";
      } else if (
        geoData.features[i].properties.name === "Republic of the Congo" &&
        data[time][j].country === "Congo, Dem. Rep."
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Congo, Dem. Rep.";
      } else if (
        geoData.features[i].properties.name === "England" &&
        data[time][j].country === "United Kingdom"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "United Kingdom";
      } else if (
        geoData.features[i].properties.name === "Somaliland" &&
        data[time][j].country === "Somalia"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Somalia";
      } else if (
        geoData.features[i].properties.name === "West Bank" &&
        data[time][j].country === "Palestine"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Palestine";
      } else if (
        geoData.features[i].properties.name === "Laos" &&
        data[time][j].country === "Lao"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Lao";
      } else if (
        geoData.features[i].properties.name === "Kyrgyzstan" &&
        data[time][j].country === "Kyrgyz Republic"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Kyrgyz Republic";
      } else if (
        geoData.features[i].properties.name === "Republic of Serbia" &&
        data[time][j].country === "Serbia"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Serbia";
      } else if (
        geoData.features[i].properties.name === "Guinea Bissau" &&
        data[time][j].country === "Guinea-Bissau"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Guinea-Bissau";
      } else if (
        geoData.features[i].properties.name === "Slovakia" &&
        data[time][j].country === "Czechoslovakia"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Czechoslovakia";
      } else if (
        geoData.features[i].properties.name === "Macedonia" &&
        data[time][j].country === "Macedonia, FYR"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Macedonia, FYR";
      } else if (
        geoData.features[i].properties.name ===
          "French Southern and Antarctic Lands" &&
        data[time][j].country === "French Polynesia"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "French Polynesia";
      } else if (
        geoData.features[i].properties.name === "Falkland Islands" &&
        data[time][j].country === "Falkland Is (Malvinas)"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Falkland Is (Malvinas)";
      } else if (
        geoData.features[i].properties.name === "The Bahamas" &&
        data[time][j].country === "Bahamas"
      ) {
        geoData.features[i].total = data[time][j].population;
        geoData.features[i].properties.name === "Bahamas";
      }
    }
  }
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
    .on("mouseout", handleMouseOut);
}
