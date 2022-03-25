/**
 * Uniformly samples a data array
 * @param {Object[]} arr The data array to be sampled
 * @param {number} size Sampling size
 * @returns {Object[]} The sampled data array
 */
function sample(arr, size) {
    if (size == -1) return arr;
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i --> min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

/**
 * Format data, removing special characters and make it more readable
 * @param {string} s Text to be formatted
 * @returns {string} Formatted string
 */
function formatText(s) {
    s = s.replace(/-/, ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Generates a valid HTML YouTube Video Embed
 * @param {number} w Video Width
 * @param {number} h Video Height
 * @param {string} uid Video ID
 * @param {number} starttime Time the video plays
 * @param {boolean} autoplay Toggle autoplay
 * @param {boolean} fullscreen Toggle fullscreen
 * @returns {string} Generated HTML code
 */
function generateVideoEmbed(w, h, uid, starttime, autoplay, fullscreen) {
    return '<iframe width="' + w +
        '" height="' + h +
        '" src="https://www.youtube.com/embed/' + uid +
        '?start=' + starttime + '&end=' + (starttime + videoDuration) +
        '" frameborder="0" allow="accelerometer; ' + (autoplay ? 'autoplay; ' : '') +
        'encrypted-media; gyroscope; picture-in-picture"' +
        (fullscreen ? ' allowfullscreen' : '') + '></iframe>';
}

/**
 * Outputs a time formatted as percentage
 * @param {number} currtime The current time
 * @param {number} totaltime The total duration
 * @returns {string} Formatted time as percentage
 */
function generateTimePercentage(currtime, totaltime) {
    let p = Math.round(currtime / totaltime * 100);
    if (p < 3) p = 3;
    if (p > 100) p = 100;
    return p + '%';
}