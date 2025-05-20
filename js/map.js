let map;
let userMarker;
let userLocation;
let openInfoWindow = null;

window.initMap = function () {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 48.3794, lng: 31.1656 },
        zoom: 12,
    });

    userMarker = new google.maps.Marker({
        map: map,
        icon: {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
            scaledSize: new google.maps.Size(30, 30),
        },
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(userLocation);
            userMarker.setPosition(userLocation);
        });
    }

    document.getElementById("locationButton")?.addEventListener("click", function () {
        if (userLocation) {
            map.setCenter(userLocation);
            map.setZoom(15);
        } else {
            alert("Не вдалося знайти ваше місцеположення.");
        }
    });

    // 👉 Проверяем: если есть отфильтрованные станции — отображаем их
    const filtered = localStorage.getItem("filteredStations");
    if (filtered) {
        try {
            const stations = JSON.parse(filtered);
            renderStationsOnMap(stations);
        } catch (e) {
            console.warn("Помилка при обробці filteredStations:", e);
            loadStations(); // fallback
        }
    } else {
        // иначе — загружаем все станции
        setTimeout(loadStations, 3000);
    }
};

function renderStationsOnMap(stations) {
    if (!stations || stations.length === 0) return;

    const markers = [];

    stations.forEach(station => {
        if (!station.latitude || !station.longitude) return;

        const position = { lat: station.latitude, lng: station.longitude };
        const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: station.locationName || 'Зарядна станція',
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="info-window">
                    <h5 style="margin-bottom: 10px;">${station.locationName || 'Зарядна станція'}</h5>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}" target="_blank" class="route-link">
                        <img src="logos/googlemapslogo.png" alt="Google Maps" class="google-map-icon" />
                        <span class="route-text">Побудувати маршрут</span>
                    </a>
                    <p><strong>Адреса:</strong> ${station.address ?? "-"}</p>
                    <p><strong>Конектори:</strong> ${station.connectors}</p>
                    <p><strong>Ціна:</strong> ${station.pricePerKwh ?? "?"} грн/кВт-год</p>
                    <p><strong>Потужність:</strong> ${station.powerKw} кВт</p>
                </div>
            `
        });

        marker.addListener("click", () => {
            if (openInfoWindow) openInfoWindow.close();
            infoWindow.open(map, marker);
            openInfoWindow = infoWindow;
        });

        markers.push(marker);
    });

    new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
}

function loadStations() {
    fetch('http://localhost:8080/api/stations', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Помилка відповіді сервера");
            return response.json();
        })
        .then(stations => {
            renderStationsOnMap(stations);
        })
        .catch(error => {
            console.error('Помилка завантаження станцій для карти:', error.message);
        });
}

window.addEventListener('load', () => {
    if (typeof initMap === 'function') {
        initMap();
    }
});
