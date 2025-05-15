let currentField = '';

// Завантаження профілю адміністратора при відкритті сторінки
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    fetch("http://localhost:8080/api/admin/profile", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Не вдалося завантажити профіль адміністратора");
            return res.json();
        })
        .then(data => {
            document.getElementById("firstName").innerText = data.firstName || '';
            document.getElementById("lastName").innerText = data.lastName || '';
            document.getElementById("login").innerText = data.username || '';
        })
        .catch(err => {
            alert("❌ " + err.message);
            window.location.href = "authorization.html";
        });
});

function editField(label, fieldId, iconClass) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modalTitle').innerText = `${label}:`;
    document.getElementById('modalIcon').className = `fas ${iconClass}`;

    const textInput = document.getElementById('textInput');
    textInput.value = document.getElementById(fieldId).innerText;
    textInput.placeholder = label;

    currentField = fieldId;
}

function saveField() {
    const newValue = document.getElementById('textInput').value.trim();

    if (newValue === '') {
        alert('Поле не може бути порожнім!');
        return;
    }

    closeModal(); // ховаємо модалку — але DOM не оновлюємо поки що

    const token = localStorage.getItem('authToken');
    const updatedData = {
        firstName: document.getElementById("firstName").innerText,
        lastName: document.getElementById("lastName").innerText,
        username: document.getElementById("login").innerText
    };

    // оновлюємо тільки одне поле, яке редагували
    updatedData[currentField === "login" ? "username" : currentField] = newValue;

    fetch("http://localhost:8080/api/admin/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(updatedData)
    })
        .then(async res => {
            const body = await res.json();

            if (!res.ok) {
                if (body.errors) {
                    const messages = Object.values(body.errors).join('\n');
                    throw new Error(messages);
                } else {
                    throw new Error(body.message || "Сталась помилка");
                }
            }

            // ✅ Тільки тут оновлюємо DOM після успішного збереження
            document.getElementById(currentField).innerText = newValue;
            alert("✅ " + (body.message || "Дані адміністратора оновлено"));
        })
        .catch(err => {
            alert("❌ " + (err.message || "Невідома помилка"));
        });
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}
