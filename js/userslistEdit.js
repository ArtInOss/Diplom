// Функция для заполнения полей модального окна данными пользователя
function editUser(id, login, firstName, lastName) {
    // Заполняем поля формы значениями пользователя
    document.getElementById('editLogin').value = login;
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editLastName').value = lastName;

    // При нажатии на кнопку "Сохранить изменения"
    document.getElementById('editUserForm').onsubmit = function (e) {
        e.preventDefault();

        const updatedUser = {
            id: id,
            login: document.getElementById('editLogin').value,
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value
        };

        // Находим строку с данным пользователем по его ID
        const userRow = document.querySelector(`tr[data-id='${id}']`);

        // Обновляем ячейки таблицы с новыми данными
        userRow.querySelector('.login').textContent = updatedUser.login;
        userRow.querySelector('.firstName').textContent = updatedUser.firstName;
        userRow.querySelector('.lastName').textContent = updatedUser.lastName;

        // Логика для обновления данных в БД или в другом месте (по желанию)
        console.log('Оновлений користувач:', updatedUser);

        // Показать уведомление о том, что данные обновлены
        alert('Дані користувача оновлені!');

        // Закрываем модальное окно после сохранения изменений
        $('#editUserModal').modal('hide');
    };
}
