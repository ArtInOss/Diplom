// Скрипт для переключения выбранных фільтрів

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
        document.querySelectorAll('.power-button').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Обновление значения запасу ходу
const range = document.getElementById('range');
const rangeInput = document.getElementById('rangeInput');
const rangeValue = document.getElementById('rangeValue');

rangeInput.addEventListener('input', function() {
    const value = rangeInput.value;
    range.value = value;
    rangeValue.textContent = value + ' км';
});

range.addEventListener('input', function() {
    const value = range.value;
    rangeInput.value = value;
    rangeValue.textContent = value + ' км';
});

const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

priceRange.addEventListener('input', function() {
    priceValue.textContent = `до ${priceRange.value} грн/кВт·год`;
});

// Обработка фильтрации

document.getElementById('applyButton').addEventListener('click', function () {
    // Очистка сообщений об ошибках
    document.getElementById('errorPower').style.display = 'none';
    document.getElementById('errorPrice').style.display = 'none';
    document.getElementById('errorRangeKm').style.display = 'none';

    const connectors = Array.from(document.querySelectorAll('.connector.selected')).map(el => el.querySelector('span').innerText.toUpperCase());
    const manufacturers = Array.from(document.querySelectorAll('.manufacturer.selected')).map(el => el.innerText.trim());
    const powerButton = document.querySelector('.power-button.selected');
    const minPower = powerButton ? parseInt(powerButton.innerText.trim()) : null;
    const maxPricePerKwh = parseFloat(document.getElementById('priceRange').value);
    const rangeKm = parseInt(document.getElementById('rangeInput').value);

    let hasError = false;

    if (!minPower) {
        document.getElementById('errorPower').textContent = "Будь ласка, оберіть потужність.";
        document.getElementById('errorPower').style.display = 'block';
        hasError = true;
    }

    if (!rangeKm || rangeKm === 0) {
        document.getElementById('errorRangeKm').textContent = "Будь ласка, вкажіть запас ходу.";
        document.getElementById('errorRangeKm').style.display = 'block';
        hasError = true;
    }

    if (!maxPricePerKwh || maxPricePerKwh <= 0) {
        document.getElementById('errorPrice').textContent = "Будь ласка, оберіть ціну.";
        document.getElementById('errorPrice').style.display = 'block';
        hasError = true;
    }

    if (hasError) return;

    navigator.geolocation.getCurrentPosition(function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const filterData = {
            connectors,
            manufacturers,
            minPower,
            maxPricePerKwh,
            userLat,
            userLng,
            rangeKm
        };

        fetch("http://localhost:8080/api/stations/filter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filterData)
        })
            .then(async response => {
                const text = await response.text();
                if (!response.ok) {
                    const errors = JSON.parse(text);
                    if (errors.minPower) {
                        document.getElementById('errorPower').textContent = errors.minPower;
                        document.getElementById('errorPower').style.display = 'block';
                    }
                    if (errors.rangeKm) {
                        document.getElementById('errorRangeKm').textContent = errors.rangeKm;
                        document.getElementById('errorRangeKm').style.display = 'block';
                    }
                    if (errors.maxPricePerKwh) {
                        document.getElementById('errorPrice').textContent = errors.maxPricePerKwh;
                        document.getElementById('errorPrice').style.display = 'block';
                    }
                    return;
                }

                const result = JSON.parse(text);

                // ⬇ Сохраняем все станции и топ-10 по отдельности
                localStorage.setItem("filteredStations", JSON.stringify(result.allStations));
                localStorage.setItem("topStations", JSON.stringify(result.topStations));

                // Переход на карту
                window.location.href = "user.html";
            })
            .catch(error => {
                alert("Помилка при завантаженні станцій: " + error.message);
                console.error(error);
            });
    });
});
