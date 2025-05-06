function editUser(id) {
    // Ищем строку таблицы по ID
    const userRow = document.querySelector(`tr[data-id='${id}']`);

    // Получаем данные пользователя из таблицы
    const login = userRow.querySelector('.login').textContent;
    const firstName = userRow.querySelector('.firstName').textContent;
    const lastName = userRow.querySelector('.lastName').textContent;

    // Заполняем поля формы в модальном окне
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

        // Извлекаем данные о пользователях из localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Находим индекс пользователя по его ID и обновляем данные
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users[index] = updatedUser; // Обновляем пользователя
        }

        // Сохраняем обновленные данные в localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Находим строку с данным пользователем по его ID в таблице
        const userRow = document.querySelector(`tr[data-id='${id}']`);

        // Обновляем ячейки таблицы с новыми данными
        userRow.querySelector('.login').textContent = updatedUser.login;
        userRow.querySelector('.firstName').textContent = updatedUser.firstName;
        userRow.querySelector('.lastName').textContent = updatedUser.lastName;

        // Показать уведомление о том, что данные обновлены
        alert('Дані користувача оновлені!');

        // Закрываем модальное окно после сохранения изменений
        $('#editUserModal').modal('hide');
    };
}
