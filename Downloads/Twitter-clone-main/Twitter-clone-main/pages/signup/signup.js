document.getElementById("signupForm").onsubmit = function () {

    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (fullname == "" || email == "" || username == "" || password == "" || confirmPassword == "") {
        alert("Please fill all fields");
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long");
        return false;
    }

    if (!/[A-Z]/.test(password)) {
        alert("Password must contain at least one uppercase letter");
        return false;
    }

    if (!/[a-z]/.test(password)) {
        alert("Password must contain at least one lowercase letter");
        return false;
    }

    if (!/[0-9]/.test(password)) {
        alert("Password must contain at least one number");
        return false;
    }

    if (!/[!@#$%^&*]/.test(password)) {
        alert("Password must contain at least one special character");
        return false;
    }

    if (password != confirmPassword) {
        alert("Password does not match");
        return false;
    }

    alert("Signup Successful");

    window.location.href = "../login/login.html";

    return false;
}