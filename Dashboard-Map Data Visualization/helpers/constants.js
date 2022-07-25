export const countiresDataUrl =
  "https://raw.githubusercontent.com/adamjanes/udemy-d3/master/05/5.10.0/data/data.json";

export let MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
export let WIDTH = 650 - MARGIN.LEFT - MARGIN.RIGHT;
export let HEIGHT = 340 - MARGIN.TOP - MARGIN.BOTTOM;

// TOOLTIP
export const tip = d3
  .tip()
  .attr("class", "d3-tip")
  .html((d) => {
    let text = `<strong class= 'strong'>Country:</strong> <span class ='span-tip'>${d.country}</span><br>`;
    text += `<strong class= 'strong'>Continent:</strong> <span class ='span-tip'>${d.continent}</span><br>`;
    text += `<strong class= 'strong'>Life Expectancy:</strong> <span class ='span-tip'>${d3.format(
      ".2f"
    )(d.life_exp)}</span><br>`;
    text += `<strong class= 'strong'>GDP Per Capita:</strong> <span class ='span-tip'>${d3.format(
      "$,.0f"
    )(d.income)}</span><br>`;
    text += `<strong class= 'strong'>Population:</strong> <span class ='span-tip'>${d3.format(
      ",.0f"
    )(d.population)}</span><br>`;
    return text;
  });

// LEGEND continents
export const continents = ["europe", "asia", "americas", "africa"];
