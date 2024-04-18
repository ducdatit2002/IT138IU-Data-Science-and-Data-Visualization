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
console.log('Your name : ' + name);

var dataArray = countFrequency(name);
console.log(dataArray);

function create_g(id, Frequency, x_coordinate) {
    var binHeight = rectHeight * Frequency / 100;

    var g = d3.create("g")
        .attr("id", id);

    var rect = g.append("rect")
        .attr("x", x_coordinate)
        .attr("y", rectHeight - binHeight)
        .attr("width", rectWidth)
        .attr("height", binHeight)
        .style("fill", "steelblue")
        .style("stroke", "black")
        .style("stroke-width", 1);

    var text = g.append("text")
        .attr("x", x_coordinate)
        .attr("y", 350)
        .attr("font-size", 15)
        .attr("fill", "blue")
        .text(id);

    return g.node();
}

function createHistogram() {
    var showSVG = d3.select("#chart");

    var svg = d3.create("svg")
        .attr("id", "histogram")
        .attr("height", 500)
        .attr("width", 450)
        .attr("viewBox", "0 0 450 500")
        .style("display", "block")
        .style("background-color", "white");

    svg.append("line")
        .attr("x1", 0)
        .attr("y1", rectHeight + 0)
        .attr("x2", 320)
        .attr("y2", rectHeight + 0)
        .style("stroke", "black")
        .style("stroke-width", 1);

    let totalCharacters = 0;
    dataArray.forEach((value, key, map) => totalCharacters += value == null ? 0 : value.length);
    console.log('total Characters: ' + totalCharacters);

    let x_coordinate = -rectWidth;

    dataArray.forEach((value, key, map) => {
        let Frequency = 0;

        if (value != null) {
            Frequency = Math.round((value.length * 100 / totalCharacters) * 100) / 100;
        }

        console.log("Percent Of " + key + " : " + Frequency + "%");

        x_coordinate += rectWidth;

        var g = create_g(key, Frequency, x_coordinate);
        svg.append(() => g);
    });

    showSVG.append(() => svg.node());
}

window.onload = createHistogram;