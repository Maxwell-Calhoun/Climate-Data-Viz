// Variables to house each of the datasets
let csv_CO2Emissions,
  csv_CO2vGDP,
  csv_HDI,
  csv_OpinionData,
  csv_tornadoCount,
  json_world;

const margin = { top: 50, right: 25, bottom: 50, left: 50 },
  width = 700 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    d3.csv('./data/CO2Data.csv'),
    d3.csv('./data/CO2vGDP.csv'),
    d3.csv('./data/HDI.csv'),
    d3.csv('./data/OpinionData.csv'),
    d3.csv('./data/tornadoCount.csv'),
    d3.json('./data/world.geojson'),
  ]).then(function (values) {
    csv_CO2Emissions = [values[0]];
    csv_CO2vGDP = [values[1]];
    csv_HDI = [values[2]];
    csv_OpinionData = [values[3]];
    csv_tornadoCount = [values[4]];
    json_world = values[5];

    // Function triggers when crossing section boundaries
    function scroll(n, offset, func1, func2, data1 = null, data2 = null) {
      return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
          clearViz();
          direction == 'down' ? func1(data1) : func2(data2); // function to run when scrolling down (true) : up (false)
        },
        offset: offset,
      });
    }

    new scroll(
      'div2',
      '50%',
      pie,
      () => {
        return;
      },
      csv_OpinionData,
      null
    );
    new scroll('div3', '50%', line, pie, csv_tornadoCount, csv_OpinionData);
    new scroll('div4', '50%', lollipop, line, csv_CO2vGDP, csv_tornadoCount);
    new scroll(
      'div5',
      '50%',
      choropleth,
      lollipop,
      csv_CO2Emissions,
      csv_CO2vGDP
    );
    new scroll(
      'div6',
      '50%',
      scatterplot,
      choropleth,
      csv_HDI,
      csv_CO2Emissions
    );
    new scroll('div7', '50%', inno, scatterplot, csv_CO2Emissions, csv_HDI);
  });
});

/**
 * Clears SVG element
 */
const clearViz = () => {
  document.getElementById('hidden').style.opacity = 0;
  d3.selectAll('svg > *').remove();
};
