document.getElementById('addStationForm').addEventListener('submit', function(event) {
    // Зупиняємо стандартну поведінку форми
    event.preventDefault();

    // Отримуємо всі значення введених даних
    let power = document.getElementById('power').value;
    let address = document.getElementById('address').value;
    let connector = document.getElementById('connector').value;
    let manufacturer = document.getElementById('manufacturer').value;
    let price = document.getElementById('price').value;

    // Перевірка, чи всі поля заповнені
    if (!power || !address || !connector || !manufacturer || !price) {
        // Якщо хоча б одне поле не заповнене, показуємо повідомлення про помилку
        document.getElementById('error-message').style.display = 'block';
    } else {
        // Якщо всі поля заповнені, приховуємо повідомлення про помилку
        document.getElementById('error-message').style.display = 'none';

        // Переходимо на сторінку станцій
        window.location.href = 'stations.html'; // Перенаправлення на сторінку станцій
    }
});
