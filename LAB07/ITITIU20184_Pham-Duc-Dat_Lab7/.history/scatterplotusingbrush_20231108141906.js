var rowConverter = function(d) {
    return { 
        case : parseInt(d["4/5/20"]),
        country:d["Province/State"]+ " " +  d["Country/Region"],
        long: parseFloat(d.Long),
        lat: parseFloat(d.Lat)
    };
  }
  d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv", rowConverter, function(error, data) {
    if (error) {
    console.log(error);
    }
    else {
        console.log(data);   
       newdata=data
       console.log(newdata);
        var margin = {top: 20, right: 20, bottom: 20, left: 40},
        w = 1024 - margin.left - margin.right,
        h = 600 - margin.top - margin.bottom;
       var padding = 20;

            var Scalelong = d3.scaleLinear()
           .domain([ d3.min(newdata, function (d) {return d.long}) -20, d3.max(newdata, function (d) {return d.long})] )
            .range([padding,w-padding*2])
                                
            var Scalelat    = d3.scaleLinear()
             .domain ([ d3.min(newdata, function (d) {return d.lat}), d3.max(newdata, function (d) {return d.lat})])
            .range([h-padding, padding])
     
             var rScale= d3.scaleLinear()
           .domain ([ d3.min(newdata, function (d) {return d.case}), d3.max(newdata, function (d) {return d.case})])
            .range([5,50])
           
            var svg = d3.select("#scatterplot2")
            .append("svg")
            .attr("data-margin-right", margin.right)
            .attr("data-margin-left", margin.left)
            .attr("data-margin-top", margin.top)
            .attr("data-margin-bottom", margin.bottom)
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var x_axis = d3.axisBottom()
          .scale(Scalelong);
          var xAxisTranslate = h-20;
          svg.append("g")
                  .attr("transform", "translate(15, " + xAxisTranslate  +")")
                  .call(x_axis)
          
          var y_axis = d3.axisLeft()
              .scale(Scalelat);
          var yAxisTranslate = 0;
            svg.append("g")
          .attr("transform", "translate(35, " + yAxisTranslate  +")")
          .call(y_axis);

          // name of X-axis :
          svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", w-250)
            .attr("y", h + margin.top + 0)
            .text(" LONGITUDE ")
            .attr("fill","green");
            

          // name of Y-axis :
          svg.append("text")
          .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
          .attr("y", -margin.left+20)
            .attr("x", -margin.top-80)
            .text("LATITUDE")
            .attr("fill","green");

  
  // Scatterplot
      svg.selectAll("circle")
                .data(newdata)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return Scalelong(d.long);
                })
                .attr("cy", function(d) {
                  return Scalelat(d.lat)  ;
                })
                .attr("r", function(d){
                  return rScale(d.case);
                })
               //.style("fill", "steelblue" )      
               .style("opacity", 0.7)      
               .style("stroke", "red")    
               .style("fill", "blue")
               
              

//BRUSH 
              svg.append("g")
              .call(d3.brush()
              .extent([[0, 0], [w, h]])
              .on("brush", brushed)
              .on("end", brushended));
        
        
            function brushed() {
                var s = d3.event.selection,
                    x0 = s[0][0],
                    y0 = s[0][1],
                    dx = s[1][0] - x0,
                    dy = s[1][1] - y0;
                 console.log(s);
       
                svg.selectAll('circle')
                    .style("fill", function (d) {
          // in selection area if confirmed case < 0 also return blue  
                        if (Scalelong(d.long) >= x0 && Scalelong(d.long) <= x0 + dx && Scalelat(d.lat) >= y0 && Scalelat(d.lat) <= y0 + dy && d.case >0)
                            { return "red"; }
                        else { return "blue"; }
                       
                    });
            }
        
            

            function brushended() {
                if (!d3.event.selection) {
                    svg.selectAll('circle')
                      .transition()
                      .duration(150)
                      .ease(d3.easeLinear)
                      .style("fill", "blue");
                }
        }

                  }})
  
              
                      
                      