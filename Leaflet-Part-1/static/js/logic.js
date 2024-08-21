// Create the map object with the center at calculated coordinates and zoom level
let myMap = L.map("map", {
  center: [38.1909, -121.7512], // Adjusted to calculated center
  zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 4; // Adjust multiplier as needed
}

// Function to determine marker color based on earthquake depth
function markerColor(depth) {
  if (depth > 90) return "#800026";
  if (depth > 70) return "#BD0026";
  if (depth > 50) return "#E31A1C";
  if (depth > 30) return "#FC4E2A";
  if (depth > 10) return "#FD8D3C";
  return "#FEB24C";
}

// Grab the GeoJSON data
d3.json(link).then(function(data) {
  
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
      // Point to layer to create circle markers
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
      },
      // Style each feature (in this case, each earthquake)
      style: function(feature) {
          return {
              radius: markerSize(feature.properties.mag),
              fillColor: markerColor(feature.geometry.coordinates[2]), // Depth is the third coordinate
              color: "#000",
              weight: 0.5,
              opacity: 1,
              fillOpacity: 0.8
          };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p><p>${new Date(feature.properties.time)}</p>`);
      }
  }).addTo(myMap);

  // Create a legend control object
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend"),
          depths = [0, 10, 30, 50, 70, 90],
          colors = [
              "#FEB24C",
              "#FD8D3C",
              "#FC4E2A",
              "#E31A1C",
              "#BD0026",
              "#800026"
          ];

      // Looping through depth intervals to generate a label with a colored square for each interval
      for (let i = 0; i < depths.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
      }

      return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);

});
