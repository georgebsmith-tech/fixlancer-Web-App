(function () {
    let theUser = document.cookie.split(";").map(item => { return item.trim() }).find(cookie => { return cookie.includes("username=") }).split("=")[1]
    console.log('The user:' + theUser)
    fetch(`/api/notices/${theUser}`, {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            body: JSON.stringify({})

        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })

})()