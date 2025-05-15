document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = ''; // очищення повідомлення

    if (!username || !password) {
        errorMessage.textContent = "Будь ласка, введіть логін і пароль!";
        return;
    }

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
        .then(async response => {
            if (!response.ok) {
                // намагаємось зчитати message з JSON
                const errorData = await response.json().catch(() => null);
                const message = errorData?.message || "Невідома помилка сервера.";
                throw new Error(message);
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.token) {
                localStorage.setItem('authToken', data.token);
                window.location.href = data.redirectUrl;
            } else {
                errorMessage.textContent = data.message || "Невірний логін або пароль!";
            }
        })
        .catch(error => {
            console.error('Помилка авторизації:', error);
            errorMessage.textContent = error.message;
        });
});
