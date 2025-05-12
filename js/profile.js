let currentField = '';
let isPasswordField = false;
let passwordValue = '••••••••';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    fetch("http://localhost:8080/api/user/profile", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Не вдалося завантажити профіль");
            return res.json();
        })
        .then(data => {
            document.getElementById("firstName").innerText = data.firstName || '';
            document.getElementById("lastName").innerText = data.lastName || '';
            document.getElementById("login").innerText = data.username || '';
            document.getElementById("password").innerText = passwordValue;
        })
        .catch(error => {
            alert("⚠️ Помилка: " + error.message);
            window.location.href = "authorization.html";
        });
});

function editField(label, fieldId, iconClass) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modalTitle').innerText = `${label}:`;
    document.getElementById('modalIcon').className = `fas ${iconClass}`;

    document.getElementById('passwordSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';

    const textInput = document.getElementById('textInput');
    textInput.value = document.getElementById(fieldId).innerText;
    textInput.placeholder = label;

    isPasswordField = false;
    currentField = fieldId;
}

function editPassword(label, iconClass) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modalTitle').innerText = `${label}:`;
    document.getElementById('modalIcon').className = `fas ${iconClass}`;

    document.getElementById('passwordSection').style.display = 'block';
    document.getElementById('textFieldSection').style.display = 'none';

    document.getElementById('modalInput').value = '';
    document.getElementById('confirmPassword').value = '';

    isPasswordField = true;
    currentField = 'password';
}

function saveField() {
    if (isPasswordField) {
        const newPassword = document.getElementById('modalInput').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (!newPassword || !confirmPassword) {
            alert('Пароль не може бути порожнім!');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Паролі не співпадають!');
            return;
        }

        passwordValue = newPassword;
        document.getElementById('password').innerText = '••••••••';
        alert("🔒 Зміна пароля поки не реалізована.");
        closeModal();
        return;
    }

    const newValue = document.getElementById('textInput').value.trim();
    if (currentField === 'login' && newValue === '') {
        alert('Логін не може бути порожнім!');
        return;
    }

    document.getElementById(currentField).innerText = newValue;
    closeModal();

    const token = localStorage.getItem('authToken');
    const updatedData = {
        firstName: document.getElementById("firstName").innerText,
        lastName: document.getElementById("lastName").innerText,
        username: document.getElementById("login").innerText
    };

    fetch("http://localhost:8080/api/user/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(updatedData)
    })
        .then(res => {
            if (!res.ok) throw new Error("Не вдалося оновити профіль");
            return res.text();
        })
        .then(msg => {
            console.log("✅", msg);
        })
        .catch(err => {
            alert("❌ " + err.message);
        });
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    passwordField.innerText = (passwordField.innerText === '••••••••') ? passwordValue : '••••••••';
}