const MARGIN = { TOP: 30, RIGHT: 10, BOTTOM: 100, LEFT: 170 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

let flag = true;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// scaleBand for x axis
const x = d3.scaleBand().range([0, WIDTH]).paddingInner(0.3).paddingOuter(0.2);

// scaleLinear for y axis
const y = d3.scaleLinear().range([HEIGHT, 0]);

const xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`);

const yAxisGroup = g.append("g").attr("class", "y axis");

// X LABEL
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2.5)
  .attr("transform", `translate(0, ${HEIGHT + 75})`)
  .attr("font-size", "22px")
  .text("Months");

// Y LABEL
const yLabel = g
  .append("text")
  .attr("class", "y axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -HEIGHT / 2)
  .attr("y", -80)
  .attr("font-size", "22px")
  .attr("text-anchor", "middle");

d3.csv("./data/revenues.csv").then((data) => {
  // convert values to NUMBER
  data.forEach((d) => {
    d.revenue = Number(d.revenue);
    d.profit = Number(d.profit);
  });

  d3.interval(() => {
    flag = !flag;
    const newData = flag ? data : data.slice(1);
    update(newData);
  }, 1000);

  update(data);
});

function update(data) {
  const value = flag ? "profit" : "revenue";
  const t = d3.transition().duration(750);

  x.domain(data.map((d) => d.month));
  y.domain([0, d3.max(data, (d) => d[value])]);

  // X AXIS
  const xAxisCall = d3.axisBottom(x);

  xAxisGroup
    .transition(t)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  // Y AXIS
  const yAxisCall = d3.axisLeft(y).ticks(3);
  yAxisGroup.transition(t).call(yAxisCall);

  // JOIN new data with old elements
  const rects = g.selectAll("rect").data(data, (d) => d.month); // => d.month to fix splice first month issue

  // EXIT old elements not present in new data
  rects
    .exit()
    .attr("fill", "red")
    .transition(t)
    .attr("height", 0)
    .attr("y", y(0))
    .remove();

  rects
    .transition(t)
    .attr("y", (d) => y(d[value]))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d[value]));

  // ENTER new elements present in new data
  rects
    .enter()
    .append("rect")
    .attr("fill", "grey")
    .attr("y", y(0))
    .attr("height", 0)

    // AND UPDATE old elements present in new data
    .merge(rects)
    .transition(t)
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("y", (d) => y(d[value]))
    .attr("height", (d) => HEIGHT - y(d[value]));

  const text = flag ? "Profit ($)" : "Revenue ($)";
  yLabel.text(text);
}
