const dataUrl =
  "https://raw.githubusercontent.com/adamjanes/udemy-d3/master/05/5.10.0/data/data.json";

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
let WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT;
let HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

let time = 0; // represent year
let formattedData, interval;

// TOOLTIP
const tip = d3
  .tip()
  .attr("class", "d3-tip")
  .html((d) => {
    let text = `<strong style='font-size:13px'>Country:</strong> <span style='color:red; font-size:12px'>${d.country}</span><br>`;
    text += `<strong style='font-size:13px'>Continent:</strong> <span style='color:red; font-size:12px'>${d.continent}</span><br>`;
    text += `<strong style='font-size:13px'>Life Expectancy:</strong> <span style='color:red; font-size:12px'>${d3.format(
      ".2f"
    )(d.life_exp)}</span><br>`;
    text += `<strong style='font-size:13px'>GDP Per Capita:</strong> <span style='color:red; font-size:12px'>${d3.format(
      "$,.0f"
    )(d.income)}</span><br>`;
    text += `<strong style='font-size:13px'>Population:</strong> <span style='color:red; font-size:12px'>${d3.format(
      ",.0f"
    )(d.population)}</span><br>`;
    return text;
  });

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

g.append("g")
  .attr("transform", `translate(0, ${HEIGHT})`)
  .attr("class", `x axis`)
  .call(xAxisCall);

// Y axis
const yAxisCall = d3.axisLeft(y);
g.append("g").attr("class", `y axis`).call(yAxisCall);

// LEGEND
const continents = ["europe", "asia", "americas", "africa"];

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
  .attr("y", HEIGHT + 60)
  .attr("x", WIDTH / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)");

const yLabel = g
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -50)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Life Expectancy (Years)");

const timeLabel = g
  .append("text")
  .attr("y", HEIGHT - 20)
  .attr("x", WIDTH - 40)
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")
  .attr("font-size", "40px")
  .text("1800");

d3.json(dataUrl)
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
  })
  .catch((err) => console.log(err));

function step() {
  time < 214 ? time++ : (time = 0);
  update(formattedData[time]);
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
  update(formattedData[0]);
});

$("#continent-select").on("change", () => {
  update(formattedData[time]);
});

$("#date-slider").slider({
  min: 1800,
  max: 2014,
  step: 1,
  slide: (event, ui) => {
    time = ui.value - 1800;
    update(formattedData[time]);
  },
});

function update(data) {
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
  const circles = g.selectAll("circle").data(fiterdData, (d) => d.country);

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
    .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));

  // update the time label
  timeLabel.text(String(time + 1800));

  // Update the slider
  $("#year")[0].innerHTML = String(time + 1800);
  $("#date-slider").slider("value", Number(time + 1800));
}
