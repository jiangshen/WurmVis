/* Paths */
const SCATTER_PATH = "/data/data1.json";
const HEATMAP_PATH = "/data/data2.csv";

/* Dimensions */
const w = 1000;
const h = 700;
var padding = 30;
const legendW = 450;
const legendH = 10;
var margin = {top: 20, right: 30, bottom: 30, left: 40};

// Sample Size
var sampleSize = 350;

var xmin, ymin, xmax, ymax;

/* D3 Scales */
var xScale = d3.scaleLinear().rangeRound([padding, w - padding * 2]);	
var yScale = d3.scaleLinear().rangeRound([h - padding, padding]);

/* D3 X and Y axis */
var xAxis, yAxis;

/* Heatmap Color Range */
var color = d3.scaleSequential(d3.interpolateBuPu);

/* SVG elements */
var svg = d3.select("#chart")
	.append("svg")
	.attr("width", w)
    .attr("height", h);

var gradientBar = d3.select("#gradientBar")
    .style("opacity", 0.0);

/* Gradient Definition */

var defs = svg.append("defs");
var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

var gradient_granularity = 50;
for (i = 0; i <= gradient_granularity; i++) {
    linearGradient.append("stop")
        .attr("offset", i / gradient_granularity)
        .attr("stop-color", color(i / gradient_granularity));
}