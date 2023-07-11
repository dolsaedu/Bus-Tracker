let map;
const markers = [];

function init() {
  const myOptions = {
    zoom: 13,
    center: { lat: 42.35335, lng: -71.091525 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  const element = document.getElementById("map");
  map = new google.maps.Map(element, myOptions);
  addMarkers();
}

async function addMarkers() {
  const locations = await getBusLocations();

  locations.forEach(function (bus) {
    const marker = getMarker(bus.id);
    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
  });

  console.log(new Date());
  setTimeout(addMarkers, 15000);
}

//getLocations -> executed in locations at addMarkers and pushed to maps
async function getBusLocations() {
  //----DOCS-----
  //https://api-v3.mbta.com/docs/swagger/index.html#/Vehicle/ApiWeb_VehicleController_show
  const url =
    "https://api-v3.mbta.com/vehicles?api_key=564d34569d1d458aa13fa518ce841b99&filter[route]=1&include=trip";
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

function addMarker(bus) {
  const icon = getIcon(bus);
  const marker = new google.maps.Marker({
    position: {
      lat: bus.attributes.latitude,
      lng: bus.attributes.longitude,
    },
    map: map,
    icon: icon,
    id: bus.id,
  });
  markers.push(marker);
}

function getIcon(bus) {
  //show the road-trip from the bus
  if (bus.attributes.direction_id === 0) {
    return "red.png";
  }
  return "blue.png";
}

function moveMarker(marker, bus) {
  const icon = getIcon(bus);
  marker.setIcon(icon);

  marker.setPosition({
    lat: bus.attributes.latitude,
    lng: bus.attributes.longitude,
  });
}

function getMarker(id) {
  const marker = markers.find(function (item) {
    return item.id === id;
  });
  return marker;
}

window.onload = init;
