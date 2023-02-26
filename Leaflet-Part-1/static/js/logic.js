

// Adding the tile layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Getting our GeoJSON data
d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    // Once we get a response, send the data.features object to the createFeatures function.
  createMap(data.features);
});

function createMap(earthquakeData) {
    markers = earthquakeData.map((feature) =>
        L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
        radius: magCheck(feature.properties.mag),
        stroke: true,
        color: colorMag(feature.properties.mag),
        opacity: 1,
        weight: 1,
        fillcolor: colorMag(feature.properties.mag),
        fillOpacity: 0.8
        })
    .bindPopup("<h1> Magnitude: "+ feature.properties.mag +
    "</h1><hr><h3>" + feature.properties.place +
    "</h2><hr><p>" + new Date(feature.properties.time) + "</p>")
    )

var earthquakes = L.layerGroup(markers)
var mags = earthquakeData.map((d) => magCheck(+d.properties.mag));

console.log(d3.extent(mags));
console.log(mags);

  // Create our map, giving it the street and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });



/*Legend specific*/
var legend = L.control({ position: "bottomright" });

// create the color and value display of the legend
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: #00FF00"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #FFFF00"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #FFCC00"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #FF9900"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #FF6600"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #FF0000"></i><span>5+</span><br>';

    return div;
    };
    
    legend.addTo(myMap);

}

 // Coloring the magnitude level
function colorMag(mag) {
  var color = "";
  if (mag <= 2) { color = "#00FF00"; }
  else if (mag <= 3) {color = "#FFFF00"; }
  else if (mag <= 4) { color = "#FF9900"; }
  else if (mag <= 5) {color = "#FF6600"; }
  else { color = "#FF0000"; }

return color;

};

function magCheck(mag){
if (mag <= 1){
  return 3
}
return mag * 3;
}


