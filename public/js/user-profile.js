(function () {
    const usernameHolder = document.querySelector(".profile-username")
    const userAvatarHolder = document.querySelector(".profile-icon")
    const userRatingHolder = document.querySelector(".profile-rating")
    const userPhoneHolder = document.querySelector(".profile-phone")
    const userBioHolder = document.querySelector(".profile-bio")
    const userCreatedAtHolder = document.querySelector(".profile-created-at")
    const userFixHeadingHolder = document.querySelector(".profile-fixes-heading")


    fetch("/api/users/u?content=profile"//, {
        // method: "post",
        // headers: {
        //     'Content-Type': "application/json"
        // }
    ).then(resp => {
        return resp.json()
    })
        .then(data => {
            console.log(data)
            usernameHolder.innerText = data.username
            userAvatarHolder.innerText = data.username[0].toUpperCase()
            userRatingHolder.innerText = `Rating: ${data.rating}`
            userPhoneHolder.innerText = `Mobile no: ${data.phone}`
            if (data.bio === "") {
                userBioHolder.innerText = "No bio yet"
            } else {
                userBioHolder.innerText = data.bio
            }
            userCreatedAtHolder.innerText = `Member Since: ${data.created_at}`
            userFixHeadingHolder.innerText = `Fixes by ${data.username}`

        })
})()