// authcheck.js — підключати на захищених сторінках

function checkAuth(allowedRoles = []) {
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = "/authorization.html";
        return;
    }

    try {
        const decodedToken = jwt_decode(token);
        const role = decodedToken.role;

        if (!allowedRoles.includes(role)) {
            window.location.href = "/authorization.html";
        }

    } catch (e) {
        console.error("JWT decode error:", e);
        window.location.href = "/authorization.html";
    }
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = "/authorization.html";
}
