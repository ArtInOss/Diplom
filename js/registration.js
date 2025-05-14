document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const checkbox = document.getElementById('privacyCheck');

        if (password !== confirmPassword) {
            alert("Паролі не збігаються!");
            return;
        }

        if (!checkbox.checked) {
            alert("Ви повинні погодитись з політикою конфіденційності.");
            return;
        }

        fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                confirmPassword: confirmPassword
            })
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            })
            .catch(err => {
                alert("❌ Помилка: " + err.message);
            });
    });
});
