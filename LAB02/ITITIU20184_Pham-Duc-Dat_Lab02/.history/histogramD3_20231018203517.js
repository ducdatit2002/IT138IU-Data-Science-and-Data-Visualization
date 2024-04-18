const rectHeight = 300;
const rectWidth = 50;

function countFrequency(name) {
    let regexMap = new Map([
        ['[A - D]', /[A-D]/g],
        ['[E - H]', /[E-H]/g],
        ['[I - L]', /[I-L]/g],
        ['[M - P]', /[M-P]/g],
        ['[Q - U]', /[Q-U]/g],
        ['[V - Z]', /[V-Z]/g]
    ]);

    let dataArray = new Map();
    regexMap.forEach((value, key, map) => dataArray.set(key, name.match(value)));

    return dataArray;
}

var name = "Pham Duc Dat";
name = name.toUpperCase();
console.log('Your name: ' + name);

var dataArray = countFrequency(name);
console.log(dataArray);

function createHistogram() {
    var totalCharacters = 0;
    dataArray.forEach((value, key, map) => totalCharacters += value == null ? 0 : value.length);
    console.log('Total Characters: ' + totalCharacters);

    var xScale = d3.scaleLinear()
        .domain([0, dataArray.size - 1])
        .range([0, rectWidth * dataArray.size]);

    var svg = d3.select("#chart")
        .append("svg")
        .attr("id", "histogram")
        .attr("height", 500)
        .attr("width", 450)
        .style("background-color", "white");

    svg.append("line")
        .attr("x1", 0)
        .attr("y1", rectHeight)
        .attr("x2", xScale(dataArray.size - 1) + rectWidth)
        .attr("y2", rectHeight)
        .style("stroke", "black")
        .style("stroke-width", 1);

    var x_coordinate = 0;

    dataArray.forEach((value, key, map) => {
        var Frequency = 0;

        if (value != null) {
            Frequency = Math.round((value.length * 100 / totalCharacters) * 100) / 100;
        }

        console.log("Percent Of " + key + " : " + Frequency + "%");

        var g = svg.append("g")
            .attr("transform", "translate(" + x_coordinate + "," + (rectHeight - rectHeight * Frequency / 100) + ")");

        g.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight * Frequency / 100)
            .style("fill", "steelblue")
            .style("stroke", "black")
            .style("stroke-width", 1);

        g.append("text")
            .attr("x", rectWidth / 2)
            .attr("y", 350)
            .attr("font-size", 15)
            .attr("fill", "blue")
            .text(key);

        x_coordinate += rectWidth;
    });
}

window.onload = createHistogram();
