const eventSource = new EventSource("http://localhost:8080/api/sse/updates");

eventSource.onmessage = async function(event) {
    console.log("📡 Отримано SSE оновлення:", event.data);

    const userLat = localStorage.getItem("userLat");
    const userLng = localStorage.getItem("userLng");
    const rangeKm = localStorage.getItem("rangeKm");
    const connectors = localStorage.getItem("connectors");
    const manufacturers = localStorage.getItem("manufacturers");
    const minPower = localStorage.getItem("minPower");
    const maxPricePerKwh = localStorage.getItem("maxPricePerKwh");

    if (userLat && userLng && rangeKm) {
        try {
            const response = await fetch("http://localhost:8080/api/stations/filter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("authToken")
                },
                body: JSON.stringify({
                    userLat: parseFloat(userLat),
                    userLng: parseFloat(userLng),
                    rangeKm: parseInt(rangeKm),
                    connectors: connectors ? JSON.parse(connectors) : null,
                    manufacturers: manufacturers ? JSON.parse(manufacturers) : null,
                    minPower: minPower ? parseFloat(minPower) : null,
                    maxPricePerKwh: maxPricePerKwh ? parseFloat(maxPricePerKwh) : null
                })
            });

            if (!response.ok) {
                throw new Error("❌ Сервер повернув помилку: " + response.status);
            }

            const data = await response.json();
            console.log("✅ Дані після SSE:", data);

            const allStations = data.allStations || [];
            const topStations = data.topStations || [];

            // Очистить старые данные
            localStorage.removeItem("filteredStations");
            localStorage.removeItem("topStations");

            localStorage.setItem("filteredStations", JSON.stringify(allStations));
            localStorage.setItem("topStations", JSON.stringify(topStations));

            if (typeof updateMapWithStations === "function") {
                updateMapWithStations(allStations);
            }

            if (typeof updateTopStationsSidebar === "function") {
                updateTopStationsSidebar(topStations);
            }

        } catch (e) {
            console.error("❌ Помилка SSE-обробки:", e);
            location.reload(); // fallback
        }
    } else {
        console.warn("⚠️ Дані користувача не вказані — SSE не активний");
    }
};
