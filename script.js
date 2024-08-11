let map;
let geocoder;
let allResources = []; // To store all resources

const translations = {
  en: {
    pageTitle: "Addiction Resource Finder",
    headerTitle: "Find Addiction Resources",
    selectDependency: "Select Dependency",
    alcohol: "Alcohol",
    drugs: "Drugs",
    gambling: "Gambling",
    sex: "Sex",
    enterPostalCode: "Enter Postal Code",
    search: "Search",
    websiteLabel: "Website",
    resourcesFetched: (count) => `Resources fetched: ${count} items`,
  },
  fr: {
    pageTitle: "Trouver des ressources d'addiction",
    headerTitle: "Trouver des ressources d'addiction",
    selectDependency: "Sélectionner une dépendance",
    alcohol: "Alcool",
    drugs: "Drogues",
    gambling: "Jeu",
    sex: "Sexe",
    enterPostalCode: "Entrer le code postal",
    search: "Chercher",
    websiteLabel: "Site Web",
    resourcesFetched: (count) => `Ressources récupérées: ${count} éléments`,
  }
};

// Function to set the language based on user selection or stored preference
const setLanguage = (lang) => {
  const translation = translations[lang];
  document.getElementById('page-title').textContent = translation.pageTitle;
  document.getElementById('header-title').textContent = translation.headerTitle;
  document.querySelector('#resourceForm select option').textContent = translation.selectDependency;
  document.querySelector('#resourceForm select option[value="Alcohol"]').textContent = translation.alcohol;
  document.querySelector('#resourceForm select option[value="Drugs"]').textContent = translation.drugs;
  document.querySelector('#resourceForm select option[value="Gambling"]').textContent = translation.gambling;
  document.querySelector('#resourceForm select option[value="Sex"]').textContent = translation.sex;
  document.getElementById('postalCode').setAttribute('placeholder', translation.enterPostalCode);
  document.querySelector('#resourceForm button').textContent = translation.search;
};

// Save the language preference to local storage
const saveLanguagePreference = (lang) => {
  localStorage.setItem('preferredLanguage', lang);
};

// Load the language preference from local storage
const loadLanguagePreference = () => {
  return localStorage.getItem('preferredLanguage') || 'fr'; // Default to French
};

// Event listeners for language buttons
document.getElementById('lang-en').addEventListener('click', () => {
  setLanguage('en');
  saveLanguagePreference('en');
});
document.getElementById('lang-fr').addEventListener('click', () => {
  setLanguage('fr');
  saveLanguagePreference('fr');
});

// Apply the language on page load based on the saved preference
document.addEventListener('DOMContentLoaded', () => {
  const preferredLanguage = loadLanguagePreference();
  setLanguage(preferredLanguage);
});

function initMap() {
  console.log("Initializing map...");
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 46.8139, lng: -71.2082 } // Quebec City
  });
  window.map = map; // Make map globally accessible
  console.log("Map initialized.");

  // Add event listener for map bounds changed
  google.maps.event.addListener(map, 'bounds_changed', displayResourcesWithinBounds);
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
    allResources = resources.filter(resource => 
      resource.dependency_category.includes(dependency)
    );
    displayResourcesWithinBounds();
    console.log(translations[loadLanguagePreference()].resourcesFetched(allResources.length));
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
function displayResourcesWithinBounds() {
  console.log("Displaying resources within bounds...");
  const bounds = map.getBounds();
  const resourceList = document.getElementById('resourceList');
  resourceList.innerHTML = '';

  const language = loadLanguagePreference();
  const translation = translations[language];

  allResources.forEach(resource => {
    const resourceLocation = new google.maps.LatLng(resource.latitude, resource.longitude);
    if (bounds.contains(resourceLocation)) {
      const li = document.createElement('li');
      li.innerHTML = `<h2>${resource.name}</h2><p>${resource.address}</p><a href="${resource.website}">${translation.websiteLabel}</a>`;
      resourceList.appendChild(li);

      const marker = new google.maps.Marker({
        position: { lat: resource.latitude, lng: resource.longitude },
        map: window.map,
        title: resource.name
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<h2>${resource.name}</h2><p>${resource.address}</p><a href="${resource.website}">${translation.websiteLabel}</a>`
      });

      marker.addListener('mouseover', function() {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseout', function() {
        infoWindow.close();
      });
    }
  });
  console.log("Resources displayed.");
}

// Load Google Maps API with the key fetched from Netlify function
async function loadGoogleMaps() {
  const response = await fetch('/.netlify/functions/getApiKey');
  const data = await response.json();
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

loadGoogleMaps();
