// Fucntion to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    let metadataField = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let targetObjectMetadata  = metadataField.filter(x => x.id == sample);
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataDisplay = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataDisplay.html("");

    // Inside a loop, you will need to use d3 to append new tags for each key-value in the filtered metadata.
    // Loop through the filtered metadata object 'targetObjectMetadata' and append the key and value as an html tag to the metadata panel
    for ([key, value] of Object.entries(targetObjectMetadata[0])) {
      metadataDisplay.append("html").text(`${key.toUpperCase()}: ${value}`);
  }
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleField = data.samples;

    // Filter the samples for the object with the desired sample number
    let targetObjectSamples = sampleField.filter(x => x.id == sample);

    // Get the otu_ids, otu_labels, and sample_values and store them in variables
    let otuIDs = targetObjectSamples[0].otu_ids;
    let otuLabels = targetObjectSamples[0].otu_labels;
    let sampleValues = targetObjectSamples[0].sample_values;

    // Build a Bubble Chart
    // Create trace object for bubble chart, using otu_ids for x-values and marker colors,
    // sample_values for y-values and marker size, and otu_lables as the hover-text values
    let bubbleTrace = {
      x: otuIDs,
      y: sampleValues,
      name: 'Bubble Chart',
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIDs,
        colorscale: 'Earth',
        size: sampleValues,
        sizeref: 1, // set sizeref so that marker size will scale based on sampleValues
        sizemode: 'diameter' // marker size will be based on marker diameter
      }
    };

    // Set trace data as an array
    bubbleData = [bubbleTrace];

    // Set layout of the bubble chart
    bubbleLayout = {
      title: 'Bacteria Culture Per Sample',
      showlegend: false,
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      },
      height: 800
    }

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart - Don't forget to slice and reverse the input data appropriately

    // Create a list/array to store the list of otu ID strings
    let otuIDLabels = [];
    
    // Since the sample values are alreayd in descending order, slice the first 10 available values for sampleValues
    // and their corresponding otu IDs.  Reverse the sliced input data for Plotly graphing
    let topTenSamples = sampleValues.slice(0,10).reverse();
    let topTenOTUs = otuIDs.slice(0,10).reverse();
    
    // Map the otu_ids as a formatted text string to the array 'otuIDLabels'
    topTenOTUs.map(otu => otuIDLabels.push(`OTU ${otu}`));

    // Create trace object for horizontal bar chart, using the stored otu ID strings as y-axis labels,
    // sample_values for the bar chart values, and otu_lables as the hover-text values    
    barTrace = {
      x: topTenSamples,
      y: otuIDLabels,
      name: 'Bar Chart',
      text: otuLabels,
      orientation: 'h',
      type: 'bar'
    };

    // Set trace data as an array
    barData = [barTrace];

    // Set layout of the horizontal bar chart    
    barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      showlegend: false,
      xaxis: {
        title: 'Number of Bacteria'
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);    
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    // Inside a loop, use d3 to append a new option for each sample name with a matching 'value' attribute
    for (let i = 0; i < names.length; i++) {
      dropdownMenu.append("option").text(names[i]).attr("value", names[i]);
    }

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample by calling the corresponding functions
    buildMetadata(firstSample);
    buildCharts(firstSample);

    // When a new sample is selected, call the optionChanged function to update the dashboard, passing the new
    // selected value of the dropdown menu
    d3.select("#selDataset").on("change", optionChanged(dropdownMenu.property("value")));
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
