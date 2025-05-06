// Видалення користувача через модальне вікно
let userIdToDelete = null;

function confirmDeleteUser(id) {
    userIdToDelete = id;
    $('#deleteUserModal').modal('show');
}

function deleteUser() {
    if (userIdToDelete !== null) {
        // видалення рядку у таблиці
        const userRow = document.querySelector(`tr[data-id='${userIdToDelete}']`);
        if (userRow) {
            userRow.remove();
            console.log(`Користувач з ID ${userIdToDelete} видалений`);
            alert('Користувач успішно видалений!');
        }
        $('#deleteUserModal').modal('hide');
    }
}

document.getElementById('confirmDeleteButton').addEventListener('click', deleteUser);
