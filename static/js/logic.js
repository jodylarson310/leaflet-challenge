// Store our API endpoint as queryUrl.

var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Query the URL
d3.json(queryUrl).then(function (data) {
    // send the data.features to the createMap function
    createMap(data.features);
  });

// Define a function to run once for each data point
// Create a popup that provides additional information
function onEachFeature(feature, layer) {
        
    layer.bindPopup(`<strong>Place: </strong>${feature.properties.place}<br>
    <strong>Time: </strong>${new Date(feature.properties.time)}<br>
    <strong>Magnitude: </strong>${feature.properties.mag}<br>
    <strong>Depth: </strong>${feature.geometry.coordinates[2]}</p>`);
};

// Create the GeoJSON layer for the earthquakeData
// Run onEachFeature function for all data
L.geoJSON(earthquakeData, {
    pointToLayer: function circleLayer(features, latlng) {

        return L.circleMarker(latlng, {
            radius: markerSize(features.properties.mag),
            fillColor: markerColor(features.geometry.coordinates[2]),
            color: "white",
            weight: 0.8,
            opacity: 0.8,
            fillOpacity: 0.8
        });
    },
        onEachFeature: onEachFeature}).addTo(myMap);
    
// Define marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 3;
};

// Define marker color based on earthquake depth
function markerColor(depth) {
    if (depth <= 10) {
        return "rgb(116,196,118)"} 
    else if (depth <= 30) {
        return "rgb(199,233,192)"} 
    else if (depth <= 50) {
        return "rgb(254,227,145)"} 
    else if (depth <= 70) {
        return "rgb(254,196,79)"} 
    else if (depth <= 90) {
        return "rgb(254,153,41)"} 
    else {
        return "rgb(252,78,42)"} 
};

function createMap (earthquakeData){
    // Base layer
    let myMap = L.map("map", {
        center: [
            39.00, -97.00
        ],
        zoom: 5,
    });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Create the GeoJSON layer for the earthquakeData
// Run onEachFeature function for all data
L.geoJSON(earthquakeData, {
    pointToLayer: function circleLayer(features, latlng) {

        return L.circleMarker(latlng, {
            radius: markerSize(features.properties.mag),
            fillColor: markerColor(features.geometry.coordinates[2]),
            color: "white",
            weight: 0.7,
            opacity: 0.8,
            fillOpacity: 0.8
        
        });
        
    },
    onEachFeature: onEachFeature}).addTo(myMap);

// Create legend on the map
// https://www.igismap.com/legend-in-leafletjs-map-with-topojson/ 

let legend = L.control({position: "bottomleft"});
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90];
    let labels = [];
    let legendData = "<h3> Depth </h3>";
    
    div.innerHTML = legendData;
    
    // go through each "depth" to label and color the legend
    // push to labels array as list item
     for (let i = 0; i < depths.length; i++) {
        labels.push('<li style="background-color:' + markerColor(depths[i] + 1) + '"> <span>' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '' : '+') + '</span></li>');
        }
    
    // Add each label list item 
    div.innerHTML +="<ul>" + labels.join("") + "</ul>";

    return div;
};

//Add legend to map
legend.addTo(myMap);

};