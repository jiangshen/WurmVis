/**
 * Uniformly samples a data array
 * @param {Object[]} arr The data array to be sampled
 * @param {number} size Sampling size
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
 */
function generateVideoEmbed(w, h, uid, starttime, autoplay, fullscreen) {
    return '<iframe width="' + w +
        '" height="' + h +
        '" src="https://www.youtube.com/embed/' + uid +
        '?start=' + starttime +
        '" frameborder="0" allow="accelerometer; ' + (autoplay ? 'autoplay; ' : '') +
        'encrypted-media; gyroscope; picture-in-picture"' +
        (fullscreen ? ' allowfullscreen' : '') + '></iframe>';
} 