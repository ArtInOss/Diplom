// Локальный массив для хранения пользователей (используем localStorage)
let users = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('addUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Получаем значения из формы
    const user = {
        id: users.length + 1,  // генерируем ID для нового пользователя
        login: document.getElementById('login').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value
    };

    // Добавляем пользователя в массив
    users.push(user);

    // Сохраняем обновленный массив пользователей в localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Сповіщаємо про успіх
    alert('Користувача додано успішно!');

    // Очищаем форму
    document.getElementById('addUserForm').reset();

    // Перенаправляем на страницу со списком пользователей
    window.location.href = "userslist.html";
});
