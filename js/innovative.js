var innoData = undefined;
var innoSVG;

const inno = (data) => {
  if (!innoData) {
    innoData = [];
    data.forEach((d) => {
      for (var key in d) {
        // grabbing 2018 as this was the last year that had the most complete data
        if (d[key].year === '2018') {
          for (var ii in d[key]) {
            if (ii == 'year' || ii == 'country') {
            } else {
              d[key][ii] = +d[key][ii];
            }
          }
          innoData[innoData.length] = d[key];
        }
      }
    });

    // Filter all zeroed data
    while (minCO2(innoData) == 0 || minGDP(innoData) == 0) {
      for (var ii in innoData) {
        if (
          innoData[ii].gdp == 0 ||
          innoData[ii].co2 == 0 ||
          innoData[ii].country == 'World' ||
          innoData[ii].coal_co2 == 0 ||
          innoData[ii].cement_co2 == 0 ||
          innoData[ii].gas_co2 == 0 ||
          innoData[ii].oil_co2 == 0
        ) {
          innoData.splice(ii, 1);
          ii -= 5;
        }
      }
    }
  }

  drawInno();
};

const drawInno = () => {
  innoSVG = d3
    .select('#viz')
    .attr('width', width + margin.left + margin.right + 25)
    .attr('height', height + margin.top + margin.bottom + 100)
    .append('g')
    .attr(
      'transform',
      'translate(' + (margin.left + 45) + ',' + margin.top + ')'
    );

  var div = d3.select('#hidden').attr('class', 'tooltip').style('opacity', 0);
  var x = d3
    .scaleLog()
    .range([0, width - 45])
    .domain([minPop(innoData), maxPop(innoData) ** 1.1]);

  innoSVG
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).ticks(4))
    .selectAll('text')
    .attr('transform', 'translate(0,0)rotate(-45)')
    .style('text-anchor', 'end');

  var y = d3
    .scaleLog()
    .domain([minGDP(innoData), maxGDP(innoData) * 5])
    .range([height, 0]);

  innoSVG
    .append('g')
    .call(d3.axisLeft(y).ticks(3, '~s'))
    .selectAll('text')
    .attr('transform', 'translate(0,0)rotate(-45)')
    .style('text-anchor', 'end');

  var z = d3
    .scaleLinear()
    .domain([minCO2(innoData), maxCO2(innoData)])
    .range([1, 50]);

  innoSVG
    .append('g')
    .selectAll('dot')
    .data(innoData)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return x(d.population);
    })
    .attr('cy', function (d) {
      return y(d.gdp);
    })
    .attr('r', function (d) {
      return z(d.co2);
    })
    .style('fill', '#69b3a2')
    .style('opacity', '0.7')
    .attr('stroke', 'black')
    .on('mouseover', function (d, i) {
      // Allow x and y to be relative to the actual bars and not the parent div
      d3.select(this).transition().duration('50').style('stroke-width', '6px');
      [x, y] = d3.pointer(d, pieSVG.node());
      div.transition().duration(50).style('opacity', 1);
      div
        .html(
          i.country +
            '<br>Population: ' +
            i.population +
            '<br>CO₂ (Millon Metric Tons): ' +
            i.co2
        )
        .style('left', x + 'px')
        .style('top', y + 'px');
    })
    .on('mousemove', function (d, i) {
      [x, y] = d3.pointer(d, pieSVG.node());
      div.style('left', x - 75 + 'px').style('top', y - 175 + 'px');
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration('50').attr('opacity', '1');
      div.transition().duration('50').style('opacity', 0);
      d3.select(this).transition().duration('50').style('stroke-width', '1px');
    })
    .on('click', function (d, i) {
      drawInnoPie(i.country);
      div.transition().duration('50').style('opacity', 0);
    });

  innoSVG
    .append('text')
    .attr('x', width / 2)
    .attr('y', 575)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Population');

  innoSVG
    .append('text')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('CO₂ Emissions by Country given Population and GDP (2018)');

  innoSVG
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -80)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Gross Domestic Product (GDP)');
};

drawInnoPie = (countryName) => {
  clearViz();
  innoSVG = d3
    .select('#viz')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + 300 + ')');
  var innoPieData;
  for (var key in innoData) {
    if (innoData[key].country == countryName) {
      innoPieData = {
        coal: innoData[key].coal_co2,
        cement: innoData[key].cement_co2,
        gas: innoData[key].gas_co2,
        oil: innoData[key].oil_co2,
      };
    }
  }

  if (innoPieData == undefined) return;

  var color = d3.scaleOrdinal(d3.schemeSet3);
  var div = d3.select('#hidden').attr('class', 'tooltip').style('opacity', 0);
  var arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2);
  var pie = d3.pie().value(function (d) {
    return d[1];
  });

  innoSVG
    .selectAll('line')
    .data(pie(Object.entries(innoPieData)))
    .join('path')
    .attr('d', arc)
    .attr('fill', (d) => color(d.data[0]))
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .on('mouseover', function (d, i) {
      //this should allow the x and y to be relative to the actual bars and not the parent div
      d3.select(this).transition().duration('50').style('stroke-width', '4px');
      [x, y] = d3.pointer(d, pieSVG.node());
      div.transition().duration(50).style('opacity', 1);
      div
        .html(i.value + ' million metric tons<br>of CO₂ come from ' + i.data[0])
        .style('left', x + 'px')
        .style('top', y + 'px');
    })
    .on('mousemove', function (d, i) {
      [x, y] = d3.pointer(d, pieSVG.node());
      div.style('left', x - 150 + 'px').style('top', y - 150 + 'px');
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration('50').attr('opacity', '1');
      div.transition().duration('50').style('opacity', 0);
      d3.select(this).transition().duration('50').style('stroke-width', '2px');
    })
    .on('click', function (d, i) {
      clearViz();
      drawInno();
    });

  // Title
  innoSVG
    .append('text')
    .attr('x', 0)
    .attr('y', -275)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text(`CO2 Emission Sources - ${countryName}`);

  // Legend
  innoSVG
    .append('circle')
    .attr('cx', 200)
    .attr('cy', -240)
    .attr('r', 6)
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('fill', d3.schemeSet3[0])
    .style('stroke');

  innoSVG
    .append('text')
    .attr('x', 220)
    .attr('y', -240)
    .text('Coal')
    .style('font-size', '15px')
    .attr('alignment-baseline', 'middle');

  innoSVG
    .append('circle')
    .attr('cx', 200)
    .attr('cy', -220)
    .attr('r', 6)
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('fill', d3.schemeSet3[2])
    .style('stroke');

  innoSVG
    .append('text')
    .attr('x', 220)
    .attr('y', -220)
    .text('Gas')
    .style('font-size', '15px')
    .attr('alignment-baseline', 'middle');

  innoSVG
    .append('circle')
    .attr('cx', 200)
    .attr('cy', -200)
    .attr('r', 6)
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('fill', d3.schemeSet3[1])
    .style('stroke');

  innoSVG
    .append('text')
    .attr('x', 220)
    .attr('y', -200)
    .text('Cement')
    .style('font-size', '15px')
    .attr('alignment-baseline', 'middle');

  innoSVG
    .append('circle')
    .attr('cx', 200)
    .attr('cy', -180)
    .attr('r', 6)
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('fill', d3.schemeSet3[3])
    .style('stroke');

  innoSVG
    .append('text')
    .attr('x', 220)
    .attr('y', -180)
    .text('Oil')
    .style('font-size', '15px')
    .attr('alignment-baseline', 'middle');
};

function minGDP(d) {
  return Math.min(...d.map((o) => o.gdp));
}

function maxGDP(d) {
  return Math.max(...d.map((o) => o.gdp));
}

function minCO2(d) {
  return Math.min(...d.map((o) => o.co2));
}

function maxCO2(d) {
  return Math.max(...d.map((o) => o.co2));
}

function minPop(d) {
  return Math.min(...d.map((o) => o.population));
}

function maxPop(d) {
  return Math.max(...d.map((o) => o.population));
}
