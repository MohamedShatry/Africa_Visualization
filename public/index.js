
//Width and height
  var w = 1400;
  var h = 700;

  var plot = d3.select("#jumbotron")
                .append("svg")
                .attr("width", 700)
                .attr("height", 400)
                .attr("transform", "translate(80,0)");

  d3.select(".close").on("click", function(){
    plot.selectAll("*").remove();
    d3.select(".jumbotron").style("visibility", "hidden");
    d3.selectAll(".blur").style("filter", "none").style("pointer-events", "all");
    d3.select("input#line_graph").property("checked", "true");
  })

  var plotsDrawer = function (data){
    var data_global = data;
    var donutPlot = function(data_global){
      var agriculture = Math.round(data.agriculture);
      var industry = Math.round(data.industry);
      var services = Math.round(data.services);
      color_code = ["green", "#549aab", "#f1802d"];
      tags = ["Agriculture", "Industry", "Services"];
      var working_data = [agriculture, industry, services];


      var outerRadius = 350/2;
      var innerRadius = 180/2;

      var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
      var outerArc = d3.arc()
                        .innerRadius(outerRadius * 1.2)
                        .outerRadius(outerRadius * 1.2)

      var pie = d3.pie()
                  .padAngle(.02);

      var arcs = plot.selectAll("g")
                    .data(pie(working_data))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate("+ 250 + ","+ 220 +")");

      arcs.append("path")
          .attr("fill", function (d,i){
            return color_code[i];
          })
          .attr("d", arc);

      arcs.append("text")
          .text(function(d,i){
            return tags[i];
          })
          .attr("x", "250")
          .attr("y", function(d,i){
            return -40 + (i*40) + 5;
          })
          .attr("font-size","1.2em")
          .style("font-family", "sans-serif");

      arcs.append("rect")
          .attr("x", "220")
          .attr("y", function(d,i){
            return -50 + (i*40);
          })
          .attr("width", "20")
          .attr("height", "20")
          .style("fill", function(d,i){
            return color_code[i];
          });

      arcs.append("text")
          .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .text(function(d,i) {
            return `${working_data[i]}%`;
          })
          .style("fill", "white");

      arcs.append("text")
        .text(`${data.name}'s GDP contribution by sector`)
        .attr("class", "heading")
        .attr("x", "-100")
        .attr("font-size","1.2em")
        .style("font-family", "sans-serif")
        .attr("y", "-200");

    }
    var linePlot = function(dataset){
      var dataset = data.plot_data;

      var innerWidth = 500
      var innerHeight = 300;

      var xScale = d3.scaleLinear()
                      .domain([2010,2018])
                      .range([0, innerWidth])
                      .nice();

      var yScale = d3.scaleLinear()
                      .domain([(d3.min(dataset, function(d){ return d[1]}) - 400), d3.max(dataset, function(d){ return d[1]}) + 500])
                      .range([innerHeight, 0]);

      var line = d3.line()
                    .x(function(d) { return xScale(d[0])})
                    .y(function(d) { return yScale(d[1])});

      var g = plot.append("g")
                  .attr("transform", "translate(80,50)");

      var xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));

      g.append("g")
          .call(d3.axisLeft(yScale));

      g.append("g")
          .call(xAxis)
          .attr("transform", "translate(0,"+ (innerHeight)  + ")");

      g.append("path")
          .datum(dataset)
          .attr("d", line)
          .attr("class", "lines");

      g.selectAll("circle")
          .data(dataset)
          .enter()
          .append("circle")
          .attr("cx", function(d) {return xScale(d[0])})
          .attr("cy", function(d) {return yScale(d[1])})
          .attr("r", "4")
          .style("fill", "steelblue")
          .attr("stroke", "white")
          .append("title")
          .text(function(d) {return `${d[1]}`});

      g.append("text")
        .text(`GDP Per Capita (PPP) of ${data.name} over the last 10 years`)
        .attr("class", "heading")
        .attr("x", "80")
        .attr("font-size","1em")
        .style("font-family", "sans-serif")
        .attr("y", "-30");

      g.append("text")
        .text(`Year`)
        .attr("class", "xlabel")
        .attr("x", `${innerWidth/2}`)
        .attr("font-size","15px")
        .attr("y", `${innerHeight + 40}`)
        .style("fill", "#586271");

      g.append("text")
        .text(`GDP Per Capita in Dollars`)
        .attr("class", "xlabel")
        .attr("x", "-250")
        .attr("font-size","15px")
        .attr("y", "-50")
        .attr("transform", "rotate(-90)")
        .style("fill", "#586271");

    }

    linePlot(data_global);

    d3.selectAll("#jumbotron input").on("change", function (data){
          plot.selectAll("*").remove();
          var value = this.value;
          if (value == "line_graph"){
            linePlot(data_global);
          }else if (value == "donut_chart"){
            donutPlot(data_global);
          }
        });

  };

  var svg = d3.select("#canvas")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

  var color, number;

  var trim = function(x) {
    var temp = x;
    temp = temp.replace(/ +/g, "");
    return temp.replace("'","");
  }

  d3.csv("Africa_data.csv", function(data){

    data.forEach(function(d){
      d.gdp = parseFloat(d.gdp.replace(/,/g, ''));
      d.hdi = +d.hdi;
      d.year = +d.year;
      d.gdp_agriculture = +d.gdp_agriculture;
      d.gdp_industry = +d.gdp_industry;
      d.gdp_services = +d.gdp_services;
      d.gdp_growth = +d.gdp_growth;
      d.Long = parseFloat(d.long);
      d.Lat = parseFloat(d.lat);
    });

    var colors = [["rgb(3,104,174)", "rgb(6,104,172)", "rgb(52,143,192)", "rgb(86,181,214)", "rgb(118,196,174)", "rgb(158,230,193)", "rgb(199,232,187)", "rgb(212,239,217)"],
                  ["rgb(7,249,0)", "rgb(211,255,0)", "rgb(253,255,3)", "rgb(255,210,20)", "rgb(255,168,59)", "rgb(255,132,48)", "rgb(167,0,0)", "rgb(255,2,0)"/* "rgb(167,0,0)"*/]];
    var numbers = [[20000,10000,8000,6000,4000,2000,1000,0], [0.75,0.70,0.65,0.60,0.55,0.5,0.45,0.4,0]];
    color = colors[0];
    number = numbers[0];


    d3.json("africa_countries.json", function(json){
      var parseDate = d3.timeParse("%Y");

      for(var i = 8; i < data.length; i = i + 9){
        var dataCountry = data[i]["Country.Name"];
        var gdp = data[i].gdp;
        var hdi = data[i].hdi;
        var plot_data = [];
        var start = i - 8;
        var end = i + 1;
        var counter = 0;
        for (var j = start; j < end; j++){
          plot_data[counter] = [data[j].year, data[j].gdp];
          counter++
        }
        for (var j = 0; j < json.features.length; j++) {
          var jsonCountry = json.features[j].properties.name;
          if (dataCountry == jsonCountry) {
            json.features[j].properties.gdp_per_capita = gdp;
            json.features[j].properties.hdi = hdi;
            json.features[j].properties.plot_data = plot_data;
            json.features[j].properties.agriculture = data[i].gdp_agriculture;
            json.features[j].properties.industry = data[i].gdp_industry;
            json.features[j].properties.services = data[i].gdp_services;
            json.features[j].properties.Long = data[i].Long;
            json.features[j].properties.Lat = data[i].Lat;
            break;
          }
        }
      }
      var colorCoder = function(val){
        var value = val;
        if (value > number[0]){
          return color[0];
        }else if (value > number[1] && value < number[0]){
          return color[1];
        }else if (value > number[2] && value < number[1]){
          return color[2];
        }else if (value > number[3] && value < number[2]){
          return color[3];
        }else if (value > number[4] && value < number[3]){
          return color[4];
        }else if (value > number[5] && value < number[4]){
          return color[5];
        }else if (value > number[6] && value < number[5]){
          return color[6];
        }else if (value > number[7] && value < number[6]){
          return color[7];
        }else {
          return "#D2DBDD";
        }
      }

      var group = svg.selectAll("g.main")
                      .data(json.features)
                      .enter()
                      .append("g");

      var projection = d3.geoMercator()
                          .scale(450)
                          .translate([300,h/2 + 45]);
      var path = d3.geoPath()
                    .projection(projection);

      var countries = group.append("path")
                          .attr("d", path)
                          .attr("class", function (d){
                            return `countries ${trim(d.properties.name)}`
                          })
                          .style("fill", function(d){
                            return colorCoder(d.properties.gdp_per_capita);
                          })
                          .on("mouseover", function(d){
                             d3.selectAll(`.countries.${trim(d.properties.name)}`).style("fill", "#FF00FF");
                             d3.selectAll(`.label.${trim(d.properties.name)}`).style("fill", "#FF00FF");
                          })
                          .on("mouseout", function(d){
                             d3.selectAll(`.countries.${trim(d.properties.name)}`).style("fill", function(d) {
                               return colorCoder(d.properties.gdp_per_capita);
                              });
                             d3.selectAll(`.label.${trim(d.properties.name)}`).style("fill", "#586271");
                          })
                          .on("click", function(d){
                            d3.select(".jumbotron").style("visibility", "visible");
                            plotsDrawer(d.properties);
                            d3.selectAll(".blur").style("filter", "blur(3px)").style("pointer-events","none");
                          });

      var labels = group.append("text")
                          .attr("class", function(d){ return "label " + trim(d.properties.name)})
                          .text(function(d){
                            if (trim(d.properties.name) !=  "La Reunion"){
                              return  d.properties.name;
                            }
                          })
                          .attr("font-size","1em")
                          .attr("fill","black")
                          .attr("x", function(d,i){
                            return parseInt(i/19) * 200 + 800;
                          })
                          .attr("font-family", "sans-serif")
                          .attr("y", function (d,i){
                            if (i >= 38){
                              return (i-38)*20 + h/3;
                            }else if (i >= 19) {
                              return (i-19)*20 + h/3
                            }else{
                              return (20 * i) + h/3;
                            }
                          })
                          .attr("width", "150")
                          .attr("height", "15")
                          .on("mouseover", function(d){
                             d3.selectAll(`.countries.${trim(d.properties.name)}`).style("fill", "FF00FF");
                             d3.selectAll(`.label.${trim(d.properties.name)}`).style("fill", "#FF00FF");
                          })
                          .on("mouseout", function(d){
                             d3.selectAll(`.countries.${trim(d.properties.name)}`).style("fill", function(d){
                               return colorCoder(d.properties.gdp_per_capita);
                             });
                             d3.selectAll(`.label.${trim(d.properties.name)}`).style("fill", "#586271");
                          })
                          .on("click", function(d){
                            d3.select(".jumbotron").style("visibility", "visible");
                            d3.selectAll(".blur").style("filter", "blur(4px)").style("pointer-events","none");
                            plotsDrawer(d.properties);
                          });

      var legend = svg.selectAll("g.legend")
                      .data(color)
                      .enter()
                      .append("g");

      var textsLegend = legend.append("text")
            .attr("class", "legend_text")
            .attr("font-size","1em")
            .attr("fill","black")
            .attr("x", "80")
            .attr("font-family", "sans-serif")
            .attr("y", function (d,i){
              return 2/3 * h + (i * 20) - 2.5;
            })
            .text(function (d,i){
              if (i < 1){
                return `> ${number[i]}`;
              }else if (i == 7){
                return `< ${number[i-1]}`;
              }else {
                return `${number[i]} - ${number[i-1]}` ;
              }
            })

      legend.append("text")
            .text("No Data")
            .attr("x", "80")
            .attr("font-size","1em")
            .style("font-weight", "normal")
            .style("font-family", "sans-serif")
            .attr("y", `${2/3 * h + (8 * 20) - 2.5}`);

      var mainTitle = legend.append("text")
                            .text("GDP in Dollars")
                            .attr("x", "60")
                            .attr("font-size","1em")
                            .style("font-weight", "bold")
                            .style("text-decoration", "underline")
                            .style("font-family", "sans-serif")
                            .attr("y", `${2/3 * h -30}`);

      var rectangles = legend.append("rect")
            .attr("class", "legend_text")
            .attr("width", "15")
            .attr("height","15")
            .attr("fill",function(d,i){
              return color[i];
            })
            .attr("x", "60")
            .attr("y", function (d,i){
              return 2/3 * h + (i * 20) - 15;
            })
            .style("stroke", "black");

      legend.append("rect")
            .attr("x", "60")
            .attr("width", "15")
            .attr("height","15")
            .attr("y", `${2/3 * h + (8 * 20) - 15}`)
            .style("fill", "#D2DBDD")
            .style("stroke", "black");

      d3.selectAll("#dimensions input").on("change", function(d){

          var value = this.value;

          if (value == "gdp"){

            d3.selectAll(".circles").remove("*");
            d3.selectAll(".secondLegend").remove("*");

            color = colors[0];
            number = numbers[0];

            mainTitle.text("GDP in Dollars");

            countries.style("fill", function(d){
              return colorCoder(d.properties.gdp_per_capita);
            })
            .on("mouseout", function(d){
              countries.style("fill", function(d){
                return colorCoder(d.properties.gdp_per_capita);
              });
              labels.style("fill", "#586271");

            });
            labels.on("mouseout", function(d){
              countries.style("fill", function(d){
                return colorCoder(d.properties.gdp_per_capita);
              });
              labels.style("fill", "#586271");
            });
            textsLegend.text(function (d,i){
              if (i < 1){
                return `> ${number[i]}`;
              }else if (i == 7){
                return `< ${number[i-1]}`;
              }else {
                return `${number[i]} - ${number[i-1]}` ;
              }
            });
            rectangles.style("fill",function(d,i){
              return color[i];
            });
          }

          else if (value == "hdi"){

            d3.selectAll(".circles").remove("*");
            d3.selectAll(".secondLegend").remove("*");

            color = colors[1];
            number = numbers[1];

            mainTitle.text("HDI");

            countries.style("fill", function(d){
              return colorCoder(d.properties.hdi);
            })
            .on("mouseout", function(d){
              countries.style("fill", function(d){
                return colorCoder(d.properties.hdi);
              });
              labels.style("fill","#586271");
            });

            labels.on("mouseout", function(d){
              countries.style("fill", function(d){
                return colorCoder(d.properties.hdi);
              });
              labels.style("fill", "#586271");
            });

            textsLegend.text(function (d,i){
              if (i < 1){
                return `> ${number[i]}`;
              }else if (i == 7){
                return `< ${number[i-1]}`;
              }else {
                return `${number[i]} - ${number[i-1]}` ;
              }
            });
            rectangles.style("fill",function(d,i){
              return color[i];
            });
          }

          else {
            color = colors[0];
            number = numbers[0];
            mainTitle.text("GDP in Dollars");

            countries.style("fill", function(d){
              return colorCoder(d.properties.gdp_per_capita);
            })
                      .on("mouseout", function(d){
                        countries.style("fill", function(d){
                          return colorCoder(d.properties.gdp_per_capita);
                        });
                        labels.style("fill", "#586271");
                      });

            labels.on("mouseout", function(d){
              countries.style("fill", function(d){
                return colorCoder(d.properties.gdp_per_capita);
              });
              labels.style("fill", "#586271");

            });

            textsLegend.text(function (d,i){
              if (i < 1){
                return `> ${number[i]}`;
              }else if (i == 7){
                return `< ${number[i-1]}`;
              }else {
                return `${number[i]} - ${number[i-1]}` ;
              }
            });
            rectangles.style("fill",function(d,i){
              return color[i];
            });

            var circles = group.append("circle")
                                .attr("class", "circles")
                                .attr("cx", function(d){
                                  if (projection([d.properties.Long, d.properties.Lat])[0]){
                                    return projection([d.properties.Long, d.properties.Lat])[0];
                                  }else {
                                    return
                                  }
                                })
                                .attr("cy", function(d) {
                                  if (projection([d.properties.Long, d.properties.Lat])[1]){
                                    return projection([d.properties.Long, d.properties.Lat])[1];
                                  }else {
                                    return
                                  }
                                })
                                .attr("r", "7")
                                .style("stroke", "black")
                                .style("opacity", "0.9")
                                .style("fill", function(d){
                                  color = colors[1];
                                  number = numbers[1];
                                  var colorThis = colorCoder(d.properties.hdi);
                                  color = colors[0];
                                  number = numbers[0];
                                  return colorThis;
                                })
                                .on("mouseover", function(d){
                                   d3.selectAll(`.${trim(d.properties.name)}`).style("fill", "FF00FF").atrr("class", ":hover");
                                   d3.selectAll(`.label.${trim(d.properties.name)}`).style("fill", "FF00FF");

                                })
                                .on("mouseout", function(d){
                                   d3.selectAll(`.countries.${trim(d.properties.name)}`).style("fill", function(d) {
                                     return colorCoder(d.properties.gdp_per_capita);
                                   });
                                   d3.selectAll(`.label.${trim(d.properties.name)}`).style("fill", "#586271");
                                })
                                .on("click", function(d){
                                  d3.select(".jumbotron").style("visibility", "visible");
                                  d3.selectAll(".blur").style("filter", "blur(4px)").style("pointer-events","none");
                                  plotsDrawer(d.properties);
                                });
            color = colors[1];
            number = numbers[1];

            var secondLegend = svg.selectAll("g.legend")
                                  .data(color)
                                  .enter()
                                  .append("g")
                                  .attr("class","secondLegend")

            circleTextLegend = secondLegend.append("text")
                                          .attr("class", "legend_text")
                                          .attr("font-size","1em")
                                          .attr("fill","black")
                                          .attr("x", "230")
                                          .attr("font-family", "sans-serif")
                                          .attr("y", function (d,i){
                                            return 2/3 * h + (i * 20) - 2.5;
                                          })
                                          .text(function (d,i){
                                            if (i < 1){
                                              return `> ${number[i]}`;
                                            }else if (i == 7){
                                              return `< ${number[i-1]}`;
                                            }else {
                                              return `${number[i]} - ${number[i-1]}` ;
                                            }
                                          })
            circleLegend = secondLegend.append("circle")
                                      .attr("class", "hdi_legend_text")
                                      .attr("fill",function(d,i){
                                        return color[i];
                                      })
                                      .attr("cx", "210")
                                      .attr("cy", function (d,i){
                                        return 2/3 * h + (i * 20) - 7;
                                      })
                                      .attr("r", "7")
                                      .style("opacity", "0.9")
                                      .style("stroke", "black");

            secondLegend.append("text")
                            .text("No Data")
                            .attr("x", "230")
                            .attr("font-size","1em")
                            .style("font-weight", "normal")
                            .style("font-family", "sans-serif")
                            .attr("y", `${2/3 * h + (8 * 20) - 2.5}`);

            secondLegend.append("text")
                        .text("HDI")
                        .attr("x", "200")
                        .attr("font-size","1em")
                        .style("font-weight", "bold")
                        .style("text-decoration", "underline")
                        .style("font-family", "sans-serif")
                        .attr("y", `${2/3 * h -30}`);

            secondLegend.append("circle")
                        .attr("cx", "210")
                        .attr("cy", function (d,i){
                          return 2/3 * h + (8 * 20) - 7;
                        })
                        .attr("r", "7")
                        .style("stroke", "black")
                        .style("fill","#D2DBDD");

            color = colors[0];
            number = numbers[0];
          }

        })

      });
  });
