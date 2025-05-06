document.getElementById('addStationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let power = document.getElementById('power').value;
    let address = document.getElementById('address').value;
    let connectors = [...document.querySelectorAll('#connectorContainer select')].map(select => select.value);
    let manufacturer = document.getElementById('manufacturer').value;
    let price = document.getElementById('price').value;
    let latitude = document.getElementById('latitude').value;
    let longitude = document.getElementById('longitude').value;

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

    // Якщо всі перевірки пройдені
    window.location.href = 'stations.html'; // Перенаправлення на сторінку станцій
});

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
