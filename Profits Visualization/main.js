const MARGIN = { TOP: 30, RIGHT: 10, BOTTOM: 100, LEFT: 170 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

d3.csv("./data/revenues.csv").then((data) => {
  // convert values to NUMBER
  data.forEach((d) => (d.revenue = Number(d.revenue)));

  // scaleBand for x axis
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.month))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  // scaleLinear for y axis
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.revenue)])
    .range([HEIGHT, 0]);

  // X AXIS
  const xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  // Y AXIS
  const yAxisCall = d3.axisLeft(y).ticks(8);
  g.append("g").attr("class", "y axis").call(yAxisCall);

  // X LABEL
  g.append("text")
    .attr("class", "x axis-label")
    .attr("x", WIDTH / 2.5)
    .attr("transform", `translate(0, ${HEIGHT + 75})`)
    .attr("font-size", "22px")
    .text("Months");

  // Y LABER
  g.append("text")
    .attr("class", "y axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -HEIGHT / 2)
    .attr("y", -80)
    .attr("font-size", "22px")
    .attr("text-anchor", "middle")
    .text("Revenues($)");

  const rects = g.selectAll("rect").data(data);

  rects
    .enter()
    .append("rect")
    .attr("y", (d) => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d.revenue))
    .attr("fill", "grey");
});
