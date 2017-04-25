
// LINE CHART **********************************************

// set the dimensions and margins of the graph
var margin = {top: 25, right: 15, bottom: 20, left: 50},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    width2 = 500 - margin.left - margin.right,
    height2 = 800 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var z = d3.scaleLinear().range(["red", "white", "green"]);

var xHM = d3.scaleLinear().range([0, width]);
var yHM = d3.scaleLinear().range([height, 0]);

var zValue = function(d) { return +d.Sentiment; };

// format decimal places
var formatDecimal = d3.format(".3f");

var bisectDate = d3.bisector(function(d) { return d.Year; }).left

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#line_view").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "main")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#year_view").append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(32.5,0)");

var input1 = d3.select("#artist1").append("input")
    .attr("type", "text")
    .attr("id", "input1")
    .attr("size", 32)

var input2 = d3.select("#artist2").append("input")
    .attr("type", "text")
    .attr("id", "input2")
    .attr("size", 32)

var radius = Math.min(200, 200) / 2;

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 40)
    .padAngle(.03);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.percent; });

var svg3 = d3.select("#artist1").append("svg")
    .attr("width", 200 + margin.left + margin.right)
    .attr("height", 200 + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + 200 / 2 + "," + 200 / 2 + ")");

var svg4 = d3.select("#artist2").append("svg")
    .attr("width", 200 + margin.left + margin.right)
    .attr("height", 200 + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + 200 / 2 + "," + 200 / 2 + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Get the data
d3.csv("data/clean_billboard_with_sentiment.csv", function(error, data) {
  if (error) throw error;


  // format the data
  data.forEach(function(d) {
      d.Sentiment = formatDecimal(parseFloat(d.Sentiment));
      d.Year = +d.Year;
      d.Rank = +d.Rank;
  });

  //Getting average sentiment per year to create line graph
  var dataAvg = d3.nest()
    .key(function(d) { return d.Year; })
    .rollup(function(v) {
      return formatDecimal(d3.mean(v, function(d) { return parseFloat(d.Sentiment); }))})
    .entries(data);

  //getting minimum sentiment per year
  var dataMin = d3.nest()
    .key(function(d) { return d.Year; })
    .rollup(function(v) {
      var minIndex = d3.scan(v, function(d1, d2) { return d1.Sentiment - d2.Sentiment });
      return {
        song: v[minIndex].Song,
        artist: v[minIndex].Artist,
        score: v[minIndex].Sentiment
      }; })
    .entries(data);

  // getting maximum sentiment per year
  var dataMax = d3.nest()
    .key(function(d) { return d.Year; })
    .rollup(function(v) {
      var maxIndex = d3.scan(v, function(d1, d2) { return d2.Sentiment - d1.Sentiment });
      return {
        song: v[maxIndex].Song,
        artist: v[maxIndex].Artist,
        score: v[maxIndex].Sentiment
      }; })
    .entries(data);

  // getting average sentiment per rank to create different line graph
  var dataRankAvg = d3.nest()
    .key(function(d) { return d.Rank; })
    .rollup(function(v) {
      return formatDecimal(d3.mean(v, function(d) { return parseFloat(d.Sentiment); }))})
    .entries(data);

  //getting minimum sentiment per rank
  var dataRankMin = d3.nest()
    .key(function(d) { return d.Rank; })
    .rollup(function(v) {
      var minIndex = d3.scan(v, function(d1, d2) { return d1.Sentiment - d2.Sentiment });
      return {
        song: v[minIndex].Song,
        artist: v[minIndex].Artist,
        score: v[minIndex].Sentiment,
        year: v[minIndex].Year
      }; })
    .entries(data);

  // getting maximum sentiment per rank
  var dataRankMax = d3.nest()
    .key(function(d) { return d.Rank; })
    .rollup(function(v) {
      var maxIndex = d3.scan(v, function(d1, d2) { return d2.Sentiment - d1.Sentiment });
      return {
        song: v[maxIndex].Song,
        artist: v[maxIndex].Artist,
        score: v[maxIndex].Sentiment,
        year: v[maxIndex].Year
      }; })
    .entries(data);

  dataAvg.forEach(function(d) {
    d.Year = d.key;
    d.Sentiment = d.value;
  });

  dataMin.forEach(function(d) {
    d.Year = d.key;
    d.Sentiment = d.value.score;
    d.Song = d.value.song;
    d.Artist = d.value.artist;
    d.Rank = d.value.rank;
  });

  dataMax.forEach(function(d) {
    d.Year = d.key;
    d.Sentiment = d.value.score;
    d.Song = d.value.song;
    d.Artist = d.value.artist;
    d.Rank = d.value.rank;
  });

  dataRankAvg.forEach(function(d) {
    d.Rank = +d.key;
    d.Sentiment = +d.value;
  });
  dataRankAvg.sort(function(a,b) {return b.Rank - a.Rank;});

  dataRankMin.forEach(function(d) {
    d.Rank = d.key;
    d.Sentiment = d.value.score;
    d.Song = d.value.song;
    d.Artist = d.value.artist;
    d.Year = d.value.year;
  });
  dataRankMin.sort(function(a,b) {return b.Rank - a.Rank;});

  dataRankMax.forEach(function(d) {
    d.Rank = d.key;
    d.Sentiment = d.value.score;
    d.Song = d.value.song;
    d.Artist = d.value.artist;
    d.Year = d.value.year;
  });
  dataRankMax.sort(function(a,b) {return b.Rank - a.Rank;});

  // Scale the range of the data for line
  x.domain([1965, 2015]);
  y.domain([-1, 1]);
  z.domain([d3.min(data, zValue), 0, d3.max(data, zValue)]);

  // define the line
  var valueline = d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Sentiment); });

  var valueRankLine = d3.line()
      .x(function(d) { return x(d.Rank); })
      .y(function(d) { return y(d.Sentiment); });

  // Add the valueline path.
  svg.append("path")
      .data([dataAvg])
      .attr("class", "lineYear")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr('class', 'axisX')
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .attr("fill", "black")
        .style("text-anchor", "end")
        .text("Year");

  // Add the Y Axis
  svg.append("g")
      .attr('class', 'axis')
      .call(d3.axisLeft(y))
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("fill", "black")
        .style("text-anchor", "end")
        .text("Sentiment Score");


  //add scatterplot to overlay on line graph
  svg.selectAll("dot")
      .data(dataAvg)
  .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", function(d) { return x(d.key); })
      .attr("cy", function(d) { return y(d.value); })
      .attr("fill", "#fff")
      .attr("opacity", 0)
      .on("mouseover", function(d) {
        d3.select(this).attr("opacity", 1)
        tooltip.style("opacity", 1);
        tooltip.html("Year: " + d.key + "<br/>" + "Avg Score: " + d.value)
          .style("left", d3.event.pageX + 5 + "px")
          .style("top", d3.event.pageY + 5 + "px")
      })
      .on("mouseout", function(d) {
          d3.select(this).attr("opacity", 0)
          tooltip.style("opacity", 0)
      })
      .on("click", function(d, i) {
          svg2.selectAll(".tile").remove()
          d3.select("#year_view h6").text("Top 100 for " + d.key)
          svg2.selectAll(".tile")
            .data(data.filter(function(e) { return d.key == e.Year }))
          .enter().append("rect")
            .attr("class", "tile")
            .style("fill", function(e) { return z(+e.Sentiment); })
            .attr("y", function(e,i) { return i * 7; })
            .attr("x", 163.125)
            .attr("width", width2 / 4)
            .attr("height", 14)
            .attr("opacity", 0)
            .transition()
            .delay(function(e, i) { return 25 * i; })
            .attr("x", 108.75)
            .attr("width", width2 / 2)
            .attr("height", 7)
            .attr("opacity", 1);

          svg2.selectAll(".tile").on("mouseover", function(e, i) {
              d3.select(this).attr("height", 14)
              d3.select(this).transition().attr("x", 0).attr("width", width2)

              svg2.append("text")
                .attr("class", "title")
                .attr("fill", "black")
                .attr("font-size", "1em")
                .attr("x", 217.5)
                .attr("y", i * 7 + 3.5)
                .text(e.Rank + " " + e.Song + " -- " + e.Artist)
                .attr("opacity", 0)
                .transition()
                .attr("opacity", 1)

              var a = this.nextElementSibling
              while (a) {
                d3.select(a).attr("transform", "translate(0,7)")
                a = a.nextElementSibling
              }

              svg.append("rect")
                  .attr("class", "modal")
                  .attr("width", width + 13)
                  .attr("height", height + 5)
                  .attr("y", -5)
                  .attr("fill", "#000")
                  .attr("opacity", .75);

              if (document.getElementById("showByYear").checked) {

                x.domain([1965,2015])

                svg.append("circle")
                    .attr("class", "dotHighlight")
                    .attr("r", 4)
                    .attr("cx", x(e.Year))
                    .attr("cy", y(e.Sentiment))
                    .attr("fill", z(e.Sentiment))

              } else if (document.getElementById("showByRank").checked) {

                x.domain([0,100])

                svg.append("circle")
                    .attr("class", "dotHighlight")
                    .attr("r", 4)
                    .attr("cx", x(e.Rank))
                    .attr("cy", y(e.Sentiment))
                    .attr("fill", z(e.Sentiment))

              } else if (document.getElementById("showHeatmap").checked) {

                svg.append("rect")
                    .attr("class", "rectHighlight")
                    .attr("x", xHM(e.Year))
                    .attr("y", yHM(e.Rank-1))
                    .attr("width", width / 50)
                    .attr("height",  height / 100)
                    .attr("fill", z(e.Sentiment))
              }

              // tooltip.style("opacity", 1);
              // tooltip.html("Score: " + e.Sentiment + "<br/>"
              //   + e.Lyrics)
              //   .style("left", d3.event.pageX + 5 + "px")
              //   .style("top", d3.event.pageY + 5 + "px")
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("height", 7)
                d3.select(this).transition().attr("x", 108.75).attr("width", width2 / 2)

                svg2.selectAll(".title").remove()
                var a = this.nextElementSibling
                while (a) {
                  d3.select(a).attr("transform", "translate(0,0)")
                  a = a.nextElementSibling
                }

                svg.selectAll(".modal").remove()
                svg.selectAll(".dotHighlight").remove()
                svg.selectAll(".rectHighlight").remove()
                // tooltip.style("opacity", 0)
            });
      })

    // append dots for minimum each year
    svg.selectAll("dot")
        .data(dataMin)
      .enter().append("circle")
        .attr("class", "dotMin")
        .attr("opacity", 1)
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.Year); })
        .attr("cy", function(d) { return y(d.Sentiment); })
        .style("fill", function(d) { return z(+d.Sentiment); })
        .on("mouseover", function(d) {
          tooltip.style("opacity", 1);
          tooltip.html("Song: " + d.Song + "<br/>"
            + "Artist: " + d.Artist + "<br/>"
            + "Year: " + d.Year + "<br/>"
            + "Score: " + d.Sentiment)
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px")
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0)
        });

    // append dots for maximum each year
    svg.selectAll("dot")
        .data(dataMax)
      .enter().append("circle")
        .attr("class", "dotMax")
        .attr("opacity", 1)
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.Year); })
        .attr("cy", function(d) { return y(d.Sentiment); })
        .style("fill", function(d) { return z(+d.Sentiment); }).on("mouseover", function(d) {
          tooltip.style("opacity", 1);
          tooltip.html("Song: " + d.Song + "<br/>"
            + "Artist: " + d.Artist + "<br/>"
            + "Year: " + d.Year + "<br/>"
            + "Score: " + d.Sentiment)
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px")
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0)
        });

    //RANK OVERLAY
    //add scatterplot to overlay on line graph

    x.domain([0, 100]);

    // Add the valueRankline path.
    svg.append("path")
        .data([dataRankAvg])
        .attr("class", "lineRank")
        .attr("d", valueRankLine)
        .attr("opacity", 0)
        .attr("display", "none");

    svg.selectAll("dotRank")
        .data(dataRankAvg)
    .enter().append("circle")
        .attr("class", "dotRank")
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.key); })
        .attr("cy", function(d) { return y(d.value); })
        .attr("fill", "#fff")
        .attr("display", "none")
        .attr("opacity", 0)
        .on("mouseover", function(d) {
          d3.select(this).attr("opacity", 1)
          tooltip.style("opacity", 1);
          tooltip.html("Rank: " + d.key + "<br/>" + "Avg Score: " + d.value)
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px")
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("opacity", 0)
            tooltip.style("opacity", 0)
        })
        .on("click", function(d) {
          svg2.selectAll(".tile").remove()
          d3.select("#year_view h6").text("All Years of Rank #" + d.key)
          svg2.selectAll(".tile")
            .data(data.filter(function(e) { return d.key == e.Rank }))
          .enter().append("rect")
            .attr("class", "tile")
            .style("fill", function(e) { return z(+e.Sentiment); })
            .attr("y", function(e,i) { return i * 7; })
            .attr("x", 163.125)
            .attr("width", width2 / 4)
            .attr("height", 14)
            .attr("opacity", 0)
            .transition()
            .delay(function(e, i) { return 25 * i; })
            .attr("x", 108.75)
            .attr("width", width2 / 2)
            .attr("height", 7)
            .attr("opacity", 1);

          svg2.selectAll(".tile").on("mouseover", function(e, i) {
              d3.select(this).attr("height", 14)
              d3.select(this).transition().attr("x", 0).attr("width", width2)

              svg2.append("text")
                .attr("class", "title")
                .attr("fill", "black")
                .attr("font-size", "1em")
                .attr("x", 217.5)
                .attr("y", i * 7 + 3.5)
                .text(e.Year + " " + e.Song + " -- " + e.Artist)
                .attr("opacity", 0)
                .transition()
                .attr("opacity", 1)

              var a = this.nextElementSibling
              while (a) {
                d3.select(a).attr("transform", "translate(0,7)")
                a = a.nextElementSibling
              }

              svg.append("rect")
                  .attr("class", "modal")
                  .attr("width", width + 13)
                  .attr("height", height + 5)
                  .attr("y", -5)
                  .attr("fill", "#000")
                  .attr("opacity", .75);

              if (document.getElementById("showByYear").checked) {

                x.domain([1965,2015])

                svg.append("circle")
                    .attr("class", "dotHighlight")
                    .attr("r", 4)
                    .attr("cx", x(e.Year))
                    .attr("cy", y(e.Sentiment))
                    .attr("fill", z(e.Sentiment))

              } else if (document.getElementById("showByRank").checked) {

                x.domain([0,100])

                svg.append("circle")
                    .attr("class", "dotHighlight")
                    .attr("r", 4)
                    .attr("cx", x(e.Rank))
                    .attr("cy", y(e.Sentiment))
                    .attr("fill", z(e.Sentiment))

              } else if (document.getElementById("showHeatmap").checked) {

                svg.append("rect")
                    .attr("class", "rectHighlight")
                    .attr("x", xHM(e.Year))
                    .attr("y", yHM(e.Rank-1))
                    .attr("width", width / 50)
                    .attr("height",  height / 100)
                    .attr("fill", z(e.Sentiment))
              }

              // tooltip.style("opacity", 1);
              // tooltip.html("Score: " + e.Sentiment + "<br/>"
              //   + e.Lyrics)
              //   .style("left", d3.event.pageX + 5 + "px")
              //   .style("top", d3.event.pageY + 5 + "px")
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("height", 7)
                d3.select(this).transition().attr("x", 108.75).attr("width", width2 / 2)

                svg2.selectAll(".title").remove()
                var a = this.nextElementSibling
                while (a) {
                  d3.select(a).attr("transform", "translate(0,0)")
                  a = a.nextElementSibling
                }

                svg.selectAll(".modal").remove()
                svg.selectAll(".dotHighlight").remove()
                svg.selectAll(".rectHighlight").remove()
                // tooltip.style("opacity", 0)
            });
        })

    // append dots for minimum each year
    svg.selectAll("dot")
        .data(dataRankMin)
      .enter().append("circle")
        .attr("class", "dotRankMin")
        .attr("display", "none")
        .attr("opacity", 0)
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.Rank); })
        .attr("cy", function(d) { return y(d.Sentiment); })
        .style("fill", function(d) { return z(+d.Sentiment); })
        .on("mouseover", function(d) {
          d3.select(this).attr("opacity", 1)
          tooltip.style("opacity", 1);
          tooltip.html("Song: " + d.Song + "<br/>"
            + "Artist: " + d.Artist + "<br/>"
            + "Year: " + d.Year + "<br/>"
            + "Rank: " + d.Rank + "<br/>"
            + "Score: " + d.Sentiment)
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px")
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0)
        });

    // append dots for maximum each year
    svg.selectAll("dot")
        .data(dataRankMax)
      .enter().append("circle")
        .attr("class", "dotRankMax")
        .attr("display", "none")
        .attr("opacity", 0)
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.Rank); })
        .attr("cy", function(d) { return y(d.Sentiment); })
        .style("fill", function(d) { return z(+d.Sentiment); })
        .on("mouseover", function(d) {
          d3.select(this).attr("opacity", 1)
          tooltip.style("opacity", 1);
          tooltip.html("Song: " + d.Song + "<br/>"
            + "Artist: " + d.Artist + "<br/>"
            + "Year: " + d.Year + "<br/>"
            + "Rank: " + d.Rank + "<br/>"
            + "Score: " + d.Sentiment)
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px")
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0)
        });

    xHM.domain(d3.extent(data, function(d){return d.Year;}));
    yHM.domain(d3.extent(data, function(d){return d.Rank;}).reverse());

    svg.selectAll(".HMtile")
        .data(data)
      .enter().append("rect")
        .attr("class", "HMtile")
        .attr("x", function(d) { return xHM(d.Year); })
        .attr("y", function(d) { return yHM(d.Rank-1); })
        .attr("width", width / 50)
        .attr("height",  height / 100)
        .style("fill", function(d) { return z(d.Sentiment); })
        .attr("opacity", 0)
        .attr("display", "none")
        .on("mouseover", function(d) {
          tooltip.style("opacity", 1);
          tooltip.html("Song: " + d.Song + "<br/>" + "Artist: " + d.Artist)
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY + 5 + "px")
        })
        .on("mouseout", function(d) {
            tooltip.style("opacity", 0)
        });

    // Change main view by toggling radio buttons
    d3.selectAll("input[name='mode']").on("change", function() {

        if (document.getElementById("showByYear").checked) {
          d3.select(".axis").remove();
          d3.select(".label").remove();
          d3.selectAll(".dotRankMin").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".dotRankMax").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".lineRank").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".HMtile").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".dotRank").attr("display", "none");
          d3.selectAll(".dotRankMin").attr("display", "none");
          d3.selectAll(".dotRankMax").attr("display", "none");
          d3.selectAll(".lineRank").attr("display", "none");
          d3.selectAll(".HMtile").attr("display", "none");
          d3.selectAll(".dot").attr("display", "initial");
          d3.selectAll(".dotMin").attr("display", "initial");
          d3.selectAll(".dotMax").attr("display", "initial");
          d3.selectAll(".lineYear").attr("display", "initial");
          d3.selectAll(".dotMin").transition()
            .duration(1000)
            .delay(function(d) {
              return (Math.random() * 1000)
            })
            .style("opacity", 1);
          d3.selectAll(".dotMax").transition()
            .duration(1000)
            .delay(function(d) {
              return (Math.random() * 1000)
            })
            .style("opacity", 1);
          d3.selectAll(".lineYear")
            .transition()
            .duration(1000)
            .style("opacity", 1);

          x.domain([1965, 2015]);

          d3.select(".axisX")
              .transition()
              .duration(600)
              .call(d3.axisBottom(x).tickFormat(d3.format("d")));
          d3.select(".axisX")
              .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .attr("fill", "black")
                .style("text-anchor", "end")
                .text("Year");

          // Add the Y Axis
          svg.append("g")
              .attr('class', 'axis')
              .call(d3.axisLeft(y))
              .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .attr("fill", "black")
                .style("text-anchor", "end")
                .text("Sentiment Score");

        } else if (document.getElementById("showByRank").checked) {

          d3.select(".axis").remove();
          d3.select(".label").remove();
          d3.selectAll(".dotMin").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".dotMax").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".lineYear").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".HMtile").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".dot").attr("display", "none");
          d3.selectAll(".dotMin").attr("display", "none");
          d3.selectAll(".dotMax").attr("display", "none");
          d3.selectAll(".lineYear").attr("display", "none");
          d3.selectAll(".HMtile").attr("display", "none");
          d3.selectAll(".dotRank").attr("display", "initial");
          d3.selectAll(".dotRankMin").attr("display", "initial");
          d3.selectAll(".dotRankMax").attr("display", "initial");
          d3.selectAll(".lineRank").attr("display", "initial");
          d3.selectAll(".dotRankMin").transition()
            .duration(1000)
            .delay(function(d) {
              return (Math.random() * 1000)
            })
            .style("opacity", 1);
          d3.selectAll(".dotRankMax").transition().duration(1000)
            .delay(function(d) {
              return (Math.random() * 1000)
            })
            .style("opacity", 1);
          d3.selectAll(".lineRank")
            .transition()
            .duration(1000)
            .style("opacity", 1);

          x.domain([0, 100]);
          // Add the X Axis
          d3.select(".axisX")
              .transition()
              .duration(600)
              .call(d3.axisBottom(x).tickFormat(d3.format("d")));
          d3.select(".axisX")
              .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .attr("fill", "black")
                .style("text-anchor", "end")
                .text("Rank");

          // Add the Y Axis
          svg.append("g")
              .attr('class', 'axis')
              .call(d3.axisLeft(y))
              .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .attr("fill", "black")
                .style("text-anchor", "end")
                .text("Sentiment Score");
        } else if (document.getElementById("showHeatmap").checked) {

          d3.select(".axis").remove();
          d3.select(".label").remove();
          d3.selectAll(".dotMin").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".dotMax").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".lineYear").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".dotRankMin").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".dotRankMax").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".lineRank").transition().duration(1000).style("opacity", 0);
          d3.selectAll(".dot").attr("display", "none");
          d3.selectAll(".dotMin").attr("display", "none");
          d3.selectAll(".dotMax").attr("display", "none");
          d3.selectAll(".lineYear").attr("display", "none");
          d3.selectAll(".dotRank").attr("display", "none");
          d3.selectAll(".dotRankMin").attr("display", "none");
          d3.selectAll(".dotRankMax").attr("display", "none");
          d3.selectAll(".lineRank").attr("display", "none");
          d3.selectAll(".HMtile").attr("display", "initial");
          d3.selectAll(".HMtile").transition()
            .duration(1000)
            .delay(function(d) {
              return (Math.random() * 100)
            }).style("opacity", 1)

          // Add the X Axis
          d3.select(".axisX")
              .transition()
              .duration(600)
              .call(d3.axisBottom(xHM).tickFormat(d3.format("d")));
          d3.select(".axisX")
              .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .attr("fill", "black")
                .style("text-anchor", "end")
                .text("Year");

          // Add the Y Axis
          svg.append("g")
              .attr('class', 'axis')
              .call(d3.axisLeft(yHM))
              .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .attr("fill", "none")
                .style("text-anchor", "end")
                .text("Rank");
        }
    });

  var artistsAvg = d3.nest()
    .key(function(d) { return d.Artist; })
    .rollup(function(v) {
      return [
        {avg: formatDecimal(d3.mean(v, function(d) { return parseFloat(d.Sentiment); }))},
        {name:"total_pos", percent: d3.sum(v, function(d) { return +d.Sentiment >= 0; })},
        {name:"total_neg", percent: d3.sum(v, function(d) { return +d.Sentiment < 0; })}
      ]
    })
    .object(data);

  input1.on("change", function(){

        if (!(document.getElementById("input1").value in artistsAvg)) {
          return
        }

        svg3.selectAll(".arc").remove()
        svg3.selectAll("text").remove()

        var b = svg3.selectAll(".arc")
            .data(pie(artistsAvg[document.getElementById("input1").value]))
          .enter().append("g")
            .attr("class", "arc");

        var path = b.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return (d.data.name == "total_pos") ? "green" : "red"; })
            .on("mouseover", function(d) {

              if(d.data.name == "total_pos") {
                songs = data.filter(function(e) { return e.Artist == document.getElementById("input1").value && +e.Sentiment >= 0})
                songs.sort(function(a,b) {return b.Year - a.Year;});
              } else {
                songs = data.filter(function(e) { return e.Artist == document.getElementById("input1").value && +e.Sentiment < 0})
                songs.sort(function(a,b) {return b.Year - a.Year;});
              }
              str = ""
              for (var i = songs.length - 1; i >= 0; i--) {
                str = str + songs[i].Song + " (" + songs[i].Year + ")" + "<br/>"
              };

              tooltip.style("opacity", 1);
              tooltip.html(str)
                .style("left", d3.event.pageX + 5 + "px")
                .style("top", d3.event.pageY + 5 + "px")

              svg.append("rect")
                  .attr("class", "modal")
                  .attr("width", width + 13)
                  .attr("height", height + 5)
                  .attr("y", -5)
                  .attr("fill", "#000")
                  .attr("opacity", .85);

              if (document.getElementById("showByYear").checked) {

                x.domain([1965,2015])

                svg.selectAll("dotHighlight")
                    .data(songs)
                .enter().append("circle")
                    .attr("class", "dotHighlight")
                    .attr("r", 4)
                    .attr("cx", function(e) { return x(e.Year); })
                    .attr("cy", function(e) { return y(e.Sentiment); })
                    .attr("fill", function(e) { return z(e.Sentiment); })

              } else if (document.getElementById("showByRank").checked) {

                x.domain([0,100])

                svg.selectAll("dotHighlight")
                    .data(songs)
                .enter().append("circle")
                    .attr("class", "dotHighlight")
                    .attr("r", 4)
                    .attr("cx", function(e) { return x(e.Rank); })
                    .attr("cy", function(e) { return y(e.Sentiment); })
                    .attr("fill", function(e) { return z(e.Sentiment); })

              } else if (document.getElementById("showHeatmap").checked) {

                svg.selectAll("rectHighlight")
                    .data(songs)
                .enter().append("rect")
                    .attr("class", "rectHighlight")
                    .attr("x", function(e) { return xHM(e.Year); })
                    .attr("y", function(e) { return yHM(e.Rank-1); })
                    .attr("width", width / 50)
                    .attr("height",  height / 100)
                    .attr("fill", function(e) { return z(e.Sentiment); })
              }

            })
            .on("mouseout", function() {
              tooltip.style("opacity", 0)
              svg.selectAll(".modal").remove();
              svg.selectAll(".dotHighlight").remove();
              svg.selectAll(".rectHighlight").remove();
            });

        path.transition()
          .duration(1000)
          .attrTween('d', function(d) {
              var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
              return function(t) {
                  return arc(interpolate(t));
              };
        });

        b.append("text")
            .transition()
            .duration(200)
            .delay(1000)
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".4em")
            .attr("text-anchor", "middle")
            .text(function(d) { if(d.data.percent) {return d.data.percent; } });

        b.append("text")
            .attr("class", "avg")
            .transition()
            .duration(200)
            .delay(1000)
            .attr("dy", ".4em")
            .attr("text-anchor", "middle")
            .attr("fill", function(d) { return z(d.data.avg); })
            .text(function(d) { return d.data.avg; })
    })

  input2.on("change", function(){

        if (!(document.getElementById("input2").value in artistsAvg)) {
          return
        }

        svg4.selectAll(".arc").remove()
        svg4.selectAll("text").remove()

        var b = svg4.selectAll(".arc")
            .data(pie(artistsAvg[document.getElementById("input2").value]))
          .enter().append("g")
            .attr("class", "arc")
            .on("mouseover", function(d) {

              if(d.data.name == "total_pos") {
                songs = data.filter(function(e) { return e.Artist == document.getElementById("input2").value && +e.Sentiment >= 0})
                songs.sort(function(a,b) {return b.Year - a.Year;});
              } else {
                songs = data.filter(function(e) { return e.Artist == document.getElementById("input2").value && +e.Sentiment < 0})
                songs.sort(function(a,b) {return b.Year - a.Year;});
              }
              str = ""
              for (var i = songs.length - 1; i >= 0; i--) {
                str = str + songs[i].Song + " (" + songs[i].Year + ")" + "<br/>"
              };

              svg.append("rect")
                  .attr("class", "modal")
                  .attr("width", width + 13)
                  .attr("height", height + 5)
                  .attr("y", -5)
                  .attr("fill", "#000")
                  .attr("opacity", .85);

              if (document.getElementById("showByYear").checked) {

                x.domain([1965,2015])

                svg.selectAll("dotHighlight")
                    .data(songs)
                .enter().append("circle")
                    .attr("class", "dotHighlight")
                    .attr("r", 4)
                    .attr("cx", function(e) { return x(e.Year); })
                    .attr("cy", function(e) { return y(e.Sentiment); })
                    .attr("fill", function(e) { return z(e.Sentiment); })

              } else if (document.getElementById("showByRank").checked) {

                x.domain([0,100])

                svg.selectAll("dotHighlight")
                    .data(songs)
                .enter().append("circle")
                    .attr("class", "dotHighlight")
                    .attr("r", 4)
                    .attr("cx", function(e) { return x(e.Rank); })
                    .attr("cy", function(e) { return y(e.Sentiment); })
                    .attr("fill", function(e) { return z(e.Sentiment); })

              } else if (document.getElementById("showHeatmap").checked) {

                svg.selectAll("rectHighlight")
                    .data(songs)
                .enter().append("rect")
                    .attr("class", "rectHighlight")
                    .attr("x", function(e) { return xHM(e.Year); })
                    .attr("y", function(e) { return yHM(e.Rank-1); })
                    .attr("width", width / 50)
                    .attr("height",  height / 100)
                    .attr("fill", function(e) { return z(e.Sentiment); })
              }

              tooltip.style("opacity", 1);
              tooltip.html(str)
                .style("left", d3.event.pageX + 5 + "px")
                .style("top", d3.event.pageY + 5 + "px")
            })
            .on("mouseout", function() {
              tooltip.style("opacity", 0)
              svg.selectAll(".modal").remove();
              svg.selectAll(".dotHighlight").remove();
              svg.selectAll(".rectHighlight").remove();
            });

        var path = b.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return (d.data.name == "total_pos") ? "green" : "red"; });

        path.transition()
          .duration(1000)
          .attrTween('d', function(d) {
              var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
              return function(t) {
                  return arc(interpolate(t));
              };
        });

        b.append("text")
            .transition()
            .duration(200)
            .delay(1000)
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".4em")
            .attr("text-anchor", "middle")
            .text(function(d) { if(d.data.percent) {return d.data.percent; } });

        b.append("text")
            .attr("class", "avg")
            .transition()
            .duration(200)
            .delay(1000)
            .attr("dy", ".4em")
            .attr("text-anchor", "middle")
            .attr("fill", function(d) { return z(d.data.avg); })
            .text(function(d) { return d.data.avg; })
    })
});
