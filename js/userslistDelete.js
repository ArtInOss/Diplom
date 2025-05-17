let userIdToDelete = null;

function confirmDeleteUser(id) {
    userIdToDelete = id;
    clearDeleteModalMessages();
    $('#deleteUserModal').modal('show');
}

function deleteUser() {
    if (userIdToDelete !== null) {
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:8080/api/admin/users/${userIdToDelete}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json().then(data => ({ ok: res.ok, body: data })))
            .then(({ ok, body }) => {
                if (!ok) {
                    showDeleteErrorMessage(body.message || "Сталась помилка при видаленні");
                    return;
                }

                const userRow = document.querySelector(`tr[data-id='${userIdToDelete}']`);
                if (userRow) userRow.remove();

                showDeleteSuccessMessage("Користувача успішно видалено!");

                setTimeout(() => {
                    $('#deleteUserModal').modal('hide');
                }, 1000);
            })
            .catch(() => {
                showDeleteErrorMessage("Помилка з'єднання з сервером");
            });
    }
}

function showDeleteSuccessMessage(msg) {
    const el = document.getElementById("deleteSuccessMessage");
    el.textContent = msg;
    el.classList.remove("d-none");
}

function showDeleteErrorMessage(msg) {
    const el = document.getElementById("deleteErrorMessage");
    el.textContent = msg;
    el.classList.remove("d-none");
}

function clearDeleteModalMessages() {
    document.getElementById("deleteSuccessMessage").classList.add("d-none");
    document.getElementById("deleteErrorMessage").classList.add("d-none");
    document.getElementById("deleteSuccessMessage").textContent = "";
    document.getElementById("deleteErrorMessage").textContent = "";
}

document.getElementById('confirmDeleteButton').addEventListener('click', deleteUser);
