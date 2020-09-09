(function () {
    let theUser = document.cookie.split(";").map(item => { return item.trim() }).find(cookie => { return cookie.includes("username=") }).split("=")[1]
    fetch(`/api/notices/${theUser}`, {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            body: JSON.stringify({})

        }
    })
        .then(response => {

        })

})()