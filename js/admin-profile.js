let currentField = '';

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
    document.getElementById('textInput').value = document.getElementById(fieldId).innerText;
    document.getElementById('textInput').placeholder = label;

    clearMessages();
    currentField = fieldId;
}

function saveField() {
    const newValue = document.getElementById('textInput').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const token = localStorage.getItem('authToken');

    if (currentField === 'login' && newValue === '') {
        errorMessage.textContent = 'Логін не може бути порожнім!';
        return;
    }

    const updatedData = {
        firstName: document.getElementById("firstName").innerText,
        lastName: document.getElementById("lastName").innerText,
        username: document.getElementById("login").innerText
    };
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
                    const msg = Object.values(body.errors).join(', ');
                    throw new Error(msg);
                } else {
                    throw new Error(body.message || "Сталась помилка");
                }
            }

            document.getElementById(currentField).innerText = newValue;
            errorMessage.textContent = "";
            successMessage.textContent = "Профіль оновлено успішно!";

            setTimeout(() => {
                closeModal();
            }, 1500);
        })
        .catch(err => {
            errorMessage.textContent = err.message || "Невідома помилка";
        });
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('textInput').value = '';
    clearMessages();
}

function clearMessages() {
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('successMessage').textContent = '';
}
