        //Width and height of map
        var width = 1000;
        var height = 1000;

        var zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([
                [0, 0],
                [width, height]
            ])
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("zoom", zoomed);


        //Create SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom)
        var g = svg.append("g");

        //Define map projection
        var projection = d3.geoAlbers()
            .center([100, 4.4])
            .rotate([2, 32])
            .parallels([11, 20])
            .scale([2000])
            .translate([width / 30, height / 1.8]);

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);

        //Define color scale
        var colorScale = d3.scaleQuantize()
            .range(["rgb(185, 222, 255)", "rgb(185, 194, 255)", "rgb(196, 185, 255)", "rgb(209, 185, 255)"]);

        // Define the div for the tooltip
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //Load in data
        d3.csv("covid19_province.", function(data) {

            //Set domain for color scale
            colorScale.domain([
                d3.min(data, function(d) {return d.Confirm;}),
                d3.max(data, function(d) {return d.Confirm;})
            ]);


            //Load GeoJSON data and merge with provinces data
            d3.json("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json", function(json) {

                //Loop through each province data cases in the .csv file
                for (var i = 0; i < data.length; i++) {

                    //Grab data province 
                    var dataProvince = parseFloat(data[i].ma);
                    console.log(json.features[0].properties.Ma);

                    //Grab data cases
                    var dataC = data[i].Confirm;

                    //Find the corresponding province inside the GeoJSON
                    for (var j = 0; j < json.features.length; j++) {

                        var jsonProvince = json.features[j].properties.Ma;

                        if (dataProvince == jsonProvince) {

                            //Copy the data cases into the JSON
                            json.features[j].properties.cases = dataC;

                            //Stop looking through the JSON
                            break;
                        }
                    }

                    //Loop to get province name
                    //Grab province name
                    var dataName = data[i].Province;

                    //Find the corresponding province inside the GeoJSON
                    for (var k = 0; k < json.features.length; k++) {

                        var jsonProvince = json.features[k].properties.Ma;

                        if (dataProvince == jsonProvince) {

                            //Copy the data cases into the JSON
                            json.features[k].properties.province = dataName;

                            //Stop looking through the JSON
                            break;
                        }
                    }
                }

                //Bind data to the SVG and create one path per GeoJSON feature
                var map = g.selectAll("path")
                    .data(json.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .style("fill", function(d) {
                        var value = d.properties.cases;
                        if (value > 0) {
                            return colorScale(value);
                        } else {
                            return "#ccc";
                        }
                    })
                    .on("mouseover", function(d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("opacity", 1)
                            .style("stroke", "black")
                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0.9)
                            .style("stroke", "black")
                        tooltip.html(d.province);
                    })
                    .on("mousemove", function(d) {
                        tooltip
                            .style("top", (d3.event.pageY) + "px")
                            .style("left", (d3.event.pageX + 10) + "px")

                        tooltip.html(d.properties.province.bold() + " <br>Cases: " + d.properties.cases.bold());
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("stroke", "transparent")
                        tooltip
                            .transition()
                            .duration(200)
                            .style("opacity", 0);
                    });

            });

        });

        function zoomed() {
            g
                .selectAll('path') // To prevent stroke width from scaling
                .attr('transform', d3.event.transform);
        }