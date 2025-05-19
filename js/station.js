let stationToDelete = null;
let currentConnectors = [];

function loadStations() {
    const token = localStorage.getItem('authToken');
    fetch("http://localhost:8080/api/stations", {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(response => {
            if (!response.ok) throw new Error(`Помилка: ${response.status}`);
            return response.json();
        })
        .then(stations => {
            const tbody = document.getElementById('stationsTable');
            tbody.innerHTML = '';
            stations.forEach(station => {
                const connectorsStr = station.connectors ? station.connectors.split(',').map(c => c.trim()).join(' | ') : '';
                const tr = document.createElement('tr');
                tr.dataset.id = station.id;
                tr.innerHTML = `
                    <td>${station.id}</td>
                    <td>${station.powerKw} кВт</td>
                    <td>${station.locationName}</td>
                    <td>${station.address}</td>
                    <td>${connectorsStr}</td>
                    <td>${station.pricePerKwh} грн/кВт-год</td>
                    <td>${station.status}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${station.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStation(${station.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Помилка завантаження:', error);
            showErrorMessage('Не вдалося завантажити зарядні станції.');
        });
}

function deleteStation(id) {
    stationToDelete = id;
    $('#deleteStationModal').modal('show');
}

function showSuccessMessage(message) {
    const alertContainer = document.getElementById('alertContainer');
    const alertMessage = document.getElementById('alertMessage');
    if (alertContainer && alertMessage) {
        alertMessage.textContent = message;
        alertContainer.classList.remove('alert-danger');
        alertContainer.classList.add('alert-success');
        alertContainer.style.display = 'block';
        setTimeout(() => $(alertContainer).fadeOut(), 4000);
    }
}

function showErrorMessage(message) {
    const alertContainer = document.getElementById('alertContainer');
    const alertMessage = document.getElementById('alertMessage');
    if (alertContainer && alertMessage) {
        alertMessage.textContent = message;
        alertContainer.classList.remove('alert-success');
        alertContainer.classList.add('alert-danger');
        alertContainer.style.display = 'block';
        setTimeout(() => {
            $(alertContainer).fadeOut(() => {
                alertContainer.classList.remove('alert-danger');
                alertContainer.classList.add('alert-success');
            });
        }, 5000);
    }
}

function clearFieldErrors() {
    const fields = [
        'errorLocationName',
        'errorCoordinates',
        'errorConnectors',
        'errorPricePerKwh'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = '';
    });
}

function addConnector() {
    const select = document.getElementById('editConnectorSelect');
    const value = select.value;
    if (!currentConnectors.includes(value)) {
        currentConnectors.push(value);
        renderConnectors();
    }
}

function removeConnector(value) {
    currentConnectors = currentConnectors.filter(c => c !== value);
    renderConnectors();
}

function renderConnectors() {
    const container = document.getElementById('editConnectorContainer');
    container.innerHTML = '';

    currentConnectors.forEach(connector => {
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center mb-2';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control mr-2';
        input.value = connector;
        input.disabled = true;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btn.onclick = () => removeConnector(connector);

        div.appendChild(input);
        div.appendChild(btn);
        container.appendChild(div);
    });
}

function openEditModal(id) {
    const token = localStorage.getItem('authToken');
    fetch(`http://localhost:8080/api/stations/${id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(async res => {
            if (!res.ok) {
                const errorText = await extractErrorMessage(res);
                throw new Error(errorText);
            }
            return res.json();
        })
        .then(station => {
            $('#editId').val(station.id);
            $('#editLocationName').val(station.locationName);
            $('#editPowerKw').val(station.powerKw);
            $('#editAddress').val(station.address);
            $('#editManufacturer').val(station.manufacturer);
            $('#editPricePerKwh').val(station.pricePerKwh);
            $('#editStatus').val(station.status);
            $('#editLatitude').val(station.latitude);
            $('#editLongitude').val(station.longitude);

            currentConnectors = station.connectors ? station.connectors.split(',').map(c => c.trim()) : [];
            renderConnectors();

            $('#editStationModal').modal('show');
        })
        .catch(err => {
            console.error(err);
            showErrorMessage('Помилка при завантаженні даних станції');
        });
}

async function extractErrorMessage(response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        return json.message || JSON.stringify(json);
    }
    return await response.text();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmDeleteButton')?.addEventListener('click', () => {
        if (!stationToDelete) return;
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:8080/api/stations/${stationToDelete}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                if (!response.ok) throw new Error('Не вдалося видалити станцію');
                document.querySelector(`tr[data-id="${stationToDelete}"]`)?.remove();
                $('#deleteStationModal').modal('hide');
                showSuccessMessage('Станцію успішно видалено.');
            })
            .catch(error => {
                console.error(error);
                showErrorMessage('Помилка при видаленні станції.');
            })
            .finally(() => stationToDelete = null);
    });

    document.addEventListener('click', function (e) {
        if (e.target.closest('.edit-btn')) {
            const id = e.target.closest('.edit-btn').dataset.id;
            openEditModal(id);
        }
    });

    document.getElementById('editStationForm').addEventListener('submit', function (e) {
        e.preventDefault();
        clearFieldErrors();

        const id = $('#editId').val();
        const token = localStorage.getItem('authToken');

        const payload = {
            locationName: $('#editLocationName').val().trim(),
            powerKw: parseInt($('#editPowerKw').val(), 10),
            address: $('#editAddress').val().trim(),
            connectors: currentConnectors.join(','),
            manufacturer: $('#editManufacturer').val().trim(),
            pricePerKwh: parseFloat($('#editPricePerKwh').val()),
            status: $('#editStatus').val(),
            latitude: parseFloat($('#editLatitude').val()),
            longitude: parseFloat($('#editLongitude').val())
        };

        fetch(`http://localhost:8080/api/stations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                if (!res.ok) {
                    const errorText = await extractErrorMessage(res);
                    throw new Error(errorText);
                }
                $('#editStationModal').modal('hide');
                showSuccessMessage("Станцію оновлено успішно");
                loadStations();
            })
            .catch(err => {
                const errorText = err.message || 'Невідома помилка';

                if (errorText.includes('назвою')) {
                    document.getElementById('errorLocationName').innerText = 'Ця назва вже використовується.';
                } else if (errorText.includes('координатами')) {
                    document.getElementById('errorCoordinates').innerText = 'Ці координати вже зайняті.';
                } else if (
                    errorText.toLowerCase().includes('широта') ||
                    errorText.toLowerCase().includes('довгота') ||
                    errorText.toLowerCase().includes('latitude') ||
                    errorText.toLowerCase().includes('longitude')
                ) {
                    document.getElementById('errorCoordinates').innerText = errorText;
                } else if (errorText.includes('конектор')) {
                    document.getElementById('errorConnectors').innerText = errorText;
                } else if (errorText.includes('Ціна') || errorText.includes('Тариф')) {
                    document.getElementById('errorPricePerKwh').innerText = errorText;
                } else {
                    showErrorMessage("Не вдалося оновити станцію. " + errorText);
                }
            });
    });

    loadStations();
});
