function initializePage() {
  let map;
  let markers = [];

  // Resource Management Logic
  function renderResourceList(resources) {
    const resourceList = document.getElementById('resourceList');
    resourceList.innerHTML = '';

    resources.forEach((resource, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <h2>${resource.name}</h2>
        <p>${resource.address}</p>
        <button onclick="viewResourceDetail(${index})">View Details</button>
      `;
      resourceList.appendChild(listItem);
    });

    console.log("Resource list rendered with", resources.length, "items.");
  }

  function viewResourceDetail(index) {
    const resource = resources[index];
    localStorage.setItem('selectedResource', JSON.stringify(resource));
    window.location.href = 'resource-detail.html';
  }

  function initMap(apiKey) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initializeMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  function initializeMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: { lat: 45.5017, lng: -73.5673 } // Center the map on Montreal
    });
    renderResourceList(resources);
    loadMarkers(resources);

    // Add event listener for bounds_changed
    map.addListener('bounds_changed', () => {
      const filteredResources = filterResour
