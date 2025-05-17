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

    document.getElementById("errorText").textContent = "";
    document.getElementById("successText").textContent = "";

    currentField = fieldId;
}

function saveField() {
    const textInput = document.getElementById('textInput');
    const errorText = document.getElementById('errorText');
    const successText = document.getElementById('successText');
    const newValue = textInput.value.trim();
    const oldValue = originalValues[currentField];

    errorText.textContent = "";
    successText.textContent = "";

    if (currentField === 'userLogin' && newValue === '') {
        errorText.textContent = 'Логін не може бути порожнім!';
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
                return res.json().then(errorData => {
                    if (errorData.errors) {
                        const fieldMap = {
                            userLogin: 'username',
                            firstName: 'firstName',
                            lastName: 'lastName'
                        };
                        const backendField = fieldMap[currentField];
                        errorText.textContent = errorData.errors[backendField] || "Невідома помилка";
                    } else if (errorData.message) {
                        errorText.textContent = errorData.message;
                    } else {
                        errorText.textContent = "Помилка при збереженні.";
                    }
                    throw new Error("Validation error");
                });
            }
            return res.text();
        })
        .then(() => {
            document.getElementById(currentField).innerText = newValue;
            originalValues[currentField] = newValue;
            successText.textContent = "✅ Профіль оновлено!";

            // ⏳ Автоматичне закриття через 1.5 секунди
            setTimeout(() => {
                closeModal();
            }, 1500);
        })
        .catch(err => {
            console.warn("Помилка збереження:", err.message);
        });
}
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('errorText').textContent = "";
    document.getElementById('successText').textContent = "";
}
