document.getElementById('addStationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const locationName = document.getElementById('locationName').value.trim();
    const power = document.getElementById('power').value;
    const address = document.getElementById('address').value.trim();
    const connectors = [...document.querySelectorAll('#connectorContainer select')].map(select => select.value);
    const manufacturer = document.getElementById('manufacturer').value;
    const price = document.getElementById('price').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    const token = localStorage.getItem("authToken");

    // Очистка попередніх повідомлень
    ["locationName", "power", "address", "price", "latitude", "longitude", "connector"].forEach(field => {
        const errorElement = document.getElementById(field + "Error");
        if (errorElement) errorElement.innerText = "";
    });

    if (!locationName || !power || !address || !manufacturer || !price || !latitude || !longitude) {
        alert("Заповніть усі обов’язкові поля.");
        return;
    }

    if (connectors.length === 0) {
        const connError = document.getElementById("connectorError");
        if (connError) connError.innerText = "Додайте хоча б один конектор.";
        return;
    }

    if (!Number.isInteger(Number(power)) || power <= 0) {
        document.getElementById("powerError").innerText = "Потужність повинна бути позитивним цілим числом.";
        return;
    }

    if (isNaN(price) || price <= 0) {
        document.getElementById("priceError").innerText = "Ціна повинна бути позитивним числом.";
        return;
    }

    const coordinateRegex = /^-?\d+(\.\d+)?$/;
    if (!coordinateRegex.test(latitude)) {
        document.getElementById("latitudeError").innerText = "Невірна широта.";
        return;
    }

    if (!coordinateRegex.test(longitude)) {
        document.getElementById("longitudeError").innerText = "Невірна довгота.";
        return;
    }

    if (latitude < -90 || latitude > 90) {
        document.getElementById("latitudeError").innerText = "Широта має бути в межах -90 до 90.";
        return;
    }

    if (longitude < -180 || longitude > 180) {
        document.getElementById("longitudeError").innerText = "Довгота має бути в межах -180 до 180.";
        return;
    }

    const stationData = {
        locationName,
        address,
        powerKw: parseInt(power),
        connectors: connectors.join(','),
        manufacturer,
        pricePerKwh: parseFloat(price),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: "ACTIVE"
    };

    fetch("http://localhost:8080/api/stations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(stationData)
    })
        .then(async res => {
            const contentType = res.headers.get("Content-Type");

            if (!res.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    if (data.errors) {
                        Object.keys(data.errors).forEach(key => {
                            const errorId = key + "Error";
                            if (document.getElementById(errorId)) {
                                document.getElementById(errorId).innerText = data.errors[key];
                            }
                        });
                    } else if (data.message) {
                        document.getElementById("locationNameError").innerText = data.message;
                    }
                } else {
                    throw new Error("Сервер повернув не-JSON (наприклад, 403 або 500 без тіла)");
                }
                return;
            }

            // 🟢 Успішне повідомлення
            const messageBox = document.getElementById("successMessage");
            messageBox.classList.remove("d-none");

            setTimeout(() => {
                window.location.href = "stations.html";
            }, 1500);
        })
        .catch(err => {
            alert("Помилка під час з'єднання з сервером.");
            console.error(err);
        });
});

// ➕ Додавання конектора
document.getElementById('addConnector').addEventListener('click', function() {
    const connectorContainer = document.getElementById('connectorContainer');
    const newConnector = document.createElement('div');
    newConnector.classList.add('d-flex', 'mb-2', 'connector-row');
    newConnector.innerHTML = `
        <select class="form-control" required>
            <option value="CCS2">CCS2</option>
            <option value="GB/T">GB/T</option>
            <option value="CHAdeMO">CHAdeMO</option>
        </select>
        <button type="button" class="btn btn-danger remove-connector ml-2">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    connectorContainer.appendChild(newConnector);
    updateRemoveButtonEvent();
});

function updateRemoveButtonEvent() {
    document.querySelectorAll('.remove-connector').forEach(button => {
        button.onclick = function () {
            this.parentElement.remove();
        };
    });
}
