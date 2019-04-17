var currState = "scatter";

gradientBar.append("rect")
    .attr("class", "legend")
    .attr("width", legendW)
    .attr("height", legendH)
    .style("fill", "url(#linear-gradient)");

/* Init with scatterplot */
d3.json(DATA_PATH, function(d) {

    /**
     * Takes Strain info 
     */
    // d3.map(d.data, function(d){ return d.strain; }).keys().forEach(strain => {
    //     strainContainer.append("button")
    //         .attr("class", "button button_violet")
    //         .attr("onclick", "strainButtonCall('" + strain + "')")
    //         .text(strain);
    // });

    // !! Temp D3 Getting Strain Distributions
    // var strainCount = d3.nest()
    //     .key(function(d) {return d.strain;})
    //     .rollup(function(v) {return v.length;})
    //     .entries(d.data);
    // console.log(strainCount);
    // initChart(d.data);
    all_data = d;
    sampled_data = sample(d, SAMPLE_SIZE);

    /** 
     *  Takes Gender, Environment and Optogenetics info
     */
    d3.map(sampled_data, function(d){ return d.g; }).keys().forEach(gender => {
        genderContainer.append("option")
            .attr("value", gender)
            .text(formatText(gender));
    });
    d3.map(sampled_data, function(d){ return d.e; }).keys().forEach(environment => {
        environmentContainer.append("option")
            .attr("value", environment)
            .text(formatText(environment));
    });
    d3.map(sampled_data, function(d){ return d.o; }).keys().forEach(optogenetics => {
        optogeneticsContainer.append("option")
            .attr("value", optogenetics)
            .text(formatText(optogenetics));
    });

    SAMPLED_XMIN = d3.min(sampled_data, function(d) { return d.x });
    SAMPLED_XMAX = d3.max(sampled_data, function(d) { return d.x });
    SAMPLED_YMIN = d3.min(sampled_data, function(d) { return d.y });
    SAMPLED_YMAX = d3.max(sampled_data, function(d) { return d.y });
    initChart(sampled_data);
    d3.select("#ripple")
        .transition()
        .ease(d3.easePoly)
        .duration(250)
        .style("opacity", 0.0);
});
	
function initChart(dataset) {
    xScale.domain(d3.extent(dataset, function (d) { return d.x; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d.y; })).nice();

    xmin = d3.min(dataset, function(d) { return d.x });
    xmax = d3.max(dataset, function(d) { return d.x });
    ymin = d3.min(dataset, function(d) { return d.y });
    ymax = d3.max(dataset, function(d) { return d.y });

    d3.select("body").select("div.topbar").select("span.data-minmax")
        .text("x-min: " + xmin.toFixed(3) + " x-max: " + xmax.toFixed(3) + " | y-min: " + ymin.toFixed(3) + " y-max: " + ymax.toFixed(3));

    d3.select("body").select("div.topbar").select("span.data-description")
        .text(dataset.length + " Data Points | ");

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
        .attr("id", "circles")
        .attr("clip-path", "url(#chart-area)") //Add reference to clipPath
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", TRANSPARENT_COLOR)
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("r", CIRCLE_RADIUS_NORMAL)
        .attr("stroke", BLUE_COLOR)
        .attr("stroke-width", 1)
        .attr("class", function(d) { 
            return d.g + ' ' + d.e + ' ' + d.o; 
        })
        .on('mouseover', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", CIRCLE_RADIUS_HOVER);
                // .style("fill", "deeppink");
        })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", CIRCLE_RADIUS_NORMAL);
            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', '#f44336');
            d3.select("#infobox-xy")
                .text("Select a point to view its information");
                // .style("fill", BLUE_COLOR);
        })
        .on('click', function(d, i) {
            d3.select("#infobox-xy")
                .text("Point (x: " + d.x.toFixed(3) + ", y: " + d.y.toFixed(3) + ")");

            d3.select('#time-bar')
                .transition()
                .ease(d3.easePoly)
                .duration(750)
                .style('width', Math.round(d.t / d.d * 100) + '%');

            d3.select("#infobox-gender")
                .text("Gender: " + formatText(d.g));
            d3.select("#infobox-environment")
                .text("Environment: " + formatText(d.e));
            d3.select("#infobox-optogenetics")
                .text("Optogenetics: " + formatText(d.o));
            d3.select("#infobox-link")
                .html(generateVideoEmbed(320, 240, '9erGdxmvquI', d.t, true, false));
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", CIRCLE_RADIUS_HOVER)
                .attr("stroke", DEEPPINK_COLOR)
                .attr("stroke-width", 2);
            
            // alert(d.t / d.d);

            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', BLUE_COLOR);
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
    xmin = d3.min(dataset, function(d) { return d.x });
    xmax = d3.max(dataset, function(d) { return d.x });
    ymin = d3.min(dataset, function(d) { return d.y });
    ymax = d3.max(dataset, function(d) { return d.y });

    d3.select("body").select("div.topbar").select("span.data-minmax")
        .text("x-min: " + xmin.toFixed(3) + " x-max: " + xmax.toFixed(3) + " | y-min: " + ymin.toFixed(3) + " y-max: " + ymax.toFixed(3));
    d3.select("body").select("div.topbar").select("span.data-description")
        .text(dataset.length + " Data Points | ");

    // Update Scale domains
    xScale.domain(d3.extent(dataset, function (d) { return d.x; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d.y; })).nice();

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
    svg.append("g")
        .style("opacity", 0.0)
        .attr("id", "circles")
        .attr("clip-path", "url(#chart-area)") //Add reference to clipPath
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", TRANSPARENT_COLOR)
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("class", function(d) { return d.strain; })
        .attr("r", CIRCLE_RADIUS_NORMAL)
        .attr("stroke", BLUE_COLOR)
        .attr("stroke-width", 1)
        .on('mouseover', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", CIRCLE_RADIUS_HOVER);
        })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr("r", CIRCLE_RADIUS_NORMAL);
            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', '#f44336');
            d3.select("#infobox-xy")
                .text("Select a point to view its information");
                // .style("fill", BLUE_COLOR);
        })
        .on('click', function(d, i) {
            d3.select("#infobox-xy")
                .text("Point (x: " + d.x.toFixed(3) + ", y: " + d.y.toFixed(3) + ")");
            d3.select("#infobox-time")
                .text("Time: " + d.t);
            d3.select("#infobox-gender")
                .text("Gender: " + d.g);
            d3.select("#infobox-environment")
                .text("Environment: " + d.e);
            d3.select("#infobox-optogenetics")
                .text("Optogenetics: " + d.o);
            d3.select("#infobox-link")
                .html("<iframe width='320' height='240' src='" + d.l + "&end=200&autoplay=1&fs=0' frameborder='0' allowfullscreen></iframe>");

            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', BLUE_COLOR);
        });

    d3.select("#circles")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .style("opacity", 1.0);

}

function createHeatmap(dataset) {
    /* Filter based on sampled data */
    if (FILTER_BY_SAMPLED) {
        dataset = dataset.filter(function(d) {
            if (d.x >= SAMPLED_XMIN && d.x <= SAMPLED_XMAX && d.y >= SAMPLED_YMIN && d.y <= SAMPLED_YMAX) return d;
        })
    };

    /* Color Domain */
    color.domain([0, dataset.length / 30000]); // Points per square pixel.

    xmin = d3.min(dataset, function(d) { return d.x});
    xmax = d3.max(dataset, function(d) { return d.x});
    ymin = d3.min(dataset, function(d) { return d.y});
    ymax = d3.max(dataset, function(d) { return d.y});

    d3.select("body").select("div.topbar").select("span.data-minmax")
        .text("x-min: " + xmin.toFixed(3) + " x-max: " + xmax.toFixed(3) + " | y-min: " + ymin.toFixed(3) + " y-max: " + ymax.toFixed(3));
    d3.select("body").select("div.topbar").select("span.data-description")
        .text(dataset.length + " Data Points | ");

    // Update Scale domains
    xScale.domain(d3.extent(dataset, function(d) { return d.x;})).nice();
    yScale.domain(d3.extent(dataset, function(d) { return d.y;})).nice();

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
        .attr("stroke", SLATE_COLOR)
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
            (dataset))
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
    xmin = d3.min(dataset, function(d) { return d.x });
    xmax = d3.max(dataset, function(d) { return d.x });
    ymin = d3.min(dataset, function(d) { return d.y });
    ymax = d3.max(dataset, function(d) { return d.y });

    d3.select("body").select("div.topbar").select("span.data-minmax")
        .text("x-min: " + xmin.toFixed(3) + " x-max: " + xmax.toFixed(3) + " | y-min: " + ymin.toFixed(3) + " y-max: " + ymax.toFixed(3));

    d3.select("body").select("div.topbar").select("span.data-description")
        .text(dataset.length + " Data Points | ");

    // Update Scale domains
    xScale.domain(d3.extent(dataset, function (d) { return d.x; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d.y; })).nice();

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
        .on("start", function() {
            d3.select(this)
            .attr("stroke", "deeppink")
            .attr("r", CIRCLE_RADIUS_HOVER);
        })
        .attr("cx", function(d) {
            return xScale(d.x);
        })
        .attr("cy", function(d) {
            return yScale(d.y);
        })
        .on("end", function() {
            d3.select(this)
            .transition()
            .ease(d3.easePoly)
            .duration(350)
            .attr("r", CIRCLE_RADIUS_NORMAL)
            .attr("stroke", BLUE_COLOR)
        });
}

function toggleScatterBar(dst_state) {
    if (dst_state == 'heatmap') {
        scatter_bar
            .transition()
            .ease(d3.easePoly)
            .duration(750)
            .style('width', '0px');  
    } else {
        scatter_bar
            .transition()
            .ease(d3.easePoly)
            .duration(750)
            .style('width', scatter_bar_width)
            .attr('display', 'none');
    }
}