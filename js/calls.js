function scatterButtonCall() {
    if (currState == "heatmap") {
        /* Remove Heatmap */
        d3.select("#heatmap").remove().exit();
        gradientBar.style("opacity", 0.0);

        /* Create Scatter */
        d3.json(SCATTER_PATH, function(d) {
            createScatter(d.data);
        });
        currState = "scatter";
    }
}

function heatmapButtonCall() {
    if (currState == "scatter") {
        /* Remove Scatter Plot */
        d3.select("#circles").remove().exit();
        // d3.selectAll("#circles").exit().transition().duration(500).style("opacity", 0).remove();

        /* Read in Data and Create heatmap */
        d3.csv(HEATMAP_PATH, function(d) {
            d.forEach(function(d) {
                d['x'] = +d.x;
                d['y'] = +d.y;
            });
            gradientBar.transition()
                .ease(d3.easePoly)
                .duration(750)
                .style("opacity", 1.0);
            createHeatmap(d);
            currState = "heatmap";
        });
    }
}

function updateButtonCall() {
    d3.csv("data/data.csv", function(d) {
        d.forEach(function(d) {
            d['x'] = +d.x;
            d['y'] = +d.y;
        });
        d = sample(d, sampleSize);
        updateScatter(d);
    });
}

function strainButtonCall(strain) {
    d3.selectAll('circle')
        .transition()
        .ease(d3.easePoly)
        .duration(200)
        .attr("fill", BLUE_COLOR);

    d3.selectAll('.' + strain)
        .transition()
        .ease(d3.easePoly)
        .duration(200)
        .attr("fill", PURPLE_COLOR)
        .attr("r", 8)
        .transition()
        .attr("r", 5);
}

function clearButtonCall() {
    d3.selectAll('circle')
        .transition()
        .ease(d3.easePoly)
        .duration(200)
        .attr("fill", BLUE_COLOR)
        .attr("r", 8)
        .transition()
        .attr("r", 5);
}