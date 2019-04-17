/* Data Path */
const DATA_PATH = "/data/all.json";

/* Sampling */
const SAMPLE_SIZE = 500;
const HEATMAP_SAMPLE_SIZE = 50000;
const IS_SAMPLING_HEATMAP = true;
const FILTER_BY_SAMPLED = true;
var all_data;
var sampled_data;
var SAMPLED_XMIN, SAMPLED_XMAX, SAMPLED_YMIN, SAMPLED_YMAX;

/* Dimensions */
const w = 1000;
const h = 700;
var padding = 30;
const legendW = 450;
const legendH = 10;
var margin = {top: 20, right: 30, bottom: 30, left: 40};

const CIRCLE_RADIUS_SMALL = 1.5;
const CIRCLE_RADIUS_NORMAL = 3;
const CIRCLE_RADIUS_HOVER = 5;

/* Colors */
const TRANSPARENT_COLOR = "#FFFFFF00";
const RED_COLOR = "#F44336";
const ORANGE_COLOR = "#FF9919";
const SLATE_COLOR = "#5D6D7E"
const BLUE_COLOR = "#3498DB";
const PURPLE_COLOR = "#8F5E99";
const DEEPPINK_COLOR = "#FF1493";

/* Elements */
var svg = d3.select('#chart');
var scatter_bar = d3.select('#scatter-bar');
var gradientBar = d3.select('#gradient-bar').style('opacity', 0.0);

/* Variables */
var xmin, ymin, xmax, ymax;
var prev_time_percentage = 0;
var scatter_bar_width = scatter_bar.style('width').slice(0, -2);
var currState = "scatter";
var currCircle;

/* D3 Scales */
var xScale = d3.scaleLinear().rangeRound([padding, w - padding * 2]);	
var yScale = d3.scaleLinear().rangeRound([h - padding, padding]);

/* D3 X and Y axis */
var xAxis, yAxis;

/* Heatmap Color Range */
var color = d3.scaleSequential(d3.interpolateBuPu);

var genderContainer = d3.select("#genderContainer");
var environmentContainer = d3.select("#environmentContainer");
var optogeneticsContainer = d3.select("#optogeneticsContainer");

/* Gradient Definition */
var defs = svg.append('defs');
var linearGradient = defs.append('linearGradient')
    .attr('id', 'linear-gradient')
    .attr('x1', '0%')
    .attr('y1', '100%')
    .attr('x2', "0%")
    .attr('y2', "0%");
var gradient_granularity = 50;
for (i = 0; i <= gradient_granularity; i++) {
    linearGradient.append('stop')
        .attr('offset', i / gradient_granularity)
        .attr('stop-color', color(i / gradient_granularity));
}