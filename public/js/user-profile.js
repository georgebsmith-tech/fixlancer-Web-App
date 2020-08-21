(function () {
    const usernameHolder = document.querySelector(".profile-username")
    const userAvatarHolder = document.querySelector(".profile-icon")
    const userRatingHolder = document.querySelector(".profile-rating")
    const userPhoneHolder = document.querySelector(".profile-phone")
    const userBioHolder = document.querySelector(".profile-bio")
    const userCreatedAtHolder = document.querySelector(".profile-created-at")
    const userFixHeadingHolder = document.querySelector(".profile-fixes-heading")
    const userFixContainer = document.querySelector(".fix-container")
    console.log(userFixContainer)





    fetch("/api/users/u?content=profile"//, {
        // method: "post",
        // headers: {
        //     'Content-Type': "application/json"
        // }
    ).then(resp => {
        return resp.json()
    })
        .then(data => {
            let documentFra = new DocumentFragment()
            // console.log(data)
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
            fetch(`/api/fixes/${data.username}`)
                .then(resp => {
                    return resp.json()
                })
                .then(userFixes => {
                    console.log(userFixes)
                    if (userFixes.number_of_records !== 0) {
                        userFixContainer.style.width = `${(30 + 210 + 3) * userFixes.number_of_records - 20}px`
                        userFixes.data.forEach(fix => {
                            let ratings = fix.ratings

                            // console.log(ratings)
                            let sum_of_ratings = 0;

                            let average_rating = 0
                            let number_of_ratings = ratings.length
                            if (number_of_ratings !== 0) {

                                ratings.forEach(rating => {
                                    sum_of_ratings += rating * 1
                                })
                                average_rating = (sum_of_ratings / number_of_ratings).toFixed(1)
                                // console.log(average_rating)


                            }
                            let fixid = document.createElement("div")
                            fixid.classList.add("user-fix")
                            const fiximageDiv = document.createElement("div")
                            fiximageDiv.setAttribute("class", "fix-image-wrapper")
                            const fixImage = document.createElement("img")
                            fixImage.setAttribute("src", fix.images_url[0])
                            fiximageDiv.appendChild(fixImage)


                            fixid.appendChild(fiximageDiv)

                            const userStatus = document.createElement("div")
                            userStatus.setAttribute("class", "fix-user-status")

                            const userStatusIcon = document.createElement("i")
                            userStatusIcon.setAttribute("class", "fa fa-circle online-color")
                            userStatusIcon.style.marginRight = "3px"
                            userStatus.appendChild(userStatusIcon)

                            const userStatusname = document.createElement("span")
                            userStatusname.textContent = fix.username
                            userStatus.appendChild(userStatusname)

                            fixid.appendChild(userStatus)
                            const userFixTitle = document.createElement("div")
                            userFixTitle.setAttribute("class", "user-fix-title")
                            const tagUserFixTitle = document.createElement("a")
                            tagUserFixTitle.setAttribute("href", `/fix/${fix.subcatSlug}/${fix.titleSlug}`)
                            userFixTitle.textContent = `${fix.title.substr(0, 45)}...`
                            tagUserFixTitle.appendChild(userFixTitle)
                            fixid.appendChild(tagUserFixTitle)

                            const userFixPriceAndrating = document.createElement("div")
                            userFixPriceAndrating.setAttribute("class", "price-and-ratings")

                            const div_delivery = document.createElement("div")
                            const clock = document.createElement("i")
                            clock.setAttribute("class", "fa fa-clock")
                            const span_delivery = document.createElement("span")
                            span_delivery.setAttribute("class", "delivery")
                            span_delivery.textContent = `${fix.delivery_days} day(s)`
                            clock.style.marginRight = "3px"
                            div_delivery.appendChild(clock)
                            div_delivery.appendChild(span_delivery)

                            //rating
                            const div_rating = document.createElement("div")
                            div_rating.setAttribute("class", "rating-or-trust")
                            const star = document.createElement("i")
                            star.setAttribute("class", "fa fa-star")
                            const span_star = document.createElement("span")
                            //    span_star.setAttribute("class","delivery")
                            span_star.textContent = `${average_rating} (${number_of_ratings})`
                            div_rating.appendChild(star)
                            div_rating.appendChild(span_star)
                            userFixPriceAndrating.appendChild(div_delivery)
                            userFixPriceAndrating.appendChild(div_rating)

                            fixid.appendChild(userFixPriceAndrating)
                            const divAmount = document.createElement("div")
                            divAmount.setAttribute("class", "fix-price")
                            divAmount.textContent = `₦${fix.price}`

                            userFixPriceAndrating.appendChild(divAmount)


                            documentFra.appendChild(fixid)
                        });
                        userFixContainer.textContent = ""
                        userFixContainer.appendChild(documentFra)
                        console.log(documentFra)
                        console.log(userFixes)

                    }

                })

        })



})()