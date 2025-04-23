let map;
let userMarker;
let userLocation;

function initMap() {
    // Инициализация карты
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 48.3794, lng: 31.1656 },  // Координаты центра Украины (по умолчанию)
        zoom: 12,
    });

    // Создание маркера для пользователя
    userMarker = new google.maps.Marker({
        map: map,
        icon: {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
            scaledSize: new google.maps.Size(30, 30), // Размер иконки
        },
    });

    // Получение местоположения пользователя
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(userLocation);  // Устанавливаем центр карты на местоположение пользователя
            userMarker.setPosition(userLocation);  // Устанавливаем маркер на местоположение
        });
    }

    // Обработчик кнопки "Мое местоположение"
    document.getElementById("locationButton").addEventListener("click", function () {
        if (userLocation) {
            map.setCenter(userLocation);  // Перемещаем карту на местоположение пользователя
            map.setZoom(15);  // Увеличиваем зум
        } else {
            alert("Не удалось найти ваше местоположение.");
        }
    });
}