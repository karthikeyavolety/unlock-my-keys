document.getElementById("loginForm").onsubmit = function () {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username == "" || password == "") {
        alert("Please fill all fields");
        return false;
    }

    alert("Login Successful");

    window.location.href = "../../index.html";

    return false;
}