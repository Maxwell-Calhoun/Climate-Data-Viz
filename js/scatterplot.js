let scatterData = [];
let scatterSVG;

const scatterplot = (data) => {
  scatterSVG = d3
    .select('#viz')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + 20)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  scatterData = data[0];
  drawScatter();
};

const drawScatter = () => {
  // SCALES

  let x = d3
    .scaleTime()
    .domain([new Date('1987'), new Date('2023')])
    .range([0, width]);
  let y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

  let div = d3.select('#hidden').attr('class', 'tooltip').style('opacity', 0);

  scatterSVG
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).ticks(4));
  scatterSVG.append('g').call(d3.axisLeft(y));

  // LABELS

  scatterSVG
    .append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', width / 2)
    .attr('y', height + 25)
    .text('Year');
  scatterSVG
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', 0 - height / 2)
    .attr('y', 0 - 50)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('HDI');

  scatterSVG
    .append('text')
    .attr('x', width / 2)
    .attr('y', 0 - margin.top / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('HDI by Country');

  // DATA

  scatterSVG
    .append('g')
    .selectAll('dot')
    .data(scatterData)
    .enter()
    .append('circle')
    .attr('cx', (d) => {
      return x(new Date(d['Year']));
    })
    .attr('cy', (d) => {
      return y(parseFloat(d['HDI']));
    })
    .attr('r', 5)
    .style('fill', 'black')
    .style('opacity', 0.3)
    .style('stroke', 'white')
    .on('mouseover', (d, i) => {
      div.transition().duration(200).style('opacity', 0.9);
      div
        .html(`Country: ${i['Country']} <br> HDI: ${i['HDI']}`)
        .style('left', d.clientX + 'px')
        .style('top', d.clientY - 80 + 'px');
    })
    .on('mousemove', (d) => {
      div.style('left', d.clientX + 'px').style('top', d.clientY - 80 + 'px');
    })
    .on('mouseout', () => {
      div.transition().duration(300).style('opacity', 0);
    });
};
