var choroSVG;
var mapData;
const colorSet = [
  '#febf5b',
  '#fd9d43',
  '#fc7034',
  '#f23d26',
  '#d91620',
  '#b40325',
  '#800026',
];

const choropleth = (data) => {
  // Filter data from 2020
  mapData = data[0].filter(function (d) {
    return +d.year === 2020;
  });

  choroSVG = d3
    .select('#viz')
    .attr('width', width + margin.left + margin.right + 10)
    .attr('height', height + margin.top + margin.bottom + 20)
    .append('g')
    .attr('transform', 'translate(' + 10 + ',' + 10 + ')');

  drawChoro();
};

function drawChoro() {
  var data = new Map();
  let topo = json_world;

  mapData.forEach(function (d) {
    data.set(d.iso_code, +d.co2);
  });

  const projection = d3
    .geoMercator()
    .scale(100)
    .center([0, 20])
    .translate([width / 2, height / 2 + 40]);

  const color = d3.scaleLog(colorSet);

  let div = d3.select('#hidden').attr('class', 'tooltip').style('opacity', 0);

  //Draw choropleth map
  choroSVG
    .append('g')
    .selectAll('path')
    .data(topo.features)
    .join('path')
    .attr('d', d3.geoPath().projection(projection))
    .attr('id', function (d) {
      return d.id;
    })
    .attr('stroke', 'white')
    .attr('stroke-width', 0.2)
    .attr('fill', function (d) {
      d.total = data.get(d.id) || 0;
      return color(d.total);
    })
    .on('mouseover', (d, i) => {
      div.transition().duration(200).style('opacity', 0.9);
      div
        .html(
          `Country: ${i.properties.name} <br> Emissions: ${i['total']} million tons of CO2`
        )
        .style('left', d.clientX + 'px')
        .style('top', d.clientY - 80 + 'px');
    })
    .on('mousemove', (d) => {
      div.style('left', d.clientX + 'px').style('top', d.clientY - 80 + 'px');
    })
    .on('mouseout', () => {
      div.transition().duration(300).style('opacity', 0);
    });

  //Add chart title
  choroSVG
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', 20)
    .text('Total CO₂ Emissions by Country');
}
