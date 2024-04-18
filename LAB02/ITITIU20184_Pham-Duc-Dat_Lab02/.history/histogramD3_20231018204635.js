function countFreQ(string) {
    const freq = new Array(6).fill(0);
    const token = ['D', 'H', 'L', 'P', 'U', 'Z'];
    string.toUpperCase().split("").forEach(element => {
        for (var i = 0; i < 6; i++) {
            if (element <= token[i]) {
                freq[i]++;
                return;
            }
        }
    });
    return freq;
}

var data = countFreQ("Tung");
console.log(data);

var width = 300;
var height = 50;
var addpixel = 50;
var bordercolor = "black";

var min = d3.min(data);
var max = d3.max(data);

var widthScale = d3.scaleLinear()
    .domain([min, max])
    .range([0, width]);

var colorBar = d3.scaleLinear()
    .domain([min, max])
    .range(["steelblue", "steelblue"]);

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("stroke", bordercolor)
    .attr('transform', 'rotate(270 250 300) ');

var bars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", function (d) {
        return d * addpixel
    })
    .attr("height", 50)
    .attr("y", function (d, i) {
        return (height - (6 * 50)) + (i * 50);
    })
    .style("fill", function (d) {
        return colorBar(d);
    });