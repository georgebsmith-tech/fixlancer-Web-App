(function () {
    const loginBtn = document.getElementById('login-btn');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    loginBtn.addEventListener('click', (e) => {
        console.log("happened")
        validateLogin();
        console.log(username.value);
    })

    function validateLogin() {
        fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username.value,
                password: password.value
            }),
            headers: {
                'Content-Type': "application/json"
            }
        }).then(response => {
            if (response.status === 200) window.location.href = "/dashboard"
            return response.json();

        }).then(text => {
            console.log(text)

        }).catch(error => {
            console.log(error);
        })
    }

})()