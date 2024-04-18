var rowConverter = function(d) {
    return {
        
        population : parseFloat (d.population),
        area : parseFloat(d.area),
        density : parseFloat(d.density),
        GRDP : parseFloat(d["GRDP-VND"])
    };
  
  }
  d3.csv("https://tungth.github.io/data/vn-provinces-data.csv", rowConverter, function(error, data) {
    if (error) {
    console.log(error);
    }
    else {
        console.log(data);
        
        var margin = {top: 0, right: 20, bottom: 20, left: 20},
        w = 600 - margin.left - margin.right,
        h = 300 - margin.top - margin.bottom;
       var padding = 20;
  
            var Scalepopulation = d3.scaleLinear()
           .domain([ 0, d3.max(data, function (d) {return d.population})] )
            .range([padding,w-padding*2])
     
                                
            var ScaleGRDP    = d3.scaleLinear()
             .domain ([ 0, d3.max(data, function (d) {return d.GRDP})])
            .range([h-padding, padding])
     
             var rScale= d3.scaleLinear()
           .domain ([ d3.min(data, function (d) {return d.area}), d3.max(data, function (d) {return d.area})])
            .range([3,8])
  
            var colorScale = d3.scaleSequential()
            .domain([d3.min(data, function (d) {return d.density}),d3.max(data, function (d) {return d.density})])
            .interpolator(d3.interpolateCool);
                            
          var svg = d3.select("#scatterplot")
          .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
            d3.max(data, function (d) {return d.density})
   //x-axis
  
  
         var x_axis = d3.axisBottom()
         .scale(Scalepopulation);
         var xAxisTranslate = h-20;
         svg.append("g")
                 .attr("transform", "translate(15, " + xAxisTranslate  +")")
                 .call(x_axis)
  
  //y-axis
          
         var y_axis = d3.axisLeft()
             .scale(ScaleGRDP);
          var yAxisTranslate = 0;
           svg.append("g")
         .attr("transform", "translate(35, " + yAxisTranslate  +")")
         .call(y_axis);
  
  // name of X-axis :
      svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", w-250)
            .attr("y", h + margin.top + 20)
           .text(" POPULATION")
            .attr("fill","green");
            
  
  // name of Y-axis :
        svg.append("text")
          .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
            .attr("x", -margin.top-80)
            .text("GRDP-VND")
            .attr("fill","green");
  
  // Scatterplot
      svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return Scalepopulation(d.population);
                })
                .attr("cy", function(d) {
                  return ScaleGRDP(d.GRDP);
                })
                
                .attr("r", function(d){
                  return rScale(d.area);
                })
  
  // color  based on density
               .style("fill", function(d, i ) { return colorScale(d.density); })
  
  
  
                svg.selectAll("text")
                .data(data)
                 .enter()
                .append("text")
                .text(function(d){
                    return d.area;
                })
                .attr("x", function(d){
                    return Scalepopulation(d.population);
                })
                .attr("y", function(d){
                  return ScaleGRDP(d.GRDP);
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "7px") 
                .attr("fill","red")
  
  
  
  
                  }})
  
              
                      
                      