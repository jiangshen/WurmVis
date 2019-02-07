/* Paths */
const SCATTER_PATH = "/data/data.json";
const HEATMAP_PATH = "/data/data2.csv";

/* Dimensions */
const w = 1000;
const h = 700;
var padding = 30;
const legendW = 450;
const legendH = 10;
var margin = {top: 20, right: 30, bottom: 30, left: 40};

/* Colors */
const RED_COLOR = "#F44336";
const ORANGE_COLOR = "#FF9919";
const SLATE_COLOR = "#5D6D7E"
const BLUE_COLOR = "#3498DB";
const PURPLE_COLOR = "#8F5E99";

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

/* Elements */
var svg = d3.select("#chart")
	.append("svg")
	.attr("width", w)
    .attr("height", h);

var strainContainer = d3.select("#strainContainer");

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