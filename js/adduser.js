document.getElementById('addUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Очищаємо попередні повідомлення
    document.getElementById('loginError').innerText = '';
    document.getElementById('passwordError').innerText = '';
    document.getElementById('confirmPasswordError').innerText = '';
    document.getElementById('serverError').innerText = '';
    document.getElementById('successMessage').innerText = '';

    const username = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Перевірка на клієнті
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').innerText = 'Паролі не співпадають';
        return;
    }

    const token = localStorage.getItem('authToken');

    fetch('http://localhost:8080/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            username,
            password,
            confirmPassword
        })
    })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                if (data.username) {
                    document.getElementById('loginError').innerText = data.username;
                } else if (data.message) {
                    document.getElementById('serverError').innerText = data.message;
                } else {
                    for (const key in data) {
                        if (key.includes("password")) {
                            document.getElementById('passwordError').innerText = data[key];
                        }
                    }
                }
            } else {
                document.getElementById('successMessage').innerText = "✅ Користувача успішно додано!";
                setTimeout(() => {
                    window.location.href = "userslist.html";
                }, 1500);
            }
        })
        .catch(err => {
            document.getElementById('serverError').innerText = 'Помилка сервера';
        });
});
