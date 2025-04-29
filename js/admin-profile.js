let currentField = '';
let isPasswordField = false;
let passwordValue = 'password123'; // Переменная для хранения текущего реального пароля

// Открытие модалки для обычных полей
function editField(label, fieldId, iconClass) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modalTitle').innerText = `${label}:`;
    document.getElementById('modalIcon').className = `fas ${iconClass}`;

    document.getElementById('passwordSection').style.display = 'none';
    document.getElementById('textFieldSection').style.display = 'block';

    const textInput = document.getElementById('textInput');
    textInput.value = document.getElementById(fieldId).innerText;
    textInput.placeholder = label; // Пишем плейсхолдер по полю

    isPasswordField = false;
    currentField = fieldId;
}

// Открытие модалки для пароля
function editPassword(label, iconClass) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modalTitle').innerText = `${label}:`;
    document.getElementById('modalIcon').className = `fas ${iconClass}`;

    document.getElementById('passwordSection').style.display = 'block';
    document.getElementById('textFieldSection').style.display = 'none';

    const modalInput = document.getElementById('modalInput');
    modalInput.value = '';
    modalInput.placeholder = 'Новий пароль';

    const confirmPassword = document.getElementById('confirmPassword');
    confirmPassword.value = '';
    confirmPassword.placeholder = 'Повторіть пароль';

    isPasswordField = true;
    currentField = 'password';
}

// Сохраняем изменения
function saveField() {
    if (isPasswordField) {
        const newPassword = document.getElementById('modalInput').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (newPassword === '' || confirmPassword === '') {
            alert('Пароль не може бути порожнім!');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Паролі не співпадають!');
            return;
        }
        passwordValue = newPassword;
        document.getElementById(currentField).innerText = '••••••••';
    } else {
        const newValue = document.getElementById('textInput').value.trim();

        // Проверяем только для логина
        if (currentField === 'login' && newValue === '') {
            alert('Логін не може бути порожнім!');
            return;
        }

        document.getElementById(currentField).innerText = newValue;
    }
    closeModal();
}
// Закрытие модалки
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Показать/скрыть пароль на основной странице профиля
function togglePassword() {
    const passwordField = document.getElementById('password');
    if (passwordField.innerText === '••••••••') {
        passwordField.innerText = passwordValue; // Показываем реальный пароль
    } else {
        passwordField.innerText = '••••••••';
    }
}

// Показать/скрыть пароль в модалке редактирования
function toggleModalPassword() {
    const input = document.getElementById('modalInput');
    const eyeIcon = document.getElementById('eyeIcon');

    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}
