// Initialize and add the map
function initMap() {
  console.log("Initializing map...");
  const map = new google.maps.Map(document.getElementById("map"), {
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
  const filteredResources = resources.filter(resource => 
    resource.type === dependency && resource.postal_code.startsWith(postalCode.slice(0, 3))
  );
  displayResources(filteredResources);
  console.log(`Resources fetched: ${filteredResources.length} items`);
});

// Display resources on the map and in the list
function displayResources(resources) {
  console.log("Displaying resources...");
  const resourceList = document.getElementById('resourceList');
  resourceList.innerHTML = '';
  resources.forEach(resource => {
    const li = document.createElement('li');
    li.innerHTML = `<h2>${resource.name}</h2><p>${resource.address}</p><a href="${resource.online_url}">Website</a>`;
    resourceList.appendChild(li);

    new google.maps.Marker({
      position: { lat: resource.latitude, lng: resource.longitude },
      map: window.map,
      title: resource.name
    });
  });
  console.log("Resources displayed.");
}
