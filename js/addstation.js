document.getElementById('addStationForm').addEventListener('submit', function(event) {
    // Зупиняємо стандартну поведінку форми
    event.preventDefault();

    // Отримуємо всі значення введених даних
    let power = document.getElementById('power').value;
    let address = document.getElementById('address').value;
    let connector = document.getElementById('connector').value;
    let manufacturer = document.getElementById('manufacturer').value;
    let price = document.getElementById('price').value;
    let latitude = document.getElementById('latitude').value;
    let longitude = document.getElementById('longitude').value;

    // Перевірка, чи всі поля заповнені
    if (!power || !address || !connector || !manufacturer || !price || !latitude || !longitude) {
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

    // Якщо всі перевірки пройдені, переходимо на сторінку станцій
    window.location.href = 'stations.html'; // Перенаправлення на сторінку станцій
});
