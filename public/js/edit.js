(function () {
    let loggedUser = document.cookie.split(";").map(item => { return item.trim() }).find(cookie => { return cookie.includes("username=") }).split("=")[1]
    const usernameInput = document.getElementById("username")
    const fullNameInput = document.getElementById("full-name")
    const cityInput = document.getElementById("city")
    const saveBtn = document.getElementById("save-btn")
    const phoneInput = document.getElementById("phone")
    const bioInput = document.getElementById("bio")
    const passwordInput = document.getElementById("password")
    const confirmPasswordInput = document.getElementById("confirm-password")
    const acctNameInput = document.getElementById("acct-name")
    const acctnumberInput = document.getElementById("acct-number")
    const bankNameInput = document.getElementById("bank-name")
    const photHolder = document.getElementById("photo")
    const oldPhoneHolder = document.getElementById("old-phone")
    const userPhotoWrapper = document.querySelector(".user-photo-wrapper")

    const profileUpdated = document.querySelector(".profile-updated")

    saveBtn.addEventListener("click", function (e) {
        e.preventDefault()
        const result = confirmPasswords()
        if (result) {
            const formDate = getFormDate()
            sendData(formDate)
        }
    })


    function sendData(formData) {
        fetch(`/api/users/${loggedUser}`, {
            method: "PUT",
            body: formData

        })
            .then(resp => {
                return resp.json()
            })
            .then(data => {
                const userPhotoHolder = document.querySelector(".user-photo")
                if (userPhotoHolder) {
                    userPhotoHolder.setAttribute("src", data.data.imageURL)
                } else {
                    const img = document.createElement("img")
                    img.classList.add("user-photo")
                    img.setAttribute("src", data.data.imageURL)
                    userPhotoWrapper.appendChild(img)

                }
                profileUpdated.classList.remove("hide")
                location.href = "#top"
                console.log(data)
            })
    }

    function getFormDate() {
        console.log("in")
        const formData = new FormData()

        const username = usernameInput.value.trim()
        console.log(username)
        formData.append("username", username)
        const fullName = fullNameInput.value.trim()
        formData.append("fullName", fullName)
        const city = cityInput.value.trim()
        formData.append("city", city)
        const phone = phoneInput.value.trim()
        formData.append("phone", phone)
        const bio = bioInput.value.trim()
        formData.append("bio", bio)
        const photo = photHolder.files[0]
        formData.append("photo", photo)
        const acctName = acctNameInput.value.trim()
        formData.append("acctName", acctName)
        const acctNumber = acctnumberInput.value.trim()
        formData.append("acctNumber", acctNumber)
        const bankName = bankNameInput.value.trim()
        formData.append("bankName", bankName)
        const password = passwordInput.value
        formData.append("password", password)
        const confirmPassword = confirmPasswordInput.value
        formData.append("confirmPassword", confirmPassword)

        const oldPhone = oldPhoneHolder.value.trim()

        formData.append("oldPhone", oldPhone)



        return formData

    }

    function confirmPasswords() {
        const password = passwordInput.value
        const confirmPassword = confirmPasswordInput.value

        if (password === "" && confirmPassword === "") {
            console.log("true")
            return true

        } else if (password === confirmPassword) {
            return true


        } else {
            return false

        }



    }





})()