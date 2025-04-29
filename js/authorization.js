// Захардкожені дані користувачів
const users = {
    'user': {
        password: 'user123',
        redirect: 'user.html'
    },
    'admin': {
        password: 'admin123',
        redirect: 'admin.html'
    }
};

// Обробник форми входу
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (users[username] && users[username].password === password) {
        // Успішна авторизація
        window.location.href = users[username].redirect;
    } else {
        // Помилка: логін або пароль не співпадає
        errorMessage.textContent = "Невірний логін або пароль!";
    }
});
