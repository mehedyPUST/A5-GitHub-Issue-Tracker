const btnSignIn = document.getElementById('btn-signIn');
// console.log(btnSignIn);

btnSignIn.addEventListener('click', function () {
    const userNameInput = document.getElementById('user-name');
    const userName = userNameInput.value;
    console.log(userName);
    const passwordInput = document.getElementById('login-password');
    const password = passwordInput.value;
    console.log(password);

    if (userName == 'admin' && password == 'admin123') {
        // 3.1 true :::> alert > home page 
        alert('Login Success');
        // window.location.replace("/home.html");
        window.location.assign("./main.html");

    } else {
        // 3.2 false ::: alert > return
        alert('Login Failed || Use Default Credentials');
        return;
    }


});