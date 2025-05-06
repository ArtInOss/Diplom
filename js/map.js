let map;
let userMarker;
let userLocation;

// Функція для ініціалізації карти
function initMap() {
    // Ініціалізація карти
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 48.3794, lng: 31.1656 },  // Координати центру України (за замовчуванням)
        zoom: 12,
    });

    // Створення маркера для користувача
    userMarker = new google.maps.Marker({
        map: map,
        icon: {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
            scaledSize: new google.maps.Size(30, 30), // Розмір іконки
        },
    });

    // Отримання місцеположення користувача
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(userLocation);  // Встановлюємо центр карти на місцеположення користувача
            userMarker.setPosition(userLocation);  // Встановлюємо маркер на місцеположення
        });
    }
    document.getElementById("locationButton").addEventListener("click", function () {
        if (userLocation) {
            map.setCenter(userLocation);  // Переміщаємо карту на місцеположення користувача
            map.setZoom(15);  // Збільшуємо масштаб
        } else {
            alert("Не вдалося знайти ваше місцеположення.");
        }
    });

    // Завантажуємо станції з localStorage
    let stations = JSON.parse(localStorage.getItem('stations')) || []; // Отримуємо станції з localStorage

    // Додавання маркерів для всіх станцій
    stations.forEach(station => {
        let marker = new google.maps.Marker({
            position: { lat: station.lat, lng: station.lng },
            map: map,
            title: station.name,
        });

        // Виведення інформації про станцію при натисканні на маркер
        let infoWindow = new google.maps.InfoWindow({
            content: `
        <div style="max-width: 150px; min-width: 150px;">
          
            <p style="font-size: 12px; margin: 5px 0; color: black" >Адреса: ${station.address}</p>
            <p style="font-size: 12px; margin: 5px 0; color: black">Конектори: ${station.connectors}</p>
            <p style="font-size: 12px; margin: 5px 0; color: black">Ціна: ${station.price}</p>
            <p style="font-size: 12px; margin: 5px 0; color: black;">Потужність: ${station.power} кВт</p> <!-- Додаємо потужність -->
            
        </div>`,
        });

        marker.addListener("click", function() {
            infoWindow.open(map, marker);
        });
    });
}

// Гарантуємо, що функція `initMap` буде викликана при завантаженні сторінки
window.addEventListener('load', function () {
    if (typeof initMap === 'function') {
        initMap();  // Ініціалізація карти при завантаженні сторінки
    }
});
