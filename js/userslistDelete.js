// Функция для отображения модального окна удаления
let userIdToDelete = null;

function confirmDeleteUser(id) {
    userIdToDelete = id;
    $('#deleteUserModal').modal('show'); // Показываем модальное окно
}

function deleteUser() {
    if (userIdToDelete !== null) {
        // Здесь пока удаляется только строка в таблице
        const userRow = document.querySelector(`tr[data-id='${userIdToDelete}']`);
        if (userRow) {
            userRow.remove();
            console.log(`Пользователь с ID ${userIdToDelete} удален`);
            alert('Пользователь успешно удален!');
        }
        $('#deleteUserModal').modal('hide');
    }
}

document.getElementById('confirmDeleteButton').addEventListener('click', deleteUser);
