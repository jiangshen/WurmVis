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
    d3.select('#ripple')
        .transition()
        .ease(d3.easePoly)
        .duration(250)
        .style("opacity", 0.0);
    d3.select("#ripple").remove().exit();
    svg.style('display', 'block');
    svg.transition()
        .ease(d3.easePoly)
        .duration(250)
        .style('opacity', 1.0);
    initScatter(sampled_data);
});

function initScatter(dataset) {
    updateMinMax(dataset);

    d3.select('#bottom-bar')
        .transition()
        .ease(d3.easePoly)
        .duration(250)
        .style('height', '20px');

    xScale.domain(d3.extent(dataset, function (d) { return d.x; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d.y; })).nice();
    xAxis = d3.axisBottom(xScale).ticks(5);
    yAxis = d3.axisLeft(yScale).ticks(5);

    /* Create circles */
    svg.append("g")
        .attr("id", "circles")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", TRANSPARENT_COLOR)
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr('r', CIRCLE_RADIUS_NORMAL)
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
                .attr('r', CIRCLE_RADIUS_HOVER);
        })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr('r', CIRCLE_RADIUS_NORMAL);
            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', RED_COLOR);
        })
        .on('click', function(d, i) {
            if (currCircle == null || !(currCircle.attr('cx') == d3.select(this).attr('cx') && currCircle.attr('cy') == d3.select(this).attr('cy'))) {
                d3.select('#infobox-x').text('X | ' + d.x.toFixed(1));
                d3.select('#infobox-y').text('Y | ' + d.y.toFixed(1));
                d3.select('#time-bar')
                    .transition()
                    .ease(d3.easePoly)
                    .duration(750)
                    .style('width', generateTimePercentage(d.t, d.d));
                d3.select('#infobox-gender')
                    .text(formatText(d.g));
                d3.select('#infobox-environment')
                    .text(formatText(d.e));
                d3.select('#infobox-optogenetics')
                    .text(formatText(d.o));
                d3.select('#infobox-link')
                    .html(generateVideoEmbed(320, 240, d.l, Math.round(d.t), true, false));
                d3.select(this)
                    .transition()
                    .ease(d3.easePoly)
                    .duration(250)
                    .attr('r', CIRCLE_RADIUS_HOVER)
                    .attr("stroke", DEEPPINK_COLOR)
                    .attr("stroke-width", 2);
                if (currCircle != null) {
                    currCircle
                        .transition()
                        .ease(d3.easePoly)
                        .duration(200)
                        .attr("stroke", BLUE_COLOR)
                        .attr("stroke-width", 1)
                        .attr('r', CIRCLE_RADIUS_SMALL)
                        .transition()
                        .attr('r', CIRCLE_RADIUS_NORMAL)
                }

                d3.select("#infobox-top")
                    .transition()
                    .ease(d3.easePoly)
                    .duration(300)
                    .style('background', BLUE_COLOR);

                currCircle = d3.select(this);
            }  
        });

    /* Create x-axis */
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    /* Create y-axis */
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
}

function redrawScatter(dataset) {
    updateMinMax(dataset);

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
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", TRANSPARENT_COLOR)
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("class", function(d) { return d.strain; })
        .attr('r', CIRCLE_RADIUS_NORMAL)
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
                .attr('r', CIRCLE_RADIUS_HOVER);
        })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .transition()
                .ease(d3.easePoly)
                .duration(250)
                .attr('r', CIRCLE_RADIUS_NORMAL);
            d3.select("#infobox-top")
                .transition()
                .ease(d3.easePoly)
                .duration(300)
                .style('background', RED_COLOR);
        })
        .on('click', function(d, i) {
            if (currCircle == null || !(currCircle.attr('cx') == d3.select(this).attr('cx') && currCircle.attr('cy') == d3.select(this).attr('cy'))) {
                d3.select('#infobox-x').text('X | ' + d.x.toFixed(1));
                d3.select('#infobox-y').text('Y | ' + d.y.toFixed(1));
                d3.select('#time-bar')
                    .transition()
                    .ease(d3.easePoly)
                    .duration(750)
                    .style('width', generateTimePercentage(d.t, d.d));
                d3.select('#infobox-gender')
                    .text(formatText(d.g));
                d3.select('#infobox-environment')
                    .text(formatText(d.e));
                d3.select('#infobox-optogenetics')
                    .text(formatText(d.o));
                d3.select('#infobox-link')
                    .html(generateVideoEmbed(320, 240, d.l, Math.round(d.t), true, false));
                d3.select(this)
                    .transition()
                    .ease(d3.easePoly)
                    .duration(250)
                    .attr('r', CIRCLE_RADIUS_HOVER)
                    .attr("stroke", DEEPPINK_COLOR)
                    .attr("stroke-width", 2);
                if (currCircle != null) {
                    currCircle
                        .transition()
                        .ease(d3.easePoly)
                        .duration(200)
                        .attr("stroke", BLUE_COLOR)
                        .attr("stroke-width", 1)
                        .attr('r', CIRCLE_RADIUS_SMALL)
                        .transition()
                        .attr('r', CIRCLE_RADIUS_NORMAL)
                }

                d3.select("#infobox-top")
                    .transition()
                    .ease(d3.easePoly)
                    .duration(300)
                    .style('background', BLUE_COLOR);

                currCircle = d3.select(this);
            }
        });

    d3.select('#circles')
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .style("opacity", 1.0);
}

function redrawHeatmap(dataset) {
    /* Filter based on sampled data */
    if (FILTER_BY_SAMPLED) {
        dataset = dataset.filter(function(d) {
            if (d.x >= SAMPLED_XMIN && d.x <= SAMPLED_XMAX && d.y >= SAMPLED_YMIN && d.y <= SAMPLED_YMAX) return d;
        })
    };

    /* Color Domain in points per square pixel */
    color.domain([0, dataset.length / 30000]); // 50 looks pretty good

    updateMinMax(dataset);

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
    updateMinMax(dataset)

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
            .attr('r', CIRCLE_RADIUS_HOVER);
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
            .attr('r', CIRCLE_RADIUS_NORMAL)
            .attr("stroke", BLUE_COLOR)
        })
        .attr("class", function(d) {
            return d.g + ' ' + d.e + ' ' + d.o; 
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

function updateMinMax(dataset) {
    xmin = d3.min(dataset, function (d) { return d.x; });
    xmax = d3.max(dataset, function (d) { return d.x; });
    ymin = d3.min(dataset, function (d) { return d.y; });
    ymax = d3.max(dataset, function (d) { return d.y; });
    
    d3.select('#data-points').text(dataset.length + ' Data Points');
    d3.select('#x-min').html('x<sub>min</sub> : ' + xmin.toFixed(3));
    d3.select('#x-max').html('x<sub>max</sub> : ' + xmax.toFixed(3));
    d3.select('#y-min').html('y<sub>min</sub> : ' + ymin.toFixed(3));
    d3.select('#y-max').html('y<sub>max</sub> : ' + ymax.toFixed(3));
}

function rollUpInfoBox() {
    d3.select('#infobox-top')
        .transition()
        .ease(d3.easePoly)
        .duration(300)
        .style('height', '60px');
    d3.select('#infobox')
        .transition()
        .ease(d3.easePoly)
        .duration(150)
        .style('height', '60px');
}

function rollDownInfoBox() {
    d3.select('#infobox-top')
        .transition()
        .ease(d3.easePoly)
        .duration(450)
        .style('height', '125px');
    d3.select('#infobox')
        .transition()
        .ease(d3.easePoly)
        .duration(150)
        .style('height', '582px');
}

function refreshInfoBox(fn) {
    d3.select('#infobox-top')
        .transition()
        .ease(d3.easePoly)
        .duration(650)
        .style('height', '60px')
        .on('end', function() {
            fn();
            rollDownInfoBox();
        });
    d3.select('#infobox')
        .transition()
        .ease(d3.easePoly)
        .duration(150)
        .style('height', '60px');
}

function displayScatterSelectionInfo() {
    scatterPane.classed('hidden', true);
    scatterSelectionPane.classed('hidden', false);
}

function displayScatterInfo() {
    scatterPane.classed('hidden', false);
    scatterSelectionPane.classed('hidden', true);
}