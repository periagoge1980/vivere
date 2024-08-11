function initializePage() {
  let map;
  let markers = [];

  // Function to initialize the map with the given API key
  function initMap(apiKey) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initializeMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    console.log("Google Maps API script added to document head");
  }

  // Callback function called after the Google Maps script is loaded
  function initializeMap() {
    try {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: 45.5017, lng: -73.5673 } // Center the map on Montreal
      });
      console.log("Map initialized");

      renderResourceList(resources);
      loadMarkers(resources);

      // Add event listener for bounds_changed
      map.addListener('bounds_changed', () => {
        const filteredResources = filterResourcesByMapBounds(resources);
        renderResourceList(filteredResources);
        loadMarkers(filteredResources);
      });
    } catch (error) {
      console.error("Error initializing the map: ", error);
    }
  }

  // Function to load markers on the map
  function loadMarkers(resources) {
    try {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      markers = [];

      resources.forEach(resource => {
        const marker = new google.maps.Marker({
          position: { lat: resource.latitude, lng: resource.longitude },
          map: map,
          title: resource.name
        });
        markers.push(marker);
      });
      console.log("Markers loaded on the map");
    } catch (error) {
      console.error("Error loading markers: ", error);
    }
  }

  // Function to filter resources by map bounds
  function filterResourcesByMapBounds(resources) {
    const bounds = map.getBounds();
    return resources.filter(resource => {
      const position = new google.maps.LatLng(resource.latitude, resource.longitude);
      return bounds.contains(position);
    });
  }

  // Event listener for the resource form submission
  document.getElementById('resourceForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const dependency = document.getElementById('dependency').value;
    const postalCode = document.getElementById('postalCode').value;

    console.log("Selected Dependency:", dependency);
    console.log("Entered Postal Code:", postalCode);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: postalCode }, function(results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);

        const filteredResources = resources.filter(resource => 
          resource.dependency_category.includes(dependency)
        );

        const resourcesInBounds = filterResourcesByMapBounds(filteredResources);

        console.log("Filtered Resources:", resourcesInBounds);

        renderResourceList(resourcesInBounds);
        loadMarkers(resourcesInBounds);
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  });

  // Fetch Google Maps API key and initialize map
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/.netlify/functions/getApiKey')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.key) {
          initMap(data.key);
        } else {
          console.error("No API key returned from the Netlify function.");
        }
      })
      .catch(error => console.error('Error fetching Google Maps API key:', error));
  });

  // Placeholder for additional functionality (Calendar, Note Management, etc.)

}

$(document).ready(initializePage);
