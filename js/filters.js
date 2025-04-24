// Скрипт для переключения выбранных фильтров
document.querySelectorAll('.connector').forEach(function(connector) {
    connector.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.manufacturer').forEach(function(manufacturer) {
    manufacturer.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.power-button').forEach(function(power) {
    power.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

// Обновление значения запас хода
// Получаем элементы
const range = document.getElementById('range');
const rangeInput = document.getElementById('rangeInput');
const rangeValue = document.getElementById('rangeValue');

// Обновляем значение ползунка и поля ввода
rangeInput.addEventListener('input', function() {
    const value = rangeInput.value;
    range.value = value;
    rangeValue.textContent = value + ' км'; // Обновляем текст на экране
});

// Обновляем значение поля ввода при изменении ползунка
range.addEventListener('input', function() {
    const value = range.value;
    rangeInput.value = value;
    rangeValue.textContent = value + ' км'; // Обновляем текст на экране
});

