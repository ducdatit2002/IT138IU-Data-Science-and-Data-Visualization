d3.csv("https://tungth.github.io/data/vn-provinces-data.csv")
  .then((data) => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      data[i]['GRDP-VND'] = parseInt(data[i]['GRDP-VND'], 10);
    }
    database = data
    draw()
  })

var size = 20
const margin = { top: 20, right: 100, bottom: 40, left: 100 },
  w = 800 - margin.left - margin.right,
  h = 600 - margin.top - margin.bottom;
var x, y, xAxis, yAxis, data
var svg, rect, text

function draw() {
  data = database.filter((d, i) => {
    if (i < size)
      return d;
  })
  svg = d3.select("#barchart")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  x = d3.scaleLinear()
    .range([0, w])
  xAxis = svg.append("g")
    .attr("transform", `translate(0, ${h})`)
  y = d3.scaleBand()
    .range([0, h])
    .padding(.1)
  yAxis = svg.append("g")

  rect = svg.append("g")
  text = svg.append("g")

  d3.selectAll("button#add")
    .on("click", function () {
      size++
      size = Math.min(63, size)
      data = database.filter((d, i) => {
        if (i < size)
          return d;
      })
      update()
    })
  d3.selectAll("button#remove")
    .on("click", function () {
      size--
      size = Math.max(1, size)
      data = database.filter((d, i) => {
        if (i < size)
          return d;
      })
      update()
    })

  d3.select("#sort-select").on("change", function () {
    let criterion = d3.select("#sort-select").node().value;
    console.log(criterion)
    data = data.sort(function (a, b) {
      switch (criterion) {
        case "name":
          if (a["province"] < b["province"])
            return -1;
          else if (a["province"] > b["province"])
            return 1;
          else return 0;
        case "GDP":
          return b['GRDP-VND'] - a['GRDP-VND'];
      }
    })

    update()
  })
  // For chart title
  svg.append("text")
    .attr("x", w / 2)
    .attr("y", 0 - (margin.top / 5))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("text-decoration", "none")
    .text("Horizontal Bar Chart of GRDP in VND by province");
  // For x-axis label
  svg.append("text")
    .attr("transform", `translate(${w / 2} ,${h + margin.top + 20})`)
    .style("text-anchor", "middle")
    .text("GRDP in VND");

  // For y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (h / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Sorted by GRDP in VND");
  update()
}
function update() {
  x.domain([0, d3.max(data, d => d['GRDP-VND'])])
  xAxis.transition().duration(100).call(d3.axisBottom(x).ticks(5))

  y.domain(data.map(d => d["province"]))
  yAxis.transition().duration(100).call(d3.axisLeft(y))

  // Define color scale here
  var color = d3.scaleSequential()
    .interpolator(d3.interpolateRgbBasis(["#DA0C81", "#940B92", "#610C9F"]))
    .domain([0, d3.max(data, d => d['GRDP-VND'])]);

  rect
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", x(0))
    .attr("y", d => y(d["province"]))
    .attr("width", d => x(d['GRDP-VND']))
    .attr("height", y.bandwidth())
    .attr("fill", d => color(d['GRDP-VND'])) // use color scale here
    .transition()
    .duration(100)
    .on("start", function () { d3.select(this).attr("fill", "orange"); }) // highlight start of transition
    .attr("width", d => x(d['GRDP-VND']))
    .on("end", function () { d3.select(this).attr("fill", d => color(d['GRDP-VND'])); }); // revert color at end of transition

  text
    .selectAll(".province")
    .data(data)
    .join("text")
    .attr("class", "province")
    .transition()
    .duration(100)
    .attr("x", d => x(d['GRDP-VND']) + 5) // move to the right
    .attr("y", (d, i) => y(d["province"]) + y.bandwidth() / 2)
    .attr("fill", "black")
    .text(d => d["province"]);
  yAxis.transition().duration(100).call(d3.axisLeft(y).tickFormat((d, i) => parseFloat(data[i]['GRDP-VND']).toFixed(2)));



}

