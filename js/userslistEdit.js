let currentEditingUserId = null;

function editUser(id) {
    currentEditingUserId = id;

    const userRow = document.querySelector(`tr[data-id='${id}']`);
    const login = userRow.querySelector('.login').textContent.trim();
    const firstName = userRow.querySelector('.firstName').textContent.trim();
    const lastName = userRow.querySelector('.lastName').textContent.trim();

    document.getElementById('editLogin').value = login;
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editLastName').value = lastName;
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("editUserForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        // clearErrors(); — більше не викликається

        const token = localStorage.getItem("authToken");

        const updatedUser = {
            username: document.getElementById("editLogin").value.trim(),
            firstName: document.getElementById("editFirstName").value.trim(),
            lastName: document.getElementById("editLastName").value.trim()
        };

        fetch(`http://localhost:8080/api/admin/users/${currentEditingUserId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(updatedUser)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(() => {
                const row = document.querySelector(`tr[data-id='${currentEditingUserId}']`);
                row.querySelector('.login').textContent = updatedUser.username;
                row.querySelector('.firstName').textContent = updatedUser.firstName;
                row.querySelector('.lastName').textContent = updatedUser.lastName;

                $('#editUserModal').modal('hide');
            })
            .catch(err => {
                if (err.errors) {
                    if (err.errors.username) alert(err.errors.username);
                    if (err.errors.firstName) alert(err.errors.firstName);
                    if (err.errors.lastName) alert(err.errors.lastName);
                } else if (err.message) {
                    alert(err.message);
                } else {
                    alert("Сталась помилка при оновленні користувача");
                }
            });
    });
});
