function checkAuth(allowedRoles) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        redirectToLogin();
        return;
    }

    fetch("http://localhost:8080/api/auth/check", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Unauthorized");
            }
            return res.json();
        })
        .then(data => {
            const userRoles = data.roles || [];
            const hasAccess = userRoles.some(role => allowedRoles.includes(role));
            if (!hasAccess) {
                redirectToLogin();
            }
            // Тут можна показати username на сторінці, якщо потрібно:
            // document.getElementById("usernameLabel").textContent = data.username;
        })
        .catch(() => {
            redirectToLogin();
        });
}

function redirectToLogin() {
    localStorage.removeItem("authToken");
    window.location.href = "/authorization.html";
}
