function loadDashboard() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return (window.location.href = "index.html");

    document.getElementById("username").innerText = user.username;
    document.getElementById("role").innerText = user.role;

    if (user.role === "admin") document.getElementById("adminSection").style.display = "block";
    if (user.role === "editor") document.getElementById("editorSection").style.display = "block";
}

const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
};

window.onload = loadDashboard;