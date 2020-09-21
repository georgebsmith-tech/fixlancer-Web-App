(function () {
    const loginBtn = document.getElementById('login-btn');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    loginBtn.addEventListener('click', (e) => {
        document.querySelector(".login-error").classList.add("hide")
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
            console.log(response)
            if (response.status === 200)
                window.location.href = "/dashboard"
            return response.json();





        }).then(data => {
            console.log(data)


        }).catch(error => {
            console.log("Error")
            // document.querySelector(".login-error").classList.remove("hide")
            console.log(err)
        })
    }

})()