function fazerLogin() {

  const nome = document.getElementById("username").value;

  localStorage.setItem("nomeUser", nome);

  window.location.href = "Dashboard.html";
}

function logout() {

  localStorage.removeItem("nomeUser");

  window.location.href = "Login.html";
}