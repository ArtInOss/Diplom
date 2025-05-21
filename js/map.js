
let map;
let userMarker;
let userLocation;
let openInfoWindow = null;
let mapMarkers = [];

// ❗ Очистить topStations если пользователь не перешёл с filters.html
window.addEventListener('load', () => {
    const referrer = document.referrer;
    if (!referrer.includes("filters.html")) {
        localStorage.removeItem("topStations");
    }

    if (typeof initMap === 'function') {
        initMap();
    }
});

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

    const filtered = localStorage.getItem("filteredStations");
    if (filtered) {
        try {
            const stations = JSON.parse(filtered);
            updateMapWithStations(stations);
        } catch (e) {
            console.warn("Помилка при обробці filteredStations:", e);
            loadStations();
        }
    } else {
        setTimeout(loadStations, 3000);
    }

    const topStations = localStorage.getItem("topStations");
    const referrer = document.referrer;

    if (topStations && referrer.includes("filters.html")) {
        try {
            updateTopStationsSidebar(JSON.parse(topStations));
        } catch (e) {
            console.warn("Помилка при обробці topStations:", e);
        }
    } else {
        const popup = document.getElementById("topStationsPopup");
        const toggleBtn = document.getElementById("togglePopup");
        if (popup) popup.style.display = "none";
        if (toggleBtn) toggleBtn.style.display = "none";
    }

};

function updateMapWithStations(stations) {
    mapMarkers.forEach(marker => marker.setMap(null));
    mapMarkers = [];

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

        mapMarkers.push(marker);
    });

    new MarkerClusterer(map, mapMarkers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
}

function updateTopStationsSidebar(topStations) {
    const container = document.getElementById("topStationsList");
    const popup = document.getElementById("topStationsPopup");
    const toggleBtn = document.getElementById("togglePopup");

    if (!container || !popup || !toggleBtn) return;

    if (!topStations || topStations.length === 0) {
        popup.style.display = "none";
        toggleBtn.style.display = "none";
        return;
    }

    popup.style.display = "flex";
    popup.classList.remove("collapsed");
    toggleBtn.style.display = "block";
    toggleBtn.textContent = "⮜";

    container.innerHTML = '';
    topStations.forEach((s, i) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `
            <strong>${i + 1}. ${s.locationName}</strong><br>
            ${s.address ?? "-"}<br>
            Потужність: ${s.powerKw} кВт<br>
            Ціна: ${s.pricePerKwh} грн<br>
            Відстань: ${s.distanceKm?.toFixed(1) ?? "?"} км<br>
            Конектори: ${s.connectors}<br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}"
               target="_blank" class="route-link">
                <img src="logos/googlemapslogo.png" alt="Google Maps" class="google-map-icon" />
                <span class="route-text">Побудувати маршрут</span>
            </a>
        `;
        container.appendChild(li);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("topStationsPopup");
    const toggleBtn = document.getElementById("togglePopup");
    if (popup && toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            popup.classList.toggle("collapsed");
            toggleBtn.textContent = popup.classList.contains("collapsed") ? "⮞" : "⮜";
        });
    }

    window.loadStations = function () {
        fetch('http://localhost:8080/api/stations', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            }
        })
            .then(response => response.json())
            .then(stations => updateMapWithStations(stations))
            .catch(error => console.error('Помилка завантаження станцій для карти:', error.message));
    };

    // ✅ Подключение к SSE и автообновление данных
    const eventSource = new EventSource("http://localhost:8080/api/sse/updates");
    eventSource.onmessage = function () {
        console.log("🔄 Отримано оновлення станцій через SSE");

        const filterRequest = localStorage.getItem("lastFilterRequest");
        if (!filterRequest) return;

        fetch("http://localhost:8080/api/stations/filter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
            body: filterRequest,
        })
            .then(resp => resp.json())
            .then(data => {
                const allStations = data.allStations || [];
                const topStations = data.topStations || [];
                updateMapWithStations(allStations);
                updateTopStationsSidebar(topStations);
                localStorage.setItem("filteredStations", JSON.stringify(allStations));
                localStorage.setItem("topStations", JSON.stringify(topStations));
            })
            .catch(err => console.error("Помилка SSE обробки:", err.message));
    };
});
