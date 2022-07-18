export function filterMapData(geoData, data, time) {
  for (let i = 0; i < geoData.features.length; i++) {
    for (let j = 0; j < data[time].length; j++) {
      if (geoData.features[i].properties.name === data[time][j].country) {
        geoData.features[i].total = data[time][j].population;
      }
      if (
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
}
