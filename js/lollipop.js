//global vars
var lolliData = undefined;
var lolliSVG;

const lollipop = (data) => {
  // avoid having to collect data more than once
  if (lolliData == undefined) {
    lolliData = [];
    lolliSVG = d3.select('#viz');
    var tempArr;
    data.forEach((d) => {
      for (var key in d) {
        // grabbing only 2020 data
        if (d[key].Year != '2020' || d[key].Code == '') {
        } else {
          for (data in d[key]) {
            if (data == 'Annual CO2 emissions (per capita)') {
              // some data is missing for co2
              if (+d[key][data] == 0) {
                tempArr = undefined;
              } else {
                tempArr.CO2 = +d[key][data];
              }
            } else if (data == 'Entity') {
              tempArr = { Entity: d[key][data], CO2: 0 };
            } else if (data == 'Year') {
              d[key][data] = d3.timeParse('%Y')(d[key][data]);
            }
          }
          if (tempArr != undefined) {
            lolliData.push(tempArr);
          }
        }
      }
    });
  }
  lolliSVG = d3
    .select('#viz')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + 100)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  drawLolli();
};

const drawLolli = () => {
  sorting();
  //only will grab the first 25 which will be the highest 25 in CO2 emissions per capita
  lolliData = lolliData.slice(0, 24);

  var div = d3.select('#hidden').attr('class', 'tooltip').style('opacity', 0);
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      lolliData.map(function (d) {
        return d.Entity;
      })
    )
    .padding(1);

  lolliSVG
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(0,0)rotate(-45)')
    .style('text-anchor', 'end');

  var y = d3.scaleLinear().domain([0, getMax()]).range([height, 0]);

  lolliSVG.append('g').call(d3.axisLeft(y));

  lolliSVG
    .selectAll('lines')
    .data(lolliData)
    .enter()
    .append('line')
    .attr('x1', function (d) {
      return x(d.Entity);
    })
    .attr('x2', function (d) {
      return x(d.Entity);
    })
    .attr('y1', function (d) {
      return y(d.CO2);
    })
    .attr('y2', y(0))
    .attr('stroke', '#097969');

  lolliSVG
    .selectAll('circles')
    .data(lolliData)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return x(d.Entity);
    })
    .attr('cy', function (d) {
      return y(d.CO2);
    })
    .attr('r', '4')
    .style('fill', '#097969')
    .on('mouseover', function (d, i) {
      // Allow x and y to be relative to the actual bars and not the parent div
      d3.select(this).transition().duration('50').style('stroke-width', '4px');
      [x, y] = d3.pointer(d, pieSVG.node());
      div.transition().duration(50).style('opacity', 1);

      div
        .html(
          i.Entity + ' emits<br>' + i.CO2 + ' million metric tons (per capita)'
        )
        .style('left', x + 'px')
        .style('top', y + 'px');
    })
    .on('mousemove', function (d, i) {
      [x, y] = d3.pointer(d, pieSVG.node());

      div.style('left', x + 10 + 'px').style('top', y - 155 + 'px');
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration('50').attr('opacity', '1');
      div.transition().duration('50').style('opacity', 0);
      d3.select(this).transition().duration('50').style('stroke-width', '2px');
    });

  lolliSVG
    .append('text')
    .attr('x', width / 2)
    .attr('y', 625)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Countries');

  lolliSVG
    .append('text')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Countries With Highest CO₂ Emissions 2020 (per capita)');

  lolliSVG
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -35)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('CO₂ Emissions (million metric tons)');
};

const sorting = () => {
  for (var ii = 1; ii < lolliData.length; ii++) {
    var jj = ii;
    while (jj > 0 && lolliData[jj].CO2 > lolliData[jj - 1].CO2) {
      var temp = lolliData[jj];
      lolliData[jj] = lolliData[jj - 1];
      lolliData[jj - 1] = temp;
      jj--;
    }
  }
};

const getMax = () => {
  var max = 0;
  for (var key in lolliData) {
    if (lolliData[key].CO2 > max) {
      max = lolliData[key].CO2;
    }
  }
  return max;
};
