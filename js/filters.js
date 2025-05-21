function showNotification(message) {
    const notif = document.getElementById('notification');
    if (notif) {
        notif.innerText = message;
        notif.style.display = 'block';
        setTimeout(() => notif.style.display = 'none', 4000);
    }
}

document.querySelectorAll('.connector').forEach(function (connector) {
    connector.addEventListener('click', function () {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.manufacturer').forEach(function (manufacturer) {
    manufacturer.addEventListener('click', function () {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.power-button').forEach(function (power) {
    power.addEventListener('click', function () {
        document.querySelectorAll('.power-button').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
    });
});

const range = document.getElementById('range');
const rangeInput = document.getElementById('rangeInput');
const rangeValue = document.getElementById('rangeValue');

rangeInput.addEventListener('input', function () {
    const value = rangeInput.value;
    range.value = value;
    rangeValue.textContent = value + ' км';
});

range.addEventListener('input', function () {
    const value = range.value;
    rangeInput.value = value;
    rangeValue.textContent = value + ' км';
});

const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

priceRange.addEventListener('input', function () {
    priceValue.textContent = `до ${priceRange.value} грн/кВт·год`;
});

document.getElementById('applyButton').addEventListener('click', function () {
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
                    try {
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
                        if (errors.message) {
                            showNotification(errors.message);
                        }
                    } catch (e) {
                        showNotification("Не вдалося знайти в станцію по обраним критеріям.");
                    }
                    return;
                }

                if (!text) {
                    showNotification("Не вдалося знайти станції за вказаними критеріями.");
                    return;
                }

                const result = JSON.parse(text);

                if (!result.allStations || result.allStations.length === 0) {
                    showNotification("Не вдалося знайти станції за вказаними критеріями.");
                    return;
                }

                // 💾 Сохраняем все данные для SSE
                localStorage.setItem("userLat", userLat);
                localStorage.setItem("userLng", userLng);
                localStorage.setItem("rangeKm", rangeKm.toString());
                localStorage.setItem("connectors", JSON.stringify(connectors));
                localStorage.setItem("manufacturers", JSON.stringify(manufacturers));
                localStorage.setItem("minPower", minPower.toString());
                localStorage.setItem("maxPricePerKwh", maxPricePerKwh.toString());
                localStorage.setItem("lastFilterRequest", JSON.stringify(filterData));

                localStorage.setItem("filteredStations", JSON.stringify(result.allStations));
                localStorage.setItem("topStations", JSON.stringify(result.topStations));

                window.location.href = "user.html";
            })
            .catch(error => {
                showNotification("Помилка при завантаженні станцій: " + error.message);
                console.error(error);
            });
    });
});
