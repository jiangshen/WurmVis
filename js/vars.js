/**
 * Data Path
 */
/* This is the only data input the app needs, load your entire dataset here */
const DATA_PATH = "/data/all.json";

/**
 * Sampling 
*/
/* Change the sample size for the scatter plot */
const SAMPLE_SIZE = 200;
/* Toggle whether the heatmap is displaying a sample of data or not */
const IS_SAMPLING_HEATMAP = true;
/* Change the sample size for the heatmap */
const HEATMAP_SAMPLE_SIZE = 10;
const FILTER_BY_SAMPLED = true;
var all_data;
var sampled_data;
var SAMPLED_XMIN, SAMPLED_XMAX, SAMPLED_YMIN, SAMPLED_YMAX;

/**
 * Dimensions
*/
const w = 1000;
const h = 700;
var padding = 30;
const legendW = 450;
const legendH = 10;
var margin = {top: 20, right: 30, bottom: 30, left: 40};
const PIE_CHART_LENGTH = 320;
const PIE_CHART_PADDING = 10;
const PIE_CHART_OPACITY = 0.8;

const CIRCLE_RADIUS_SMALL = 1.5;
const CIRCLE_RADIUS_NORMAL = 3;
const CIRCLE_RADIUS_HOVER = 5;

/**
 * Colors
*/
const TRANSPARENT_COLOR = "#FFFFFF00";
const RED_COLOR = "#F44336";
const ORANGE_COLOR = "#FF9919";
const SLATE_COLOR = "#5D6D7E"
const BLUE_COLOR = "#3498DB";
const PURPLE_COLOR = "#8F5E99";
const DEEPPINK_COLOR = "#FF1493";

/**
 * Elements
*/
var svg = d3.select('#chart');
var scatter_bar = d3.select('#scatter-bar');
var heatmap_bar = d3.select('#heatmap-bar');
var gradientBar = d3.select('#gradient-bar').style('opacity', 0.0);
var scatterPane = d3.select('#scatter-pane');
var scatterSelectionPane = d3.select('#scatter-selection-pane');
var pieChart = d3.select('#pie-chart');
var colorContainer = d3.select('#colorContainer');

/**
 * Variables
*/
var xmin, ymin, xmax, ymax;
var prev_time_percentage = 0;
var videoDuration = 5;
var currState = 'scatter';
var scatterState = 'full';
var currCircle = null;

/**
 * Dictionaries
 */
var colorCodeToD3 = {
    'C0': d3.interpolateBuPu,
    'C1': d3.interpolateBuGn,
    'C2': d3.interpolateGnBu,
    'C3': d3.interpolateOrRd,
    'C4': d3.interpolatePuBuGn,
    'C5': d3.interpolatePuBu,
    'C6': d3.interpolatePuRd,
    'C7': d3.interpolateRdPu,
    'C8': d3.interpolateYlGnBu,
    'C9': d3.interpolateYlGn,
    'CA': d3.interpolateYlOrBr,
    'CB': d3.interpolateYlOrRd,
    'CC': d3.interpolateBlues,
    'CD': d3.interpolateGreens,
    'CE': d3.interpolateGreys,
    'CF': d3.interpolateOranges,
    'D0': d3.interpolatePurples,
    'D1': d3.interpolateReds,
    'D2': d3.interpolateViridis,
    'D3': d3.interpolateMagma,
    'D4': d3.interpolatePlasma,
    'D5': d3.interpolateWarm,
    'D6': d3.interpolateCool,
    'D7': d3.interpolateRainbow
}

/**
 * D3 Scales
*/
var xScale = d3.scaleLinear().rangeRound([padding, w - padding * 2]);	
var yScale = d3.scaleLinear().rangeRound([h - padding, padding]);

/**
 * D3 X and Y axis
*/
var xAxis, yAxis;

/**
 * Heatmap Color Range
*/
var color = d3.scaleSequential(colorCodeToD3['C0']);

/**
 * Heatmap Contours
*/
var contours = null;

var genderContainer = d3.select("#genderContainer");
var environmentContainer = d3.select("#environmentContainer");
var optogeneticsContainer = d3.select("#optogeneticsContainer");

/**
 * Gradient Definition
*/
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
// TODO how to generate new color here ???