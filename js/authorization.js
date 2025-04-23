// Захардкоженные данные для авторизации
const users = {
    'user': '1234', // Логин и пароль для успешного входа
};

// Функция для проверки авторизации
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Предотвращаем отправку формы

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Проверка введенных данных с захардкоженными данными
    if (users[username] && users[username] === password) {
        alert('Авторизація успішна!');
        window.location.href = 'user.html';
    } else {
        errorMessage.textContent = "Невірний логін або пароль!";
    }
});
