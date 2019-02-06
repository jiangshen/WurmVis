// Dimensions
var w = 1000;
var h = 700;
var padding = 30;
var margin = {top: 20, right: 30, bottom: 30, left: 40};

var legendW = 450;
var legendH = 10;

// Sample Size
var sampleSize = 350;

var xmin, ymin, xmax, ymax;

// Scales
var xScale = d3.scaleLinear().rangeRound([padding, w - padding * 2]);	
var yScale = d3.scaleLinear().rangeRound([h - padding, padding]);

// X and Y axis
var xAxis, yAxis;

// Heatmap Color Range
var color = d3.scaleSequential(d3.interpolateBuPu);

// SVG elements
var svg = d3.select("#chart")
	.append("svg")
	.attr("width", w)
    .attr("height", h);

var gradientBar = d3.select("#gradientBar")
    .style("opacity", 0.0);

// Init with sampled data
// d3.json("data/data.json", function(d) {
//     // return [parseFloat(d.x), parseFloat(d.y)];
//     len = d.x.length;
//     myarr = []
//     for (i = 0; i < len; i++) {
//         myarr.push([d.x[i], d.y[i], d.strain[i], d.link[i]]);
//     }
//     console.log(myarr);
//     initChart(myarr); 
// });

//Append a defs (for definition) element to your SVG
var defs = svg.append("defs");

//Append a linearGradient element to the defs and give it a unique id
var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

var gradient_granularity = 50;
for (i=0; i<=gradient_granularity; i++) {
    linearGradient.append("stop")
        .attr("offset", i/gradient_granularity)
        .attr("stop-color", color(i/gradient_granularity));
}

currState = "scatter";
myarr = []

gradientBar.append("rect")
    .attr("class", "legend")
    .attr("width", legendW)
    .attr("height", legendH)
    .style("fill", "url(#linear-gradient)");

// First run
d3.json("data/data1.json", function(d) {
    len = d.data.length;
    for (i = 0; i < len; i++) {
        myarr.push([d.data[i].x, d.data[i].y, d.data[i].strain, d.data[i].link]);
    }
    initChart(myarr);
});

function scatterButtonCall() {
    if (currState == "heatmap") {
        // Remove Heatmap
        d3.select("#heatmap").remove().exit();
        gradientBar.style("opacity", 0.0);

        // Create Scatter
        console.log(myarr);
        createScatter(myarr);
        currState = "scatter";
    }
}

function heatmapButtonCall() {
    if (currState == "scatter") {
        // Remove Scatter Plot
        d3.select("#circles").remove().exit();
        // d3.selectAll("#circles").exit()
        //     .transition()
        //     .duration(500)
        //     .style("opacity", 0).remove();

        // Read in Data and Create heatmap
        d3.csv("data/data2.csv", function(d) {
            d.x = +d.x;
            d.y = +d.y;
            return d;
        }, function(_, all_data) {

            gradientBar.transition()
                .ease(d3.easePoly)
                .duration(750)
                .style("opacity", 1.0);

            createHeatmap(all_data);
            currState = "heatmap";
        });
    }
}

function updateButtonCall() {
    d3.csv("data/data.csv", function(d) {
        return [parseFloat(d.x), parseFloat(d.y)];
    }
    ,function(_, data) {
        data = sample(data, sampleSize);
        updateScatter(data);
    });
}
	
function initChart(dataset) {
    xScale.domain(d3.extent(dataset, function (d) { return d[0]; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d[1]; })).nice();

    xmin = d3.min(dataset, function(d) { return d[0]});
    xmax = d3.max(dataset, function(d) { return d[0]});
    ymin = d3.min(dataset, function(d) { return d[1]});
    ymax = d3.max(dataset, function(d) { return d[1]});

    d3.select("body").select("div.topbar").select("span.data-minmax")
        .text("x-min: " + xmin.toFixed(3) + " x-max: " + xmax.toFixed(3) + " | y-min: " + ymin.toFixed(3) + " y-max: " + ymax.toFixed(3));

    d3.select("body").select("div.topbar").select("span.data-description")
        .text(dataset.length + " Data Points");

    xAxis = d3.axisBottom(xScale).ticks(5);
    yAxis = d3.axisLeft(yScale).ticks(5);

    //Define clipping path
    // svg.append("clipPath") //Make a new clipPath
    //     .attr("id", "chart-area") //Assign an ID
    //     .append("rect") //Within the clipPath, create a new rect
    //     .attr("x", padding) //Set rect's position and size…
    //     .attr("y", padding)
    //     .attr("width", w - padding * 3)
    //     .attr("height", h - padding * 2);

    //Create circles
    svg.append("g") //Create new g
        .attr("id", "circles") //Assign ID of 'circles'
        .attr("clip-path", "url(#chart-area)") //Add reference to clipPath
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", "#3498DB")
        .attr("cx", function(d) {
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            return yScale(d[1]);
        })
        .attr("r", 5)
        .attr("class", function(d) {
            return d[2];
        })
        .on('mouseover', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", 10);
                // .style("fill", "deeppink");
        })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", 5);
            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', '#f44336');
            d3.select("#infobox-xy")
                .text("Select a point to view its information");
                // .style("fill", "#3498DB");
        })
        .on('click', function(d, i) {
            d3.select("#infobox-xy")
                .text("Point (x: " + d[0] + ", y: " + d[1] + ")");
            d3.select("#infobox-strain")
                .text("Strain: " + d[2]);
            d3.select("#infobox-link")
                .html("<iframe width='320' height='240' src='" + d[3] + "&end=200&autoplay=1&fs=0' frameborder='0' allowfullscreen></iframe>");

            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', '#3498DB');
        });

    //Create X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    //Create Y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
}

function createScatter(dataset) {
    xmin = d3.min(dataset, function(d) { return d[0]});
    xmax = d3.max(dataset, function(d) { return d[0]});
    ymin = d3.min(dataset, function(d) { return d[1]});
    ymax = d3.max(dataset, function(d) { return d[1]});

    d3.select("body").select("div.topbar").select("span.data-minmax")
        .text("x-min: " + xmin.toFixed(3) + " x-max: " + xmax.toFixed(3) + " | y-min: " + ymin.toFixed(3) + " y-max: " + ymax.toFixed(3));
    d3.select("body").select("div.topbar").select("span.data-description")
        .text(dataset.length + " Data Points");

    // Update Scale domains
    xScale.domain(d3.extent(dataset, function (d) { return d[0]; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d[1]; })).nice();

    // Update X axis
    svg.select(".x.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(xAxis);

    // Update Y axis
    svg.select(".y.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(yAxis);

    // Create Scatter
    svg.append("g") //Create new g
        .style("opacity", 0.0)
        .attr("id", "circles") //Assign ID of 'circles'
        .attr("clip-path", "url(#chart-area)") //Add reference to clipPath
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", "#3498DB")
        .attr("cx", function(d) {
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            return yScale(d[1]);
        })
        .attr("class", function(d) {
            return d[2];
        })
        .attr("r", 5)
        .on('mouseover', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", 10);
                // .style("fill", "deeppink");
        })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", 5);
            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', '#f44336');
            d3.select("#infobox-xy")
                .text("Select a point to view its information");
                // .style("fill", "#3498DB");
        })
        .on('click', function(d, i) {
            d3.select("#infobox-xy")
                .text("Point (x: " + d[0] + ", y: " + d[1] + ")");
            d3.select("#infobox-strain")
                .text("Strain: " + d[2]);
            d3.select("#infobox-link")
                .html("<iframe width='320' height='240' src='" + d[3] + "&end=200&autoplay=1&fs=0' frameborder='0' allowfullscreen></iframe>");

            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .style('background', '#3498DB');
        });

    d3.select("#circles")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .style("opacity", 1.0);

}

function createHeatmap(all_data) {
    color.domain([0, all_data.length / 30000]); // Points per square pixel.

    xmin = d3.min(all_data, function(d) { return d.x});
    xmax = d3.max(all_data, function(d) { return d.x});
    ymin = d3.min(all_data, function(d) { return d.y});
    ymax = d3.max(all_data, function(d) { return d.y});

    d3.select("body").select("div.topbar").select("span.data-minmax")
        .text("x-min: " + xmin.toFixed(3) + " x-max: " + xmax.toFixed(3) + " | y-min: " + ymin.toFixed(3) + " y-max: " + ymax.toFixed(3));
    d3.select("body").select("div.topbar").select("span.data-description")
        .text(all_data.length + " Data Points");

    // Update Scale domains
    xScale.domain(d3.extent(all_data, function(d) { return d.x;})).nice();
    yScale.domain(d3.extent(all_data, function(d) { return d.y;})).nice();

    // Update X axis
    svg.select(".x.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(xAxis);

    //Update Y axis
    svg.select(".y.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(yAxis);

    svg.insert("g", "g")
        .style("opacity", 0.0)
        .attr("id", "heatmap")
        .attr("fill", "none")
        .attr("stroke", "#5D6D7E")
        .attr("stroke-width", 0.25)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(d3.contourDensity()
            .x(function(d) {
                return xScale(d.x);
            })
            .y(function(d) {
                return yScale(d.y);
            })
            .size([w, h])
            .bandwidth(10)
            (all_data))
        .enter().append("path")
        .attr("fill", function(d) {
            return color(d.value);
        })
        .attr("d", d3.geoPath());

    d3.select("#heatmap")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .style("opacity", 1.0);
}

function updateScatter(dataset) {
    xmin = d3.min(dataset, function(d) { return d[0]});
    xmax = d3.max(dataset, function(d) { return d[0]});
    ymin = d3.min(dataset, function(d) { return d[1]});
    ymax = d3.max(dataset, function(d) { return d[1]});

    d3.select("body").select("div.topbar").select("span.data-minmax")
        .text("x-min: " + xmin.toFixed(3) + " x-max: " + xmax.toFixed(3) + " | y-min: " + ymin.toFixed(3) + " y-max: " + ymax.toFixed(3));

    d3.select("body").select("div.topbar").select("span.data-description")
        .text(dataset.length + " Data Points");

    // Update Scale domains
    xScale.domain(d3.extent(dataset, function (d) { return d[0]; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d[1]; })).nice();

    // Update X axis
    svg.select(".x.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(xAxis);

    // Update Y axis
    svg.select(".y.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(yAxis);

    // Update all circles
    svg.selectAll("circle")
        .data(dataset)
        .transition()
        .ease(d3.easePoly)
        .duration(500)
        .each("start", function() { // <-- Executes at start of transition
            d3.select(this)
            .attr("fill", "deeppink")
            .attr("r", 6.5);
        })
        .attr("cx", function(d) {
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            return yScale(d[1]);
        })
        .each("end", function() { // <-- Executes at end of transition
            d3.select(this)
            .transition()
            .ease(d3.easePoly)
            .duration(250)
            .attr("fill", "#3498DB")
            .attr("r", 5);
        });
}

function n1ButtonCall() {
    clearButtonCall();
    d3.selectAll('.N1')
        .transition()
        .ease(d3.easePoly)
        .duration(250)
        .attr("fill", "#8F5E99")
        .attr("r", 10)
        .transition()
        .attr("r", 5);
}

function n2ButtonCall() {
    clearButtonCall();
    d3.selectAll('.N2')
        .transition()
        .ease(d3.easePoly)
        .duration(250)
        .attr("fill", "#8F5E99")
        .attr("r", 10)
        .transition()
        .attr("r", 5);
}

function clearButtonCall() {
    d3.selectAll('circle')
        .transition()
        .ease(d3.easePoly)
        .duration(250)
        .attr("fill", "#3498DB")
}

function sample(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i --> min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}