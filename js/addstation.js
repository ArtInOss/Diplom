document.getElementById('addStationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let power = document.getElementById('power').value;
    let address = document.getElementById('address').value;
    let connectors = [...document.querySelectorAll('#connectorContainer select')].map(select => select.value);
    let manufacturer = document.getElementById('manufacturer').value;
    let price = document.getElementById('price').value;
    let latitude = document.getElementById('latitude').value;
    let longitude = document.getElementById('longitude').value;

    // Перевірка, чи всі поля заповнені
    if (!power || !address || !manufacturer || !price || !latitude || !longitude) {
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    // Валідація для потужності (ціле, позитивне число)
    if (!Number.isInteger(Number(power)) || power <= 0) {
        alert("Потужність повинна бути позитивним цілим числом.");
        return;
    }

    // Валідація для ціни (ціле, позитивне число)
    if (isNaN(price) || price <= 0) {
        alert("Ціна повинна бути позитивним числом.");
        return;
    }

    // Валідація для координат (числа, перевірка діапазону)
    const coordinateRegex = /^-?\d+(\.\d+)?$/;
    if (!coordinateRegex.test(latitude) || !coordinateRegex.test(longitude)) {
        alert("Координати повинні бути числами.");
        return;
    }

    // Перевірка діапазону координат
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        alert("Координати знаходяться не в допустимих межах. Широта: -90 до 90, Довгота: -180 до 180.");
        return;
    }

    // Додавання нової станції до локального сховища
    const newStation = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        name: `Станція: ${address}`,
        address: address,
        connectors: connectors.join(', '),
        price: `${price} грн/кВт-год`,
        power: power
    };

    let stations = JSON.parse(localStorage.getItem('stations')) || []; // Якщо дані є в localStorage, то беремо їх, якщо ні - ініціалізуємо порожній масив
    stations.push(newStation); // Додаємо нову станцію в масив
    localStorage.setItem('stations', JSON.stringify(stations)); // Зберігаємо оновлений масив в localStorage

    // Очистити форму після додавання
    document.getElementById('addStationForm').reset();

    // Якщо всі перевірки пройдені
    window.location.href = 'stations.html'; // Перенаправлення на сторінку станцій
});

// Масив для зберігання станцій (для демонстрації, поки без БД)
let stations = [];

// Функція для додавання маркера на карту
function addMarkerToMap(station) {
    // Перевірка чи карта вже ініціалізована
    if (typeof map === 'undefined') {
        alert("Карта ще не ініціалізована!");
        return;
    }

    // Додавання маркера для нової станції
    let marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: map,
        title: station.name,
    });

    // Інформаційне вікно для маркера
    let infoWindow = new google.maps.InfoWindow({
        content: `
            <h4>${station.name}</h4>
            <p>Адреса: ${station.address}</p>
            <p>Конектори: ${station.connectors}</p>
            <p>Ціна: ${station.price}</p>
        `,
    });

    marker.addListener("click", function() {
        infoWindow.open(map, marker);
    });

    // Додаємо нову станцію в масив
    stations.push(station);
}

// Додавання нового конектора
document.getElementById('addConnector').addEventListener('click', function() {
    let connectorContainer = document.getElementById('connectorContainer');
    let newConnector = document.createElement('div');
    newConnector.classList.add('d-flex', 'mb-2', 'connector-row');
    newConnector.innerHTML = `
        <select class="form-control" required>
            <option value="CCS2">CCS2</option>
            <option value="GB/T">GB/T</option>
            <option value="CHAdeMO">CHAdeMO</option>
        </select>
        <button type="button" class="btn btn-danger remove-connector ml-2">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    connectorContainer.appendChild(newConnector);

    // Оновлюємо обробник для кнопок видалення
    updateRemoveButtonEvent();
});

// Видалення конектора
function updateRemoveButtonEvent() {
    document.querySelectorAll('.remove-connector').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.remove();
        });
    });
}
