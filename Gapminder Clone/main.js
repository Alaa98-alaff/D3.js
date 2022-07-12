const dataUrl =
  "https://raw.githubusercontent.com/adamjanes/udemy-d3/master/05/5.10.0/data/data.json";

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

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
    const formattedData = data.map((year) => {
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

    // run the code every .1 sencond
    d3.interval(() => {
      time < 214 ? time++ : (time = 0);

      update(formattedData[time]);
    }, 100);

    // first run for the visulaization
    update(formattedData[0]);
  })
  .catch((err) => console.log(err));

function update(data) {
  // standard transition time for the visualization
  const t = d3.transition().duration(100);

  const circles = g.selectAll("circle").data(data, (d) => d.country);

  // EXIT old elements not present in new data.
  circles.exit().remove();

  // ENTER new elements present in new data.
  circles
    .enter()
    .append("circle")
    .attr("fill", (d) => containerColor(d.continent))
    .merge(circles)
    .transition(t)
    .attr("cy", (d) => y(d.life_exp))
    .attr("cx", (d) => x(d.income))
    .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));

  // update the time label
  timeLabel.text(String(time + 1800));
}
