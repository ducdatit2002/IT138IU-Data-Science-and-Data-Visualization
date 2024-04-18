        // Define rowConverter function if not already defined
        function rowConverter(row) {
          return {
              name: row.name,
              GDP: parseFloat(row.GDP)
          };
      }

      // Load data and initialize the chart
      let data;
      d3.csv("https://tungth.github.io/data/vn-provinces-data.csv", rowConverter)
          .then((error, csvData) => {
              if (error) {
                  console.log(error);
              } else {
                  data = csvData;
                  initializeChart();
              }
          });

      function initializeChart() {
          const width = 600;
          const height = 400;

          const svg = d3.select("#chart").append("svg")
              .attr("width", width)
              .attr("height", height);

          // Define a scale for GDP
          const xScale = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.GDP)])
              .range([0, width]);

          // Create bars
          const bars = svg.selectAll("rect")
              .data(data.slice(0, 20))
              .enter()
              .append("rect")
              .attr("x", 0)
              .attr("y", (d, i) => i * 25)
              .attr("width", d => xScale(d.GDP))
              .attr("height", 20)
              .attr("fill", "steelblue");

          // Add data labels to the right of bars
          svg.selectAll("text")
              .data(data.slice(0, 20))
              .enter()
              .append("text")
              .text(d => d.GDP)
              .attr("x", d => xScale(d.GDP) + 5)
              .attr("y", (d, i) => i * 25 + 15)
              .attr("alignment-baseline", "middle");

          // Create Axis
          const xAxis = d3.axisBottom(xScale);
          svg.append("g")
              .attr("class", "x-axis")
              .attr("transform", `translate(0, ${height})`)
              .call(xAxis);

          // Label the axis
          svg.append("text")
              .attr("x", width / 2)
              .attr("y", height + 40)
              .attr("text-anchor", "middle")
              .text("GDP");
      }

      // Add Province Button Click Event
      d3.select("#add-province").on("click", function () {
          // Simulate adding a new province for demonstration
          const newProvince = {
              name: "New Province",
              GDP: Math.random() * 1000
          };

          data.push(newProvince);
          updateChartWithAnimation();
      });

      // Remove Province Button Click Event
      d3.select("#remove-province").on("click", function () {
          data.pop();
          updateChartWithAnimation();
      });

      // Sorting Combo Box
      d3.select("#sort-select").on("change", function () {
          const criterion = d3.select(this).property("value");
          data = data.sort((a, b) => {
              if (criterion === "name") {
                  return a.name.localeCompare(b.name);
              } else {
                  return b.GDP - a.GDP;
              }
          });

          updateChartWithAnimation();
      });

      function updateChartWithAnimation() {
          // Update the chart with transitions and animations
          const svg = d3.select("#chart").select("svg");

          const xScale = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.GDP)])
              .range([0, 600]);

          const bars = svg.selectAll("rect")
              .data(data.slice(0, 20));

          bars.transition()
              .duration(1000)
              .attr("width", d => xScale(d.GDP));

          const labels = svg.selectAll("text")
              .data(data.slice(0, 20));

          labels.transition()
              .duration(1000)
              .attr("x", d => xScale(d.GDP) + 5);

          const xAxis = d3.axisBottom(xScale);

          svg.select(".x-axis")
              .transition()
              .duration(1000)
              .call(xAxis);
      }