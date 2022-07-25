import { handleData } from "./world-map.js";
import {
  countiresDataUrl,
  tip,
  continents,
  WIDTH,
  HEIGHT,
  MARGIN,
} from "../helpers/constants.js";
import { updateChart } from "./line-chart.js";

export let time = 0; // represent year
export let formattedData, interval, circles;
let clickedCountry, hoverdCountry;
let continentCountries = [];

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

export function getHoveredData(country) {
  // HANDLE WHEN PLAY BUTTON CLIKED
  clearInterval(interval);
  hoverdCountry = country;

  // SET HOVERED COUNTRY
  formattedData[time].forEach((data) => {
    if (data.country === country) data.hoverd = true;
    else if (!data.clicked) data.hoverd = false;
  });
  update(formattedData[time], true);
}

export function handleEnterdPath(mapData) {
  // HANDLE WHEN PLAY BUTTON CLIKED
  clearInterval(interval);
  clickedCountry = mapData.properties.name;

  // update line chart
  let lineData = [];
  for (let i = 0; i < 215; i++) {
    let totalPop = 0;
    for (let j = 0; j < formattedData[i].length; j++) {
      if (formattedData[i][j].country === mapData.properties.name) {
        totalPop += formattedData[i][j].population;
        lineData.push({ year: i + 1800, popularity: totalPop });
      }
    }
  }
  updateChart(lineData, mapData);

  // update GDP chart
  formattedData[time].forEach((data) => {
    if (data.country === mapData.properties.name) {
      data.clicked = true;
    } else data.clicked = false;

    if (clickedCountry && hoverdCountry) {
      if (data.country !== clickedCountry) data.hoverd = false;
      else data.hoverd = true;
    }
  });

  continentCountries = [];
  update(formattedData[time], true);
}

export function handleUnHovered(country) {
  // HANDLE WHEN PLAY BUTTON CLIKED
  if ($("#play-button").text() === "Pause") interval = setInterval(step, 100);
  // SET HOVERED COUNTRY
  formattedData[time].forEach((data) => {
    if (!clickedCountry) {
      if (data.country === country) data.hoverd = false;
      else data.hoverd = true;
    }

    if (clickedCountry && hoverdCountry && !continentCountries.length) {
      if (data.country !== clickedCountry) data.hoverd = false;
      else data.hoverd = true;
    } else if (clickedCountry && hoverdCountry && continentCountries.length) {
      data.hoverd = true;
    }
  });
  update(formattedData[time], true);
}

// HANLDE CLICK outside the map
document.querySelector(".charts").addEventListener("click", (e) => {
  clickedCountry = "";
  hoverdCountry = "";
  continentCountries = [];
  update(formattedData[time], false);
});

// Call toolTip on hover
g.call(tip);

// SCALES
const x = d3.scaleLog().base(10).range([0, WIDTH]).domain([142, 150000]);
const y = d3.scaleLinear().range([HEIGHT, 0]).domain([0, 90]);
const area = d3
  .scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([2000, 1400000000]);
const containerColor = d3.scaleOrdinal(d3.schemePastel1);

// X axis
const xAxisCall = d3
  .axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$"));

const gx = g
  .append("g")
  .attr("transform", `translate(0, ${HEIGHT})`)
  .attr("class", `x axis`)
  .call(xAxisCall);

// Y axis
const yAxisCall = d3.axisLeft(y);
const gy = g.append("g").attr("class", `y axis`).call(yAxisCall);

const legend = g
  .append("g")
  .attr("transform", `translate(${WIDTH - 10}, ${HEIGHT - 145})`);

continents.forEach((continent, i) => {
  const legendRow = legend
    .append("g")
    .attr("transform", `translate(0, ${i * 20})`);

  legendRow
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", containerColor(continent));

  legendRow
    .append("text")
    .attr("x", -8)
    .attr("y", 10)
    .style("text-transform", "capitalize")
    .attr("text-anchor", "end")
    .text(continent);
});

// LABELS
const xLabel = g
  .append("text")
  .attr("y", HEIGHT + 50)
  .attr("x", WIDTH / 2)
  .attr("class", "Label")
  .text("GDP Per Capita ($)");

const yLabel = g
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -50)
  .attr("x", -110)
  .attr("class", "Label")
  .text("Life Expectancy (Years)");

const timeLabel = g
  .append("text")
  .attr("class", "year")
  .attr("y", HEIGHT - 20)
  .attr("x", WIDTH - 40)
  .attr("opacity", "0.4")
  .text("1800");

d3.json(countiresDataUrl)
  .then((data) => {
    // CLEAN DATA
    formattedData = data.map((year) => {
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

    // first run for the visulaization
    update(formattedData[0]);
    handleData(time, formattedData, continentCountries);
  })
  .catch((err) => console.log(err));

function step() {
  time < 214 ? time++ : (time = 0);
  update(formattedData[time]);
  handleData(time, formattedData, continentCountries);
}

$("#play-button").on("click", function () {
  const button = $(this);

  if (button.text() === "Play") {
    button.text("Pause");
    interval = setInterval(step, 100);
  } else {
    clearInterval(interval);
    button.text("Play");
  }
});

$("#reset-button").on("click", () => {
  time = 0;
  document.getElementById("continent-select").value = "all";
  continentCountries = [];
  handleData(0, formattedData, continentCountries);
  update(formattedData[0]);
});

$("#continent-select").on("change", () => {
  update(formattedData[time]);
  handleData(time, formattedData, continentCountries);
});

$("#date-slider").slider({
  min: 1800,
  max: 2014,
  step: 1,
  slide: (event, ui) => {
    time = ui.value - 1800;
    update(formattedData[time]);
    handleData(time, formattedData, continentCountries);
  },
});

function update(data, interactive) {
  // UPDATE WIDTH AND HEIGHT
  svg
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
  x.range([0, WIDTH]);
  y.range([HEIGHT, 0]);
  gx.attr("transform", `translate(0, ${HEIGHT})`);
  gy.call(yAxisCall);
  legend.attr("transform", `translate(${WIDTH - 10}, ${HEIGHT - 145})`);
  xLabel.attr("y", HEIGHT + 50).attr("x", WIDTH / 2);
  timeLabel.attr("y", HEIGHT - 20).attr("x", WIDTH - 40);

  // standard transition time for the visualization
  const t = d3.transition().duration(100);

  // FITER the continents
  const selectedContinent = $("#continent-select").val();

  const fiterdData = data.filter((d) => {
    if (selectedContinent === "all") return true;
    else {
      return d.continent === selectedContinent;
    }
  });

  // JOIN new data with the old elements.
  circles = g.selectAll("circle").data(fiterdData, (d) => d.country);

  // EXIT old elements not present in new data.
  circles.exit().remove();

  // ENTER new elements present in new data.
  circles
    .enter()
    .append("circle")
    .attr("fill", (d) => containerColor(d.continent))
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .merge(circles)
    .transition(t)
    .attr("cy", (d) => y(d.life_exp))
    .attr("cx", (d) => x(d.income))
    .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI))
    .attr("opacity", (d) => {
      if (!interactive || (interactive && d.hoverd)) return "1";
      else if (interactive && !d.hoverd) return "0";
    })
    .attr("display", (d) => {
      if (!interactive || (interactive && d.hoverd)) return "1";
      else if (interactive && !d.hoverd) return "none";
    })
    .attr("country", (d) => d.country);

  // update the time label
  timeLabel.text(String(time + 1800));

  // Update the slider
  $("#year")[0].innerHTML = String(time + 1800);
  $("#date-slider").slider("value", Number(time + 1800));

  // update tooltip position
  if (time > 100 || window.innerWidth <= 1320) tip.direction("s");
  else tip.direction("n");
}

// Handle continent filtering
document.getElementById("continent-select").addEventListener("change", (e) => {
  const fiterdData = formattedData[time].filter((d) => {
    if (e.target.value === "all") return true;
    else {
      return d.continent === e.target.value;
    }
  });

  if (e.target.value !== "all") {
    continentCountries = [];
    fiterdData.forEach((countries) => {
      continentCountries.push(countries.country);
    });

    handleData(time, formattedData, continentCountries);
  } else {
    continentCountries = [];
    handleData(time, formattedData, continentCountries);
  }
});
