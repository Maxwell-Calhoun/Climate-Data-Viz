// global vars
var pieData = [];
var pieSVG;

const pie = (data) => {
  // avoid having to collect data more than once
  if (pieData.length == 0) {
    for (var key in data[0][0]) {
      if (key == 'GeoType' || key == 'GeoName') {
      } else {
        data[0][0][key] = +data[0][0][key];
      }
      if (key == 'happening' || key == 'happeningOppose') {
        pieData[key] = Math.round(+data[0][0][key] * 100) / 100;
      }
    }
  }

  pieData['undecided'] = 100 - (pieData.happening + pieData.happeningOppose);
  pieData['undecided'] = Math.round(pieData['undecided'] * 100) / 100;

  pieSVG = d3
    .select('#viz')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + 300 + ')');

  drawPie();
};

function drawPie() {
  colors = ['#98abc5', '#c59c98', '#808080'];
  var pieColor = d3.scaleOrdinal().domain(pieData).range(colors);
  var div = d3.select('#hidden').attr('class', 'tooltip').style('opacity', 0);
  var arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2);
  var pie = d3.pie().value(function (d) {
    return d[1];
  });

  pieSVG
    .selectAll('line')
    .data(pie(Object.entries(pieData)))
    .join('path')
    .attr('d', arc)
    .attr('fill', (d) => pieColor(d.data[0]))
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .on('mouseover', function (d, i) {
      // Allow x and y to be relative to the actual bars and not the parent div
      d3.select(this).transition().duration('50').style('stroke-width', '4px');
      [x, y] = d3.pointer(d, pieSVG.node());
      div.transition().duration(50).style('opacity', 1);
      var display = '';
      if (i.index == 1) {
        display = '% Do not believe<br>climate change is real';
      } else if (i.index == 2) {
        display = '% Are undecided';
      } else {
        display = '% Believe climate<br>change is real';
      }
      div
        .html(i.value + display)
        .style('left', x + 'px')
        .style('top', y + 'px');
    })
    .on('mousemove', function (d, i) {
      [x, y] = d3.pointer(d, pieSVG.node());
      div.style('left', x + 250 + 'px').style('top', y + 270 + 'px');
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration('50').attr('opacity', '1');
      div.transition().duration('50').style('opacity', 0);
      d3.select(this).transition().duration('50').style('stroke-width', '2px');
    });

  pieSVG
    .append('text')
    .attr('x', 0)
    .attr('y', -275)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Whether or Not People Believe In Climate Change (National)');

  pieSVG
    .append('circle')
    .attr('cx', 200)
    .attr('cy', -240)
    .attr('r', 6)
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('fill', colors[0])
    .style('stroke');

  pieSVG
    .append('text')
    .attr('x', 220)
    .attr('y', -240)
    .text('Believes')
    .style('font-size', '15px')
    .attr('alignment-baseline', 'middle');

  pieSVG
    .append('circle')
    .attr('cx', 200)
    .attr('cy', -220)
    .attr('r', 6)
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('fill', colors[1])
    .style('stroke');

  pieSVG
    .append('text')
    .attr('x', 220)
    .attr('y', -220)
    .text('Does Not Believe')
    .style('font-size', '15px')
    .attr('alignment-baseline', 'middle');

  pieSVG
    .append('circle')
    .attr('cx', 200)
    .attr('cy', -200)
    .attr('r', 6)
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('fill', colors[2])
    .style('stroke');

  pieSVG
    .append('text')
    .attr('x', 220)
    .attr('y', -200)
    .text('Undecided')
    .style('font-size', '15px')
    .attr('alignment-baseline', 'middle');
}
