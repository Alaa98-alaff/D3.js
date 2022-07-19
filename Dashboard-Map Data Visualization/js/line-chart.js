import {
  countiresDataUrl,
  HEIGHT,
  WIDTH,
  MARGIN,
} from "../helpers/constants.js";

let lineData = [];

d3.json(countiresDataUrl)
  .then((data) => {
    // CLEAN DATA
    let filterdData = data.map((year) => {
      return year["countries"]
        .filter((country) => {
          const dataExists = country.income && country.life_exp;
          return dataExists;
        })
        .map((country) => {
          country.income = Number(country.income);
          country.life_exp = Number(country.life_exp);
          return country;
        });
    });

    // set DATE, POPULATION arr
    for (let i = 0; i < 215; i++) {
      let totalPop = 0;
      for (let j = 0; j < filterdData[i].length; j++) {
        totalPop += filterdData[i][j].population;
      }
      lineData.push({
        year: i + 1800,
        popularity: totalPop,
      });
    }

    updateChart(lineData);
  })
  .catch((err) => console.log(err));

let line;
// Create SVG and padding for the chart
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT);
const chart = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT - 5},${MARGIN.TOP})`);
const grp = chart
  .append("g")
  .attr("transform", `translate(-${MARGIN.LEFT},-${MARGIN.TOP})`);

// Add empty scales group for the scales to be attatched to on update
chart.append("g").attr("class", "x-axis");
chart.append("g").attr("class", "y-axis");

// Add empty path
const path = grp
  .append("path")
  .attr("transform", `translate(${MARGIN.LEFT},0)`)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 1.5);

function updateScales(data) {
  // Create scales
  const yScale = d3
    .scaleLinear()
    .range([HEIGHT, 0])
    .domain([0, d3.max(data, (dataPoint) => dataPoint.popularity)]);
  const xScale = d3
    .scaleLinear()
    .range([0, WIDTH])
    // .domain(d3.extent(data, (dataPoint) => dataPoint.year))
    .domain([1800, 2014])
    .nice();
  return { yScale, xScale };
}

function createLine(xScale, yScale) {
  return (line = d3
    .line()
    .x((dataPoint) => xScale(dataPoint.year))
    .y((dataPoint) => yScale(dataPoint.popularity)));
}

function updateAxes(data, chart, xScale, yScale) {
  chart
    .select(".x-axis")
    .attr("transform", `translate(0,${HEIGHT})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
  chart
    .select(".y-axis")
    .attr("transform", `translate(0, 0)`)
    .call(d3.axisLeft(yScale).ticks(data.popularity));
}

function updatePath(data, line) {
  const updatedPath = path.interrupt().datum(data).attr("d", line);

  const pathLength = updatedPath.node().getTotalLength();
  // D3 provides lots of transition options, have a play around here:
  // https://github.com/d3/d3-transition
  const transitionPath = d3.transition().ease(d3.easeSin).duration(2500);
  updatedPath
    .attr("stroke-dashoffset", pathLength)
    .attr("stroke-dasharray", pathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0);
}

function updateChart(data) {
  const { yScale, xScale } = updateScales(data);
  const line = createLine(xScale, yScale);
  updateAxes(data, chart, xScale, yScale);
  updatePath(data, line);
}
