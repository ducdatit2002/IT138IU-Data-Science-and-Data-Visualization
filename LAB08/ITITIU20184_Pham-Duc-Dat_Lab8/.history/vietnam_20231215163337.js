      
 var width = 1500;
 var height = 1500;

//Define map projection
var projection = d3.geoAlbers()
.center([100,4.4])
.rotate([2,32])
.parallels([11,20])
             .translate([width/38, height/2])
             .scale([3000]);

var path = d3.geoPath()
         .projection(projection);

var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

d3.csv("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces-data.csv", function(data) {
 
   console.log(data)
   var colorScheme = d3.schemeReds[6];
   colorScheme.unshift("#eee")
   var color= d3.scaleThreshold()
       
       .range(colorScheme);
   
  color.domain([
    d3.min(data, function(d) { return d.population; }), 
    d3.max(data, function(d) { return d.population; })
  ]);
  
  d3.json("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json", function(json) {
    
    for (var i = 0; i < data.length; i++) {
      var dataCountry = data[i].ma;
      var dataPop = parseFloat(data[i].population);
      console.log(json.features[0].properties.Ma);
      for (var j = 0; j < json.features.length; j++) {
        var jsonCountry = json.features[j].properties.Ma;
        if (parseFloat(dataCountry) == parseFloat(jsonCountry)) {
          json.features[j].properties.population = dataPop;
          break;
        }
      }		
    }  

    svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .style("fill", function(d) {
           var value = d.properties.population;
           if (value) {
          
             return color(value);
           } else {
           
             return "#ccc";
           }
       })
       .attr("d", d3.geoPath().projection(projection))
       .attr("stroke", "red");

  });
 
 
  
});