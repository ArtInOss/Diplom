function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "authorization.html";
}