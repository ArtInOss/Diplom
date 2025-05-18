function escapeForJS(str) {
    if (!str) return '';
    return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}

let stationToDelete = null;

function deleteStation(id) {
    stationToDelete = id;
    $('#deleteStationModal').modal('show');
}

document.getElementById('confirmDeleteButton').onclick = function () {
    if (!stationToDelete) return;

    const row = document.querySelector(`tr[data-id="${stationToDelete}"]`);
    if (row) row.remove();

    $('#deleteStationModal').modal('hide');
    alert('Зарядна станція була видалена!');
    stationToDelete = null;
};

function loadStations() {
    console.log('Загрузка станцій...');
    const token = localStorage.getItem('authToken');
    fetch("http://localhost:8080/api/stations", {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) throw new Error(`Помилка: ${response.status}`);
            return response.json();
        })
        .then(stations => {
            const tbody = document.getElementById('stationsTable');
            tbody.innerHTML = '';
            stations.forEach(station => {
                let connectorsArray = [];
                if (station.connectors) {
                    connectorsArray = typeof station.connectors === 'string'
                        ? station.connectors.split(',').map(c => c.trim())
                        : station.connectors;
                }
                const connectorsStr = connectorsArray.join(' | ');
                const safeLocationName = escapeForJS(station.locationName || '');
                const safeAddress = escapeForJS(station.address || '');

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
                        <button class="btn btn-warning btn-sm" disabled>
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
            alert('Не вдалося завантажити зарядні станції.');
        });
}

document.addEventListener('DOMContentLoaded', loadStations);
