const rectHeight = 300;
const rectWidth = 50;



function countFrequency(name) {
    // Regular expression 
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


var name = "Tung";
name = name.toUpperCase();
console.log('Your name : ' + name);

var dataArray = countFrequency(name);
console.log(dataArray);


function createSVGElement(name, attrs) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", name);

    if (attrs === undefined) attrs = {};
    for (var key in attrs) {
        element.setAttributeNS(null, key, attrs[key]);
    }
    return element;
}



function create_g(id, Frequency, x_coordinate) {

    
    var binHeight =  rectHeight* Frequency/100; 

    var g = createSVGElement('g', {
        id: id 
    });
    var Rect = createSVGElement('rect', {
        x: x_coordinate,
        y: rectHeight - binHeight,
        width: rectWidth,
        height: binHeight,
        style: "fill:steelblue;stroke:black;stroke-width:1"
    });
    var Text = createSVGElement('text', {
        x: x_coordinate,
        y: 350,
        'font-size': 15,
        fill: "blue"
    });
  
    Text.innerHTML = id; 
    
    g.appendChild(Text);  
    g.appendChild(Rect); 
    return g;
}


function createHistogram() {
   
    var ShowSVG = document.getElementById("chart"); 

    var SVG = createSVGElement('svg', {
        id: "histogram",
        height: 500,
        width: 450,
        viewBox: "0 0 450 500",
        style: "display:block; background-color: white;  "
    });

    var Line = createSVGElement('line', {
        x1: 0, 
        y1: rectHeight + 25, 
        x2: 320,
        y2: rectHeight + 25,
        style: "stroke:black;stroke-width:1"
    });


   
    let totalCharacters = 0;
    dataArray.forEach((value, key, map) => totalCharacters += value == null ? 0 : value.length);
    console.log('tolal Characters: ' + totalCharacters);

    let x_coordinate = -rectWidth; 

    dataArray.forEach((value, key, map) => {

       
        let Frequency = 0;

        
        if (value != null) {
            
            Frequency = Math.round((value.length * 100 / totalCharacters) * 100) / 100;
        }

        console.log("Percent Of " + key + " : " + Frequency + "%");

        x_coordinate += rectWidth;

        var g = create_g(key, Frequency, x_coordinate); 
        SVG.appendChild(g); 
    });

    SVG.appendChild(Line);
    ShowSVG.appendChild(SVG); 
}


window.onload = createHistogram();