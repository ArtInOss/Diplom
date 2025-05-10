document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const checkbox = document.getElementById('privacyCheck');

        // Перевірка: паролі збігаються?
        if (password !== confirmPassword) {
            alert("Паролі не збігаються!");
            return;
        }

        // Перевірка: чи погоджено політику?
        if (!checkbox.checked) {
            alert("Ви повинні погодитись з політикою конфіденційності.");
            return;
        }

        // Надсилаємо запит на бекенд
        fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(response => response.text())
            .then(message => {
                alert(message);

                // Якщо успішно — перенаправляємо на логін
                if (message.includes("Успішна")) {
                    window.location.href = "authorization.html";
                }
            })
            .catch(error => {
                console.error("Помилка при реєстрації:", error);
                alert("Сталася помилка. Спробуйте пізніше.");
            });
    });
});
