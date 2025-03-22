var lineSVG;
var lineData;

const line = (data) => {
  lineData = data[0];

  lineSVG = d3
    .select('#viz')
    .attr('width', width + margin.left + margin.right + 10)
    .attr('height', height + margin.top + margin.bottom + 20)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  drawLine();
};

function drawLine() {
  var minDate = minYear(lineData);
  var maxDate = 2022;

  var min = minVal(lineData);
  var max = maxVal(lineData);

  var x = d3
    .scaleTime()
    .domain([new Date(minDate, 0, 1), new Date(maxDate, 0, 1)])
    .range([0, width]);

  lineSVG
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear().domain([0, max]).range([height, 0]);

  lineSVG.append('g').call(d3.axisLeft(y));

  //Label chart
  lineSVG
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', -20)
    .text('Increase in Storms between 1955 and 2022 (National)');

  //Label x axis
  lineSVG
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .text('Year');

  //Label y axis
  lineSVG
    .append('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 12)
    .attr('x', -height / 2 + 150)
    .text('Number of Extreme Weather Events (US)');

  // Draw linear trend line
  var trendline = d3.path();
  trendline.moveTo(x(new Date(1955, 0, 1)), y(547));
  trendline.lineTo(x(new Date(2022, 0, 1)), y(1671.5));
  trendline.closePath();

  lineSVG
    .append('path')
    .attr('stroke', 'CornflowerBlue')
    .attr('opacity', '0.7')
    .style('stroke-dasharray', '3,3')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('d', trendline);

  // Draw line
  var line = d3
    .line()
    .x(function (d) {
      return x(new Date(d.Year));
    })
    .y(function (d) {
      return y(d['Number of Storms']);
    })
    .curve(d3.curveNatural);

  lineSVG
    .append('path')
    .datum(lineData)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'SteelBlue')
    .attr('stroke-width', 1.5)
    .attr('d', line);
}

function minYear(d) {
  return Math.min(...d.map((o) => o.Year));
}

function minVal(d) {
  return Math.min(...d.map((o) => o['Number of Storms']));
}

function maxVal(d) {
  return Math.max(...d.map((o) => o['Number of Storms']));
}
