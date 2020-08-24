(function () {
    const mobileFinanceContainer = document.querySelector(".mobile-finance")
    console.log(mobileFinanceContainer)

    fetch("/api/users/u")
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            console.log(data.data)
            document.querySelector(".top-profile-avatar-container span").textContent = data.data.username[0].toUpperCase()

            document.querySelector(".top-revenue span").textContent = "₦" + data.data.summary[1][1]
            mobileFinanceContainer.querySelectorAll("span")[1].textContent = `₦${data.data.summary[1][1]}`

            document.querySelector(".header-ongoing-sales").textContent = "(" + data.data.summary[2][1] + ")"


            document.querySelector(".header-ongoing-orders").textContent = "(" + data.data.summary[3][1] + ")"
        })


    const dropDownProfile = document.querySelector(".drop-down-profile")
    const dropDownRequests = document.querySelector(".drop-down-requests")
    const dropDownProfileHolder = document.querySelector(".drop-profile")
    const dropDownRequestHolder = document.querySelector(".drop-requests")
    const avatarDropDown = document.querySelector(".top-profile-avatar-container")
    const revenueDropDown = document.querySelector(".top-revenue")


    let flag1 = false, flag2 = false, flag3 = false, flag4 = false
    const mobileNavContainer = document.querySelector(".mobile-nav-container")
    const toggleNavHandler = document.querySelector(".toggle-nav")


    revenueDropDown.addEventListener("click", function (e) {
        e.stopPropagation()
        document.querySelector(".for-revenue").classList.remove("hide")
        flag4 = true
        if (flag1) {
            dropDownProfileHolder.classList.add("hide")
            flag1 = false
        }
        if (flag2) {
            dropDownRequestHolder.classList.add("hide")
            flag2 = false
        }
        if (flag3) {
            document.querySelector(".for-avatar").classList.add("hide")
            flag3 = false
        }
    })

    avatarDropDown.addEventListener("click", function (e) {
        e.stopPropagation()
        document.querySelector(".for-avatar").classList.remove("hide")
        flag3 = true
        if (flag1) {
            dropDownProfileHolder.classList.add("hide")
            flag1 = false
        }
        if (flag2) {
            dropDownRequestHolder.classList.add("hide")
            flag2 = false
        }

        if (flag4) {
            document.querySelector(".for-revenue").classList.add("hide")
            flag4 = false
        }
    })
    mobileNavContainer.addEventListener("click", function () {
        if (flag1 || flag2) {
            dropDownProfileHolder.classList.add("hide")
            dropDownRequestHolder.classList.add("hide")
            flag2 = true
            flag2 = true
        }

    })

    // const dropDownProfile=document.querySelector(".drop-down-profile")
    // console.log(dropDownProfile)
    dropDownProfile.addEventListener("click", function (e) {
        flag1 = true
        e.preventDefault()
        e.stopPropagation()
        dropDownProfileHolder.classList.remove("hide")
        if (flag2) {
            dropDownRequestHolder.classList.add("hide")
            flag2 = false
        }
        if (flag3) {
            document.querySelector(".for-avatar").classList.add("hide")
            flag3 = false
        }
        if (flag4) {
            document.querySelector(".for-revenue").classList.add("hide")
            flag4 = false
        }

    })

    dropDownRequests.addEventListener("click",
        function (e) {
            e.preventDefault()
            flag2 = true
            e.stopPropagation()
            dropDownRequestHolder.classList.remove("hide")
            if (flag1) {
                dropDownProfileHolder.classList.add("hide")
                flag1 = false
            }
            if (flag3) {
                document.querySelector(".for-avatar").classList.add("hide")
                flag3 = false
            }
            if (flag4) {
                document.querySelector(".for-revenue").classList.add("hide")
                flag4 = false
            }
        })
    let toggleFlag = false
    toggleNavHandler.addEventListener("click", function () {
        if (!toggleFlag) {


            mobileNavContainer.style.display = "block"
            document.querySelector(".header-buy-chopbar").style.display = "flex"
            mobileFinanceContainer.classList.remove("hide")
            toggleFlag = true
        } else {
            mobileNavContainer.style.display = "none"
            document.querySelector(".header-buy-chopbar").style.display = "none"
            mobileFinanceContainer.classList.add("hide")

            toggleFlag = false
        }

    })

    document.querySelectorAll("main,footer,header").forEach(element => {
        console.log("body and others")
        element.addEventListener("click", function () {
            if (flag1 || flag2 || flag3 || flag4) {
                document.querySelector(".for-avatar").classList.add("hide")
                document.querySelector(".for-revenue").classList.add("hide")
                dropDownProfileHolder.classList.add("hide")
                dropDownRequestHolder.classList.add("hide")

                flag2 = true
                flag2 = true
                flag3 = true
                flag4 = true
            }
        })
    })





})()