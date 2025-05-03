// Локальний масив для зберігання користувачів
let users = [];

document.getElementById('addUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Отримуємо значення з форми
    const user = {
        login: document.getElementById('login').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value
    };

    // Додаємо користувача в масив
    users.push(user);

    // Виводимо всіх користувачів в консоль для перевірки
    console.log(users);

    // Сповіщаємо про успіх і очищаємо форму
    alert('Користувача додано успішно!');
    document.getElementById('addUserForm').reset();
});
