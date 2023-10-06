// The url with data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Display the default plots
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of id names
        let names = data.names;

        names.forEach((name) => {
            // Append each name as an option to the drop down menu. 
            dropdownMenu.append("option").text(name).property("value", name);
        });
         // Use the first sample from the list to build the initial plots
        let name = names[0];

   // Call the functions to make the demographic panel, bar chart, and bubble chart
     demo(name);
     bar(name);
     bubble(name);
     gauge(name);
     });
}
// Get a new data each time when a new sample is selected
 function optionChanged(selectedValue) {
     demo(selectedValue);
     bar(selectedValue);
     bubble(selectedValue);
     gauge(selectedValue)
    
}

// Demographics panel
function demo(selectedValue) {
   // Use D3 to select the dropdown menu
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
         // get all of the metadata
        let metadata = data.metadata;
        
        // Filter based on the value of the sample 
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        //  Access index 0 from the array
        let obj = filteredData[0]

        // Use `.html("") to clear any existing metadata
        d3.select("#sample-metadata").html("");
  
        //  Use Object.entries() method in JS
        let entries = Object.entries(obj);
        
        // Use Object.entries to get the key/value pairs and put into the demographics box on the page
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key.toUpperCase()}: ${value}`);
        });

        // Log the entries Array
        console.log(entries);
    });
  }
  

//Bar chart
function bar(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);
        // An array of sample objects
        let samples = data.samples;
        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        //  Access index 0 from the array
        let obj = filteredData[0];
        
        // Trace for the data for the horizontal bar chart by using 'slice the top qo otus
        let trace = [{
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "yellowgreen"
            },
            orientation: "h"
        }];

         // Apply the x-axis lengend to the layout
         let layout = {
            xaxis: {title: "Top 10 Belly Button Bacteria"}
        };
        
        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("bar", trace, layout);
    });
}
  
//Bubble chart
function bubble(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {

        // An array of sample objects
        let samples = data.samples;
    
        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        // Access index 0 from the array
        let obj = filteredData[0];

        // Bubble chart data
        let barchart = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
            size: obj.sample_values,
            color: obj.otu_ids,
            colorscale: "Viridis"
            }
       }];
    
        // Create the layout for the bubble chart.
        let layout = {
            title: "Bacteria Cultures Per Sample",
            xaxis: {title: "OTU ID (Microbial Species Identification Number)"},
            margin: { t: 50 },
        };
        // Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", barchart, layout);
    });
}
 // Gauge chart 
function gauge(selectedValue) {
    d3.json(url).then((data) => {
        // An array of metadata objects
        let metadata = data.metadata;
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        let obj = filteredData[0]

    // Create the trace for the gauge chart.
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9]},
                bar: {color: "orange", width: 4}, 
                steps: [
                    { range: [0, 1], color: "rgb(255, 255, 102)"},
                    { range: [1, 2], color: "rgb(217, 255, 102)"},
                    { range: [2, 3], color: "rgb(179, 255, 102)" },
                    { range: [3, 4], color: "rgb(140, 255, 102)" },
                    { range: [4, 5], color: "rgb(102, 255, 102)" },
                    { range: [5, 6], color: "rgb(102, 255, 140)" },
                    { range: [6, 7], color: "rgb(102, 255, 179)" },
                    { range: [7, 8], color: "rgb(102, 255, 217)" },
                    { range: [8, 9], color: "rgb(102, 255, 255)" }
                ],
            
            }
        }];

         // Use Plotly to plot the data in a gauge chart
         Plotly.newPlot("gauge", trace);
    });
}

// Initialize the dashboard
init();

