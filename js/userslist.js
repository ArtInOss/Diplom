document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Ви не авторизовані");
        return;
    }

    fetch("http://localhost:8080/api/admin/users", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Не вдалося завантажити користувачів");
            }
            return response.json();
        })
        .then(users => {
            const tbody = document.getElementById("userTableBody");
            tbody.innerHTML = "";

            users.forEach(user => {
                const row = document.createElement("tr");
                row.setAttribute("data-id", user.id);
                row.innerHTML = `
                <td class="text-center">${user.id}</td>
                <td class="login">${user.username}</td>
                <td class="firstName">${user.firstName}</td>
                <td class="lastName">${user.lastName}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm mr-1" data-toggle="modal" data-target="#editUserModal" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${user.id})"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
                tbody.appendChild(row);
            });

            // Реалізація пошуку
            const searchInput = document.getElementById("searchInput");
            searchInput.addEventListener("input", function () {
                const filter = searchInput.value.toLowerCase();
                const rows = tbody.querySelectorAll("tr");

                rows.forEach(row => {
                    const username = row.querySelector(".login").textContent.toLowerCase();
                    const firstName = row.querySelector(".firstName").textContent.toLowerCase();
                    const lastName = row.querySelector(".lastName").textContent.toLowerCase();

                    const match = username.includes(filter) || firstName.includes(filter) || lastName.includes(filter);
                    row.style.display = match ? "" : "none";
                });
            });
        })
        .catch(error => {
            console.error("Помилка при завантаженні користувачів:", error);
            alert("Сталась помилка при отриманні користувачів");
        });
});
