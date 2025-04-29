document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Спочатку блокуємо стандартну відправку форми

        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const policyCheckbox = document.getElementById('policyCheckbox');

        // Перевірка, чи погодився з політикою конфіденційності


        // Перевірка відповідності паролів
        if (password !== confirmPassword) {
            alert("Паролі не збігаються. Перевірте ще раз.");
            return;
        }

        // Якщо все добре — перенаправляємо на user.html
        window.location.href = 'user.html';
    });
});

