document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');

    function clearErrors() {
        document.getElementById("errorUsername").textContent = "";
        document.getElementById("errorPassword").textContent = "";
        document.getElementById("errorConfirmPassword").textContent = "";
    }

    function showSuccessMessage(message, redirectUrl) {
        const alert = document.createElement("div");
        alert.className = "alert alert-success position-fixed shadow";
        alert.style.top = "20px";
        alert.style.right = "20px";
        alert.style.zIndex = "9999";
        alert.textContent = message;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
            window.location.href = redirectUrl || "/authorization.html";
        }, 1500);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();

        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const checkbox = document.getElementById('privacyCheck');

        let hasClientError = false;

        if (password !== confirmPassword) {
            document.getElementById("errorConfirmPassword").textContent = "Паролі не збігаються.";
            hasClientError = true;
        }

        if (!checkbox.checked) {
            alert("Ви повинні погодитись з політикою конфіденційності.");
            hasClientError = true;
        }

        if (hasClientError) return;

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
            .then(res => res.json().then(data => {
                if (!res.ok) {
                    throw data;
                }
                return data;
            }))
            .then(data => {
                showSuccessMessage(data.message || "Реєстрація успішна!", data.redirectUrl);
            })
            .catch(err => {
                if (err.message) {
                    const msg = err.message.toLowerCase();

                    if (msg.includes("логін")) {
                        document.getElementById("errorUsername").textContent = err.message;
                    } else if (msg.includes("пароль") && !msg.includes("підтвердження")) {
                        document.getElementById("errorPassword").textContent = err.message;
                    } else if (msg.includes("підтвердження")) {
                        document.getElementById("errorConfirmPassword").textContent = err.message;
                    } else {
                        alert("Помилка: " + err.message);
                    }
                } else {
                    alert("Сталася помилка при реєстрації.");
                }
            });
    });
});
