/**
 * Data Path
 */
/* This is the only data input the app needs, load your entire dataset here */
const DATA_PATH = "/data/smaller.json";

/**
 * Sampling 
*/
/* Change the sample size */
const SAMPLE_SIZE = 350;
/* Toggle whether the heatmap is displaying a sample of data or not */
const IS_SAMPLING_HEATMAP = false;
/* Toggle whether the heatmap is filtering data bounds by a sample */
const FILTER_BY_SAMPLED = true;

/**
 * Dimensions
*/
const w = 1000;
const h = 700;
const padding = 30;
const gpadding = 8;
const margin = {top: 20, right: 30, bottom: 30, left: 40};
const PIE_CHART_LENGTH = 318;
const PIE_CHART_PADDING = 8
;
const PIE_CHART_OPACITY = 0.8;
const CIRCLE_RADIUS_SMALL = 1.5;
const CIRCLE_RADIUS_NORMAL = 3;
const CIRCLE_RADIUS_HOVER = 5;

/**
 * Animation Duration
 */
const ANIM_TIME_SHORT = 250;
const ANIM_TIME_MEDIUM = 500;
const ANIM_TIME_LONG = 750;

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
 * Dictionaries
 */
const colorCodeToD3 = {
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
 * Elements
*/
var svg = d3.select('#chart');
var gAxisSvg = d3.select('#gradient-axis').style("opacity", 0.0);
var scatter_bar = d3.select('#scatter-bar');
var heatmap_bar = d3.select('#heatmap-bar');
var gradientBar = d3.select('#gradient-bar').style('opacity', 0.0);
var scatterPane = d3.select('#scatter-pane');
var scatterSelectionPane = d3.select('#scatter-selection-pane');
var bubbleGender = d3.select('#bubble-gender');
var bubbleEnvironment = d3.select('#bubble-environment');
var bubbleOptogenetics = d3.select('#bubble-optogenetics');
var pieChart = d3.select('#pie-chart');
var colorContainer = d3.select('#colorContainer');
var genderContainer = d3.select("#genderContainer");
var environmentContainer = d3.select("#environmentContainer");
var optogeneticsContainer = d3.select("#optogeneticsContainer");

/**
 * Variables
*/
var all_data;
var sampled_data;
var xmin, ymin, xmax, ymax;
var SAMPLED_XMIN, SAMPLED_XMAX, SAMPLED_YMIN, SAMPLED_YMAX;
var prev_time_percentage = 0;
var videoDuration = 5;
var currState = 'scatter';
var scatterState = 'full';
var currCircle = null;
var QUICK_SWITCH_MODE = false;
var gradient_granularity = 10;
var gradientScale = d3.scaleLinear().domain([0, 1]).range([0, 1]);
var GRADIENT_STOPS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

/**
 * D3 Scales
*/
var xScale = d3.scaleLinear().rangeRound([padding, w - padding * 2]);	
var yScale = d3.scaleLinear().rangeRound([h - padding, padding]);
var gScale = d3.scaleLinear().range([h / 2 - gpadding, gpadding])

/**
 * D3 Axes
*/
var xAxis, yAxis, gAxis;

/**
 * Heatmap Color Range
*/
var color = d3.scaleSequential(colorCodeToD3['C0']);

/**
 * Heatmap Contours
*/
var contours = null;

/**
 * Gradient Definition
*/
var defs = svg.append('defs');
createGradient();

/**
 * Create gradient based on selected color map
 */
function createGradient() {
    var linearGradient = defs.append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', "0%")
        .attr('y2', "0%");
    for (i = 0; i <= gradient_granularity; i++) {
        linearGradient.append('stop')
            .attr('offset', GRADIENT_STOPS[i])
            .attr('stop-color', color(gradientScale(GRADIENT_STOPS[i])));
    }
}