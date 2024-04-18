d3.csv("https://tungth.github.io/data/vn-provinces-data.csv").then(function(data) {
  // Extract the required data for the chart
  var provinceData = data.slice(0, 20).map(function(d) {
    return {
      province: d.province,
      grdp: parseFloat(d["GRDP-VND"].replace(",", ""))
    };
  });

  // Set up the chart dimensions
  var chartWidth = 600;
  var chartHeight = 400;
  var barHeight = 30;
  var chartMargin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 120
  };

  // Create the SVG container
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", chartWidth + chartMargin.left + chartMargin.right)
    .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

  // Create the X scale
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(provinceData, function(d) { return d.grdp; })])
    .range([0, chartWidth]);

  // Create the Y scale
  var yScale = d3.scaleBand()
    .domain(provinceData.map(function(d) { return d.province; }))
    .range([0, chartHeight])
    .padding(0.1);

  // Create the bars
  svg.selectAll(".bar")
    .data(provinceData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill","#0099FF")
    .attr("width", function(d) { return xScale(d.grdp); })
    .attr("height", yScale.bandwidth())
    .attr("y", function(d) { return yScale(d.province); });

  // Add labels for data on the right of the bars
  svg.selectAll(".label")
    .data(provinceData)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", function(d) { return xScale(d.grdp) + 10; })
    .attr("y", function(d) { return yScale(d.province) + yScale.bandwidth() / 2; })
    .attr("dy", "0.35em")
    .text(function(d) { return d.grdp.toLocaleString(); });

  // Add X axis
  svg.append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(xScale));

  // Add Y axis
  svg.append("g")
    .call(d3.axisLeft(yScale));
});

// Function to update the chart with new province data
function updateChart(newProvinceData) {
  // Update the domain of X scale with the new data
  xScale.domain([0, d3.max(newProvinceData, function(d) { return d.grdp; })]);

  // Update the domain of Y scale with the new data
  yScale.domain(newProvinceData.map(function(d) { return d.province; }));

  // Update the bars
  var bars = svg.selectAll(".bar")
    .data(newProvinceData);

  // Remove excess bars with a transition
  bars.exit()
    .transition()
    .duration(500)
    .attr("width", 0)
    .remove();

  // Update existing bars with a transition
  bars.transition()
    .duration(500)
    .attr("width", function(d) { return xScale(d.grdp); })
    .attr("height", yScale.bandwidth())
    .attr("y", function(d) { return yScale(d.province); });

  // Add new bars with a transition
  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", 0)
    .transition()
    .duration(500)
    .attr("width", function(d) { return xScale(d.grdp); })
    .attr("height", yScale.bandwidth())
    .attr("y", function(d) { return yScale(d.province); });

  // Update the X axis with a transition
  svg.select(".x-axis")
    .transition()
    .duration(500)
    .call(d3.axisBottom(xScale));

  // Update the Y axis with a transition
  svg.select(".y-axis")
    .transition()
    .duration(500)
    .call(d3.axisLeft(yScale));
}

// Add button to remove the last province
d3.select("body")
  .append("button")
  .text("Remove Last Province")
  .on("click", function() {
    // Remove the last province from the data
    provinceData.pop();

    // Update the chart with the modified data
    updateChart(provinceData);
  });

// Add button to add a new random province
d3.select("body")
  .append("button")
  .text("Add Random Province")
  .on("click", function() {
    // Generate a random index to select a new province from the data
    var randomIndex = Math.floor(Math.random() * data.length);
    var newProvince = data[randomIndex];
    
    // Create an object for the new province data
    var newProvinceData = {
      province: newProvince.province,
      grdp: parseFloat(newProvince["GRDP-VND"].replace(",", ""))
    };

    // Add the new province data to the chart
    provinceData.push(newProvinceData);
    updateChart(provinceData);
  });

// Add combo box to select sorting criterion
var select = d3.select("body")
  .append("select")
  .on("change", function() {
    // Get the selected sorting criterion
    var sortingCriterion = d3.select(this).property("value");

    // Sort the province data based on the selected criterion
    provinceData.sort(function(a, b) {
      if (sortingCriterion === "province") {
        return d3.ascending(a.province, b.province);
      } else if (sortingCriterion === "grdp") {
        return d3.descending(a.grdp, b.grdp);
      }
    });

    // Update the chart with the sorted data
    updateChart(provinceData);
  });

// Add options to the combo box
select.append("option")
  .attr("value", "province")
  .text("Sort by Province");

select.append("option")
  .attr("value", "grdp")
  .text("Sort by GRDP");

// Set the initial sorting criterion to "province"
select.property("value", "province");

// Load the initial chart
updateChart(provinceData);