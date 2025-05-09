document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = ''; // очищення повідомлення

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = data.redirectUrl;
            } else {
                errorMessage.textContent = "Невірний логін або пароль!";
            }
        })
        .catch(error => {
            console.error('Помилка авторизації:', error);
            errorMessage.textContent = "Щось пішло не так! Сервер недоступний або сталася помилка.";
        });
})
