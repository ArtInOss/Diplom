// Функция для заполнения полей формы при редактировании
function editStation(id, power, address, connectors, manufacturer, tariff, latitude, longitude) {
    document.getElementById('editPower').value = power;
    document.getElementById('editAddress').value = address;
    document.getElementById('editLatitude').value = latitude;
    document.getElementById('editLongitude').value = longitude;
    document.getElementById('editManufacturer').value = manufacturer;
    document.getElementById('editTariff').value = tariff;

    let connectorContainer = document.getElementById('editConnectors');
    connectorContainer.innerHTML = ''; // Очистка контейнера

    // Добавляем коннекторы в список
    connectors.forEach(connector => {
        let connectorRow = document.createElement('div');
        connectorRow.classList.add('connector-row');
        connectorRow.innerHTML = `
            <select class="form-control" required>
                <option value="CCS2" ${connector === 'CCS2' ? 'selected' : ''}>CCS2</option>
                <option value="GB/T" ${connector === 'GB/T' ? 'selected' : ''}>GB/T</option>
                <option value="CHAdeMO" ${connector === 'CHAdeMO' ? 'selected' : ''}>CHAdeMO</option>
            </select>
            <button type="button" class="btn btn-danger remove-connector"><i class="fas fa-trash-alt"></i></button>
        `;
        connectorContainer.appendChild(connectorRow);
    });

    // Добавляем новый коннектор
    document.getElementById('addConnector').onclick = function() {
        let newConnectorRow = document.createElement('div');
        newConnectorRow.classList.add('connector-row');
        newConnectorRow.innerHTML = `
            <select class="form-control" required>
                <option value="CCS2">CCS2</option>
                <option value="GB/T">GB/T</option>
                <option value="CHAdeMO">CHAdeMO</option>
            </select>
            <button type="button" class="btn btn-danger remove-connector"><i class="fas fa-trash-alt"></i></button>
        `;
        connectorContainer.appendChild(newConnectorRow);

        // Обновляем обработчик для удаления
        updateRemoveButtonEvent();
    };

    // Обновляем обработчики для кнопок удаления
    updateRemoveButtonEvent();

    function updateRemoveButtonEvent() {
        document.querySelectorAll('.remove-connector').forEach(button => {
            button.onclick = function() {
                this.parentElement.remove();
            };
        });
    }

    // Открываем модальное окно
    $('#editStationModal').modal('show');
}

// Обработка формы редактирования
document.getElementById('editStationForm').onsubmit = function(event) {
    event.preventDefault();

    let power = document.getElementById('editPower').value;
    let latitude = document.getElementById('editLatitude').value;
    let longitude = document.getElementById('editLongitude').value;
    let tariff = document.getElementById('editTariff').value;

    // Валидация мощности (целое число и положительное)
    if (!Number.isInteger(Number(power)) || power <= 0) {
        alert("Потужність повинна бути цілим і позитивним числом.");
        return;
    }

    // Валидация координат (широта и долгота)
    const coordinateRegex = /^-?\d+(\.\d+)?$/;
    if (!coordinateRegex.test(latitude) || !coordinateRegex.test(longitude)) {
        alert("Координати повинні бути числами.");
        return;
    }

    // Проверка диапазона координат
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        alert("Координати знаходяться не в допустимих межах. Широта: -90 до 90, Довгота: -180 до 180.");
        return;
    }

    // Валидация тарифа (целое положительное число)
    if (!Number.isInteger(Number(tariff)) || tariff <= 0) {
        alert("Тариф має бути цілим позитивним числом.");
        return;
    }

    let updatedStation = {
        power: power,
        address: document.getElementById('editAddress').value,
        latitude: latitude,
        longitude: longitude,
        connectors: [...document.querySelectorAll('#editConnectors select')].map(select => select.value),
        manufacturer: document.getElementById('editManufacturer').value,
        tariff: tariff,
    };

    // Сохраняем данные о станции (например, в localStorage или через API)

    $('#editStationModal').modal('hide');

    alert('Зміни збережені!');
};

// Функция удаления станции
let stationToDelete = null;

function deleteStation(id) {
    stationToDelete = id; // Сохраняем ID станции для удаления
    $('#deleteStationModal').modal('show'); // Открываем модальное окно
}

// Подтверждение удаления
document.getElementById('confirmDeleteButton').onclick = function() {
    // Удаляем строку из таблицы
    const row = document.querySelector(`tr[data-id="${stationToDelete}"]`);
    if (row) {
        row.remove();
    }

    // Закрываем модальное окно
    $('#deleteStationModal').modal('hide');

    // Очистить переменную
    stationToDelete = null;

    alert('Зарядна станція була видалена!');
};
