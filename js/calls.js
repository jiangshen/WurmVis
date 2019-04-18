function scatterButtonCall() {
    if (currState == "heatmap") {
        /* Remove Heatmap and add in Scatter Bar */
        d3.select("#heatmap").remove().exit();
        gradientBar.style("opacity", 0.0);
        toggleScatterBar('scatter');
        
        d3.select("#scatter-text")
            .style("font-weight", "bold")
            .style("font-variant", "small-caps")
            .text("\u2714 Scatter");
        d3.select("#heatmap-text")
            .style("font-weight", "normal")
            .style("font-variant", "normal")
            .text("Heatmap");

        redrawScatter(sampled_data);
        currState = "scatter";
    }
}

function heatmapButtonCall() {
    if (currState == "scatter") {
        /* Remove Scatter Plot and Scatter Bar */
        toggleScatterBar('heatmap');
        d3.select("#circles").remove().exit();
        // d3.selectAll("#circles").exit().transition().duration(500).style("opacity", 0).remove();
        d3.select("#heatmap-text")
            .style("font-weight", "bold")
            .style("font-variant", "small-caps")
            .text("\u2714 Heatmap");
        d3.select("#scatter-text")
            .style("font-weight", "normal")
            .style("font-variant", "normal")
            .text("Scatter");

        d3.select("#topbar_line")
            .append('svg')
            .attr("fill", ORANGE_COLOR);
        gradientBar.transition()
            .ease(d3.easePoly)
            .duration(750)
            .style("opacity", 1.0);

        if (IS_SAMPLING_HEATMAP) {
            redrawHeatmap(sampled_data);
        } else {
            redrawHeatmap(all_data);
        }
        currState = "heatmap";
    }
}

function updateButtonCall() {
    if (currState == "scatter") {
        sampled_data = sample(all_data, SAMPLE_SIZE);

        SAMPLED_XMIN = d3.min(sampled_data, function(d) { return d.x });
        SAMPLED_XMAX = d3.max(sampled_data, function(d) { return d.x });
        SAMPLED_YMIN = d3.min(sampled_data, function(d) { return d.y });
        SAMPLED_YMAX = d3.max(sampled_data, function(d) { return d.y });

        updateScatter(sampled_data);
    }
}

function selectionCall() {
    var g = genderContainer.property('value');
    var e = environmentContainer.property('value');
    var o = optogeneticsContainer.property('value');

    g = g == 'none' ? '' : '.' + g;
    e = e == 'none' ? '' : '.' + e;
    o = o == 'none' ? '' : '.' + o;
    var selection = g + e + o;

    if (selection != '') {
        d3.selectAll('circle')
            .transition()
            .ease(d3.easePoly)
            .duration(200)
            .attr("stroke", BLUE_COLOR)
            .attr("stroke-width", 1)
            .attr("r", CIRCLE_RADIUS_SMALL)
            .transition()
            .attr("r", CIRCLE_RADIUS_NORMAL);

        var selected = d3.selectAll(selection);
        var size = selected.size();
        selected.transition()
            .ease(d3.easePoly)
            .duration(200)
            .attr("stroke", PURPLE_COLOR)
            .attr("stroke-width", 2)
            .attr("r", CIRCLE_RADIUS_HOVER)
            .transition()
            .attr("r", CIRCLE_RADIUS_NORMAL);
                    
        // alert("Selected: " + selection + ". This is " + size/SAMPLE_SIZE * 100 + "% of the population");

    } else {
        alert('Please pick at least one attribute');
    }
}

/**
 * Clears Scatterplot selection
 */
function clearButtonCall() {
    genderContainer.node().selectedIndex = 0;
    environmentContainer.node().selectedIndex = 0;
    optogeneticsContainer.node().selectedIndex = 0;
    d3.select('#infobox-x').text('X | 0.0');
    d3.select('#infobox-y').text('Y | 0.0');
    d3.select('#time-bar')
        .transition()
        .ease(d3.easePoly)
        .duration(750)
        .style('width', '0%');
    d3.selectAll('#infobox-gender, #infobox-environment, #infobox-optogenetics').text('None');
    d3.select('#infobox-link').text('Video');
    d3.selectAll('circle')
        .transition()
        .ease(d3.easePoly)
        .duration(200)
        .attr("stroke", BLUE_COLOR)
        .attr("stroke-width", 1)
        .attr("r", CIRCLE_RADIUS_SMALL)
        .transition()
        .attr("r", CIRCLE_RADIUS_NORMAL);
}