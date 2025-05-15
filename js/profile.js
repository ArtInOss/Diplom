let currentField = '';
let originalValues = {};

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
            document.getElementById("userLogin").innerText = data.username || '';

            // Зберігаємо оригінальні значення
            originalValues = {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                userLogin: data.username || ''
            };
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

    const textInput = document.getElementById('textInput');
    textInput.value = document.getElementById(fieldId).innerText;
    textInput.placeholder = label;

    currentField = fieldId;
}

function saveField() {
    const textInput = document.getElementById('textInput');
    const newValue = textInput.value.trim();
    const oldValue = originalValues[currentField]; // збережене значення

    if (currentField === 'userLogin' && newValue === '') {
        alert('Логін не може бути порожнім!');
        return;
    }

    const updatedData = {
        firstName: currentField === "firstName" ? newValue : document.getElementById("firstName").innerText,
        lastName: currentField === "lastName" ? newValue : document.getElementById("lastName").innerText,
        username: currentField === "userLogin" ? newValue : document.getElementById("userLogin").innerText
    };

    const token = localStorage.getItem('authToken');

    fetch("http://localhost:8080/api/user/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(updatedData)
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(msg => {
                    throw new Error(msg);
                });
            }
            return res.text();
        })
        .then(msg => {
            document.getElementById(currentField).innerText = newValue;
            originalValues[currentField] = newValue; // оновлюємо збережене значення
            closeModal();
            console.log("✅", msg);
        })
        .catch(err => {
            // відкат до старого значення
            document.getElementById(currentField).innerText = oldValue;
            alert("❌ " + err.message);
            closeModal();
        });
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}
