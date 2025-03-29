# Climate Change Data Visualization

Developed By:
- [Maxwell Calhoun](https://github.com/Maxwell-Calhoun)
- [Raj Datta](https://github.com/rajdtta)
- [Tucker Prynn](https://github.com/Tucker-Prynn)

## Project Overview

Climate change has been regarded as humanity's greatest and most immediate external threat. Within our narrative, we aim to explain how climate change came to be such a large problem in modern society (kicking off from the industrial age), the effects it has on our local and global environment, and why it is not as simple of a problem to solve as it may seem at first (due to the intricacies of global supply chains and economic demand).

## Goals and Tasks

The primary task of the user is to analyze trends in climate data through time-series visualizations of temperature, extreme weather events, and gas emissions. We want the user to understand what climate change is, the effects it has on our environment, and why there is no overnight solution for this pressing global issue.

Users should be able to query the relative impact that each contributor has produced by comparing GDP and HDI data against greenhouse emissions data for that country. Based on their observations, the user will be able to determine whether any correlation exists between these attributes and climate impact.

## Idioms

Our interface is fairly simple in design. Given that it incorporates scrollytelling, it is in the form of a single page of substantial height. The left-hand section of the page is reserved for the active visualization of each section of our narrative, while the right-hand section of the page contains the text content for that section. 

All visualizations use the same SVG element, and thus have the same dimensions and general styling principles. The only algorithms we used were those to preprocess the datasets and to handle the section boundary transitions as part of scrollytelling.

### Visualizations

#### Pie Chart - Climate Opinions

<center><img src="/images/pie.png" alt="pie" width="400" /></center>

The pie chart visualizes the percentage of individuals (according to Yale's 2021 Climate Opinion Map) who either believe or don't believe in climate change. We wanted for there to be a sharp contrast in color between the "Believes" and "Does Not Believe" slices of the pie chart, with the neutral slice being colored grey as a secondary focus.

This visualization has an interactive tooltip, where the percentage of a given slice will be displayed whenever the mouse cursor is within its region.

#### Line Chart - Extreme Weather Activity

<center><img src="/images/line.png" alt="line" width="400" /></center>

The line chart visualizes the frequency of extreme weather events (specifically ones resulting in tornados) in the United States between the years of 1955 to 2022. Due to the volatility in year-on-year frequency, we decided to overlay an average trend line in order to clearly indicate an increase in extreme weather activity over time.

#### Lollipop Chart - Top 20 CO2 Emissions

<center><img src="/images/lollipop.png" alt="lollipop" width="400" /> </center>

The lollipop chart visualizes the top 25 contributors to CO2 emissions per capita in 2020. We added an element of interactivity in the form of a tooltip displaying the annual emissions amount for that country. 

#### Choropleth - Total Emissions per Country

<center><img src="/images/choro.png" alt="choropleth" width="400" /> </center>

We used a choropleth to visualize the total emissions data of each country. The color of each country acts as a visual indicator for the scale of its total greenhouse emissions. We used a log scale to emphasize that some countries emit orders of magnitudes more greenhouse gases than others.

We added an interactive tooltip so that the user could see the quantity of gases released by each country (and compare them to one another).

#### Scatterplot - Human Development Index

<center><img src="/images/scatterplot.png" alt="scatterplot" width="400" /> </center>

A scatterplot was used to compare each country's Human Development Index (HDI) rating for the years of 1990, 2000, 2010, and 2020. Given the density in point distribution, we elected to keep all countries' data points colored the same (and slightly transparent) to increase readability. Additionally, we added an interactive tooltip to display the country name and accompanying HDI score for a given data point.

#### Innovative - CO2 Emissions & GDP

<center><img src="/images/inno1.png" alt="innovative 1" width="400" /></center>

The innovative view was split up into two layers. The first layer is a bubble chart plotting the GDP of a country against its population, with the size of each bubble being proportionate to the amount of CO2 emissions for that country. An interactive tooltip was added to display the country name, population, and CO2 emissions for the selected bubble.

<center><img src="/images/inno2.png" alt="innovative 2" width="400" /></center>

Clicking on a bubble activates the second layer, transitioning the selected bubble into an expanded pie chart showing the distribution of CO2 emission sources for that country in 2018. Hovering over a slice shows the amount of CO2 in metric tons emitted by that source.

## Data Description

### Dataset #1 - [HDI Index - Trends from 1990-2021](https://hdr.undp.org/data-center/documentation-and-downloads)

#### Preprocessing

The selected attributes we decided to use were the HDI indexes of each country for 1990, 2000, 2010, and 2020. The original dataset was provided in the form of an Excel sheet, so Raj manually converted the sheet to a CSV file and pruned the data to just be the desired attributes (Year, Country, and HDI index).

#### Selected Attributes (after preprocessing)
  
- `Country`
  - Type: **Categorical**
- `Year`
  - Type: **Ordinal, Sequential**
- `HDI`
  - Type: **Quantitative, Sequential**

Cardinality: **1:1 with each country, for each year**

### Dataset #2 - [NOAA Storm Events Database](https://www.ncdc.noaa.gov/stormevents/ftp.jsp)

#### Preprocessing

The dataset is provided in the form of separate files, each one corresponding to a year between 1955 to 2022. Given that we were only interested in the frequency of extreme weather events (regardless of type) over the years, Tucker manually aggregated the data to create an ingest CSV file containing the amount of tornado events per year from 1955 to 2022.

#### Selected Attributes (after preprocessing)
  
- `Year`
  - Type: **Ordinal, Sequential**
- `Number of Storms`
  - Type: **Ordinal, Sequential**

Cardinality: **1:1 for each extreme weather event, for each year**

### Dataset #3 - [Yale Climate Opinion Maps 2021](https://climatecommunication.yale.edu/visualizations-data/ycom-us/)

#### Selected Attributes
  
- `GeoName`
  - Type: **Categorical**
- `happening` 
  - Type: **Quantitative**
- `happeningOppose`
  - Type: **Quantitative**

- Cardinality: **1:1 for each location in the dataset**

### Dataset #4 - [CO2 Emissions per Capita & GDP per Capita](https://ourworldindata.org/grapher/co2-emissions-vs-gdp?time=1760..2021)

#### Selected Attributes
  
- `Entity`
  - Type: **Categorical**
- `Year` 
  - Type: **Ordinal, Sequential**
- `Annual CO2 emissions (per capita)`
  - Type: **Quantitative, Sequential**

- Cardinality: **1:1 for each location in the dataset**

### Dataset #5 - [CO2 Emissions by Source](https://github.com/owid/co2-data)

#### Selected Attributes
  
- `country`
  - Type: **Categorical**
- `year`
  - Type: **Ordinal, Sequential** 
- `population`
  - Type: **Quantitative, Sequential**
- `gdp`
  - Type: **Quantitative, Sequential**
- `coal_co2`
  - Type: **Quantitative, Sequential**
- `cement_co2`
  - Type: **Quantitative, Sequential**
- `gas_co2`
  - Type: **Quantitative, Sequential**
- `oil_co2`
  - Type: **Quantitative, Sequential**

- Cardinality: **1:1 for each location in the dataset**

## Reflection

Our project has evolved substantially from the original proposal given in mid-October. The first task listed was to finalize the story narrative, which meant nailing down a proper "flow" and ensuring that we had the proper data to create each visualization. As mentioned in our WIP report, we decided to shuffle around the original order to provide for a smoother narrative flow. 

The original goal for our project was to allow the user to analyze climate fluctuations presented in each visualization, primarily through consuming time-series data on temperature, weather events, and emissions to show the overall upwards trend. However, limitations found in our datasets (missing data points, incompatible data encoding, etc.) made us shift focus to the narrative aspect of climate change, using the visualizations as supporting tools rather than them being the main focus. Realistically, our original proposal was possible but not probable given the large dependency on publicly accessible data with only a limited period of time to actually work on the project.

Apart from the aforementioned narrative and visual changes, some of the unexpected challenges that arose had to do with the page formatting and the sudden loss of our fourth team member. For the page formatting, we kept seeing inconsistencies across our different devices (e.g. element sizes and placement). This issue was mitigated by taking advantage of Bootstrap to handle column layouts. As for the loss of our fourth team member, there was nothing that the rest of us could do other than try to pick up the work originally assigned to him. Due to limitations on manpower, we ultimately had to shelve some of our original ideas (such as transitions between visualizations and having more interactive visualizations).

The main thing we would do differently next time is to ensure that our narrative and visualizations are compatible with datasets available in the public domain. Climate change is a very popular issue, but not all countries make their information—especially "negative" things like emissions—readily accessible for anyone to download. This limited most of the comparison-based content we had planned.

## Project Workload

### Maxwell Calhoun

- Primarily responsible for the following visualization(s): lollipop, pie, & innovative
  - Assisted with implementations / tweaks with the other graphs
- Primarily responsible for the page design
- Assisted with the story narrative

### Raj Datta

- Primarily responsible for the following visualization(s): scatterplot
  - Assisted with implementations / tweaks with the other graphs
- Primarily responsible for the story narrative
- Assisted with the page design


### Tucker Prynn

- Primarily responsible for the following visualization(s): line chart & choropleth
  - Assisted with implementations / tweaks with the other graphs
- Assisted with the page design
- Assisted with the story narrative
