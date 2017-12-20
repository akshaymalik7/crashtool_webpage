
//console.log(centerlines);
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwbXlkYXRhIiwiYSI6ImNqOXNtMTR5dzA5bGYycXBsdmFraHRnNnkifQ.vqfvXOyVVQsxxjZpJ99vYQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-75.15, 40],
    zoom: 11,
    maxzoom: 16,
    minzoom: 11
});

var Draw = new MapboxDraw();
map.addControl(Draw) // drawing toolbar

console.log(map.getZoom())

map.on('load', function () {

      map.addLayer({
          "id": "centerlines",
          "type": "line",
          "source": {
              "type": "geojson",
              "data": {
                  "type": "FeatureCollection",
                  "features": centerlines.features
                        }
                    },
          "paint": {
            "line-width": 1,
            "line-color": "#30323D"
                  }
              });

      map.addLayer({
          "id": "injurycrashes",
          "type": "circle",
          "source": {
              "type": "geojson",
              "data": {
                  "type": "FeatureCollection",
                  "features": crashes.features
                        }
                    },
          "paint": {
            "circle-radius": 1,
            "circle-opacity": 0.5,
            "circle-color": "#00A1E4",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#00A1E4"
                  }
              });

      map.setMinZoom(11);

  });


map.on("zoom", function(){
  console.log(map.getZoom());
  map.setMinZoom(11);
  map.setPaintProperty('injurycrashes', "circle-stroke-width", ["^", 1.01, map.getZoom()])
  function markerResize() {
    if (map.getZoom() < 13) {
      map.setPaintProperty('injurycrashes', "circle-radius", ["^", 1.05, map.getZoom()])
    }

    else if (15 > map.getZoom() > 13) {
      map.setPaintProperty('injurycrashes', "circle-radius", ["^", 1.06, map.getZoom()])
    }

    else if (18 > map.getZoom() > 15) {
      map.setPaintProperty('injurycrashes', "circle-radius", ["^", 1.07, map.getZoom()])
    }
    else {
      map.setPaintProperty('injurycrashes', "circle-radius", ["^", 1.14, map.getZoom()])

    }
  }

  markerResize();


  });

map.on('click', function (e) {
    var bbox = [[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]];
    var features = map.queryRenderedFeatures(bbox, { layers: [''] });
    document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
  });


var bufferAroundLines = turf.buffer(centerlines, 10);
bufferAroundLines();
