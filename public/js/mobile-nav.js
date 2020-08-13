(function () {
    const dropDownProfile = document.querySelector(".drop-down-profile")
    const dropDownRequests = document.querySelector(".drop-down-requests")
    const dropDownProfileHolder = document.querySelector(".drop-profile")
    const dropDownRequestHolder = document.querySelector(".drop-requests")
    let flag1 = false, flag2 = false
    const mobileNavContainer = document.querySelector(".mobile-nav-container")
    const toggleNavHandler = document.querySelector(".toggle-nav")
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
        })
    let toggleFlag = false
    toggleNavHandler.addEventListener("click", function () {
        if (!toggleFlag) {


            mobileNavContainer.style.display = "block"
            document.querySelector(".header-buy-chopbar").style.display = "flex"
            toggleFlag = true
        } else {
            mobileNavContainer.style.display = "none"
            document.querySelector(".header-buy-chopbar").style.display = "none"
            toggleFlag = false
        }

    })

    document.querySelectorAll("main,footer,header").forEach(element => {
        console.log("body and others")
        element.addEventListener("click", function () {
            if (flag1 || flag2) {
                dropDownProfileHolder.classList.add("hide")
                dropDownRequestHolder.classList.add("hide")
                flag2 = true
                flag2 = true
            }
        })
    })




    //     console.log(mobileNavContainer.classList)
})()