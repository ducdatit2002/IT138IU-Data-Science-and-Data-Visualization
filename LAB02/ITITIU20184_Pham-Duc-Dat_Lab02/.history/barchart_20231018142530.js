var data = [5,5,10,4,12,5,7,6,9,9,13,16,19,14,15,7,13,18,19,6]; 
    
console.log(data);

var width = 500;
var height = 200;
//var addpixel = 50;
var barPadding = 1;
var bordercolor = "white";


var svg = d3.select("#barchart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("stroke", bordercolor)
           

var bars = svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("y", function(d) {
                return height - d*6;  })
              
            .attr("x",function(d, i) {
                return i * (width / data.length);   })
            .attr("width", width/ data.length - barPadding)
             .attr("height",function(d) {
                return d*6; })
            .attr("fill", function(d) {
                    return "rgb(0, 128, " + Math.round(d * 5) + ")";
                   });
var lable= svg.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d;
                    })
                
                .attr("x",function(d, i) { return i * (width / data.length) + (width / data.length - barPadding) / 2;
            })
                .attr("y", function(d) {
                            return height - (d * 4) + 14; 
                            })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "white")
                .attr("text-anchor", "middle");


        
                
               
               


         
 

