# WurmVis

This project explores novel ways to display rich and interactive content from big datasets with D3.js. The datasets are taken from the video captures of c.elegans worm behavior.

## Features

### Scatter plot

- Each point displays multiple attributes that can be finalized further
- Clear and smooth animation that helps to relate to the data better
- Select groups of data points from the toolbar

### Heatmap

- Choose from displaying the entire dataset or a sample of it
- Easily change visualization colors from the toolbar

## Setup

#### Navigate to `vars.js` file in `js` folder
- Set your data file path in `DATA_PATH`
- Set your sample size in `SAMPLE_SIZE`
- Toggle whether heatmap displays the sampled version with `IS_SAMPLING_HEATMAP`

## Demo

Try it [here]()! *(future website)*

## Screenshots

### Explore datasets with ease and context
![Main Scatterplot Screen](img/scatter-alone.png)

### Find data via attributes
![Scatterplot Selection Screen](img/scatter-group.png)

### Visualize all in glorious heatmap
![Heatmap Default Color](img/heatmap-default.png)

### And change color to your liking!
![Heatmap Rainbow Color](img/heatmap-rainbow.png)
