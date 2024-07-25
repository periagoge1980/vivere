let map;
let geocoder;

function initMap() {
  console.log("Initializing map...");
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 46.8139, lng: -71.2082 } // Quebec City
  });
  window.map = map; // Make map globally accessible
  console.log("Map initialized.");
}

// Fetch and display resources
document.getElementById('resourceForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const dependency = document.getElementById('dependency').value;
  const postalCode = document.getElementById('postalCode').value;
  console.log(`Fetching resources for dependency: ${dependency}, postal code: ${postalCode}`);

  // Geocode the postal code to get the location
  geocodePostalCode(postalCode, function(location) {
    map.setCenter(location);
    const filteredResources = resources.filter(resource => 
      (dependency === "" || (resource.dependency_category && resource.dependency_category.includes(dependency))) &&
      (postalCode === "" || resource.postal_code.startsWith(postalCode.slice(0, 3)))
    );
    displayResources(filteredResources);
    console.log(`Resources fetched: ${filteredResources.length} items`);
  });
});

// Geocode the postal code to get the location
function geocodePostalCode(postalCode, callback) {
  geocoder.geocode({ 'address': postalCode }, function(results, status) {
    if (status === 'OK') {
      const location = results[0].geometry.location;
      callback(location);
    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// Display resources on the map and in the list
function displayResources(resources) {
  console.log("Displaying resources...");
  const resourceList = document.getElementById('resourceList');
  resourceList.innerHTML = '';
  resources.forEach(resource => {
    const li = document.createElement('li');
    li.innerHTML = `<h2>${resource.name}</h2><p>${resource.address}</p><a href="http://${resource.website}" target="_blank">Website</a>`;
    resourceList.appendChild(li);

    const marker = new google.maps.Marker({
      position: { lat: resource.latitude, lng: resource.longitude },
      map: window.map,
      title: resource.name
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h2>${resource.name}</h2><p>${resource.address}</p><a href="http://${resource.website}" target="_blank">Website</a>`
    });

    marker.addListener('mouseover', function() {
      infoWindow.open(map, marker);
    });

    marker.addListener('mouseout', function() {
      infoWindow.close();
    });
  });
  console.log("Resources displayed.");
}

// Load Google Maps API with the key
function loadGoogleMaps() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

loadGoogleMaps();
