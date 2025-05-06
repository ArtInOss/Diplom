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

    let updatedStation = {
        power: document.getElementById('editPower').value,
        address: document.getElementById('editAddress').value,
        latitude: document.getElementById('editLatitude').value,
        longitude: document.getElementById('editLongitude').value,
        connectors: [...document.querySelectorAll('#editConnectors select')].map(select => select.value),
        manufacturer: document.getElementById('editManufacturer').value,
        tariff: document.getElementById('editTariff').value,
    };

    // Сохраняем данные о станции (например, в localStorage или через API)

    $('#editStationModal').modal('hide');

    alert('Изменения сохранены!');
};
