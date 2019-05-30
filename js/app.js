/* Init with scatterplot */
d3.json(DATA_PATH, function(d) {

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

/**
 * Initializes the scatterplot with given data
 * @param {Object[]} dataset The data array
 */
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
                // if (scatterState == 'selection') {
                //     genderContainer.node().selectedIndex = 0;
                //     environmentContainer.node().selectedIndex = 0;
                //     optogeneticsContainer.node().selectedIndex = 0;
                //     refreshInfoBox(displayScatterInfo);
                //     d3.selectAll('circle')
                //         .transition()
                //         .ease(d3.easePoly)
                //         .duration(200)
                //         .attr("stroke", BLUE_COLOR)
                //         .attr("stroke-width", 1)
                //         .attr("r", CIRCLE_RADIUS_SMALL)
                //         .transition()
                //         .attr("r", CIRCLE_RADIUS_NORMAL);
                //     scatterState = 'full';
                // }
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

/**
 * Updates the scatterplot with new data
 * @param {Object[]} dataset The data array
 */
function redrawScatter(dataset) {
    updateMinMax(dataset);

    /* Update Scale domains */
    xScale.domain(d3.extent(dataset, function (d) { return d.x; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d.y; })).nice();

    /* Update X axis */
    svg.select(".x.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(xAxis);

    /* Update Y axis */
    svg.select(".y.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(yAxis);

    /* Create Scatter */
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

/**
 * Updates heatmap with given data
 * @param {Object[]} dataset The data array
 */
function redrawHeatmap(dataset) {
    /* Filter based on sampled data */
    if (FILTER_BY_SAMPLED) {
        dataset = dataset.filter(function(d) {
            if (d.x >= SAMPLED_XMIN && d.x <= SAMPLED_XMAX && d.y >= SAMPLED_YMIN && d.y <= SAMPLED_YMAX) return d;
        })
    };

    /** 
     * Generate List of Contours
     * For loading efficiency only generate contours if they will be new, cases include
     *  - This is the first time generating contours
     *  - New sample requested and FILTER_BY_SAMPLED is ON
     */
    if (contours == null || (FILTER_BY_SAMPLED && !QUICK_SWITCH_MODE)) {
        contours = d3.contourDensity()
            .x(function(d) {
                return xScale(d.x);
            })
            .y(function(d) {
                return yScale(d.y);
            })
        .size([w, h])
        .bandwidth(10)
        (dataset);
    }
    
    /**
     * Color Domain in points per square pixel
     * Mapping extent from all the discrete contours generated by D3 Contour Density
     */
    color.domain(d3.extent(contours.map(function(i) { return i.value; })));

    /* Update Min and Max display values on the screen */
    updateMinMax(dataset);

    /* Update Scale domains */
    xScale.domain(d3.extent(dataset, function(d) { return d.x;})).nice();
    yScale.domain(d3.extent(dataset, function(d) { return d.y;})).nice();

    /* Update X axis */
    svg.select(".x.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(xAxis);

    /* Update Y axis */
    svg.select(".y.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(yAxis);

    /* Draw the contours on the screen */
    svg.insert("g", "g")
        .style("opacity", 0.0)
        .attr("id", "heatmap")
        .attr("fill", "none")
        .attr("stroke", SLATE_COLOR)
        .attr("stroke-width", 0.25)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(contours)
        .enter().append("path")
        .attr("fill", function(d) {
            return color(d.value);
        })
        .attr("d", d3.geoPath());

    /* Heatmap transition */
    d3.select("#heatmap")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .style("opacity", 1.0);
}

function recolorHeatmap() {
     /**
     * Color Domain in points per square pixel
     * Mapping extent from all the discrete contours generated by D3 Contour Density
     */
    color.domain(d3.extent(contours.map(function(i) { return i.value; })));
    
    /* Draw the contours on the screen */
    svg.insert("g", "g")
        .style("opacity", 0.0)
        .attr("id", "heatmap")
        .attr("fill", "none")
        .attr("stroke", SLATE_COLOR)
        .attr("stroke-width", 0.25)
        .attr("stroke-linejoin", "round")
        .selectAll("path")
        .data(contours)
        .enter().append("path")
        .attr("fill", function(d) {
            return color(d.value);
        })
        .attr("d", d3.geoPath());

    /* Heatmap transition */
    d3.select("#heatmap")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .style("opacity", 1.0);
}

/**
 * Updates the scatterplot with new data
 * @param {Object[]} dataset The data array
 */
function updateScatter(dataset) {
    updateMinMax(dataset)

    /* Update Scale domains */
    xScale.domain(d3.extent(dataset, function (d) { return d.x; })).nice();
    yScale.domain(d3.extent(dataset, function (d) { return d.y; })).nice();

    /* Update X axis */
    svg.select(".x.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(xAxis);

    /* Update Y axis */
    svg.select(".y.axis")
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .call(yAxis);

    /* Update all circles and animate them across the screen */
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

/**
 * Toggles the scatter toolbar ON and OFF
 * @param {boolean} dst_state State of the screen whether it's Scatter or Heatmap 
 */
function toggleScatterBar(dst_state) {
    if (dst_state == 'heatmap') {
        scatter_bar.transition()
            .ease(d3.easePoly)
            .duration(500)
            .style('opacity', 0);
        scatter_bar.style('display', 'none');
        heatmap_bar.style('display', 'flex');
        heatmap_bar.transition() 
            .ease(d3.easePoly)
            .duration(500)
            .style('opacity', 1);
    } else {
        heatmap_bar.transition()
            .ease(d3.easePoly)
            .duration(500)
            .style('opacity', 0);
        heatmap_bar.style('display', 'none');
        scatter_bar.style('display', 'flex');
        scatter_bar.transition()
            .ease(d3.easePoly)
            .duration(500)
            .style('opacity', 1);
    }
}

/**
 * Drawns a pie chart on the screen
 * @param {number} a % selected
 * @param {number} b % of the rest of the data
 */
function drawPie(a, b) {
    /* Remove any previous children */
    pieChart.selectAll("*").remove();

    let radius = Math.min(PIE_CHART_LENGTH - PIE_CHART_PADDING, PIE_CHART_LENGTH - PIE_CHART_PADDING) / 2;
    let arc = d3.arc().innerRadius(0).outerRadius(radius);
    let c = d3.scaleOrdinal(d3.schemeCategory10);

    var g = pieChart.append('g').attr('transform', 'translate(' + (PIE_CHART_LENGTH / 2) + ',' + (PIE_CHART_LENGTH / 2) + ')');
    var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    var data = [
        {name: "Selected", value: a},
        {name: "Rest", value: b},
    ];
    
    var path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")  
        .append('path')
        .attr('d', arc)
        .attr('fill', (d,i) => c(i))
        .style('opacity', PIE_CHART_OPACITY)
        .style('stroke', 'white')
        .on("mouseover", function(d) {
            d3.selectAll('path')
              .style("opacity", PIE_CHART_OPACITY);
            d3.select(this) 
              .style("opacity", 1);
      
            let g = pieChart
              .style("cursor", "pointer")
              .append("g")
              .attr("class", "tooltip")
              .style("opacity", 0);
       
            g.append("text")
              .attr("class", "name-text")
              .text(`${d.data.name} (${d.data.value})`)
              .attr('text-anchor', 'middle');
          
            let text = g.select("text");
            let bbox = text.node().getBBox();
            let padding = 2;
            g.insert("rect", "text")
              .attr("x", bbox.x - padding)
              .attr("y", bbox.y - padding)
              .attr("width", bbox.width + (padding*2))
              .attr("height", bbox.height + (padding*2))
              .style("fill", "white")
              .style("opacity", 0.75);
          })
}

/**
 * Updates the Min and Max values on the screen based on the data
 * @param {Object[]} dataset The selected data array
 */
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

/**
 * Animation that rolls up the information box
 */
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

/**
 * Animation that rolls down the information box
 */
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