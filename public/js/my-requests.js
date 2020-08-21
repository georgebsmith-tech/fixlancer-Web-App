(async function () {
    function commafy(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    const recommendHolder = document.querySelector(".grid-responsive-6")
    const requestsHolder = document.querySelector(".requests")
    // console.log(recommendHolder)
    fetch("/api/requests?a_user=true")
        .then(resp => { return resp.json() })
        .then(data => {
            console.log(data)
            if (data.number_of_records === 0) {
                requestsHolder.innerHTML = "No job Request Found"
                requestsHolder.setAttribute("style", "padding:15px;background:white;")
                // console.log(requestsHolder)
            } else {
                const docFrag = new DocumentFragment()
                data.data.forEach(request => {

                    let time = new Date(Date.parse(request.createdAt))
                    console.log(typeof time)
                    // console.log(typeof request.createdAt)
                    const requestHolder = document.createElement("section")
                    requestHolder.innerHTML = `<div class="request">
                            <div>
                                <div class="username-icon">${request.username[0].toUpperCase()}</div>
                            </div>
                            <div>
                                <header>
                                    <a href="#" class="title">${request.title}</a>
                                </header>
                                <p class="description">${request.description}
                                </p>
                                <div class="duration">
                                    <i class="fas fa-clock"></i> ${request.delivery} day(s)
                                </div>
                                <div class="request-meta">
                                    <div>

                                        <div class="amount">
                                            ₦${commafy(request.price)}
                                        </div>
                                    </div>
                                    <div>
                                        <i class="fa fa-exclamation-triangle"></i>Not approved
                                    </div>
                                </div>
                                <div class="username-and-date">
                                    <a href="/dashboard/profile">${request.username} </a>-
                                    <span> ${time.toDateString()}</span>
                                </div>

                            </div>
                        </div>
                        <div class="divider"></div>
                    </section>`
                    docFrag.appendChild(requestHolder)
                })
                requestsHolder.appendChild(docFrag)


            }
        })

    const resp = await fetch("/api/fixes?state=random&count=6")
    const data = await resp.json()
    // console.log(data)
    const documentFra = new DocumentFragment()
    data.forEach(fix => {
        if (fix.titleSlug) {
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
            // console.log(sum_of_ratings)
            let aRecommendation = document.createElement("div")
            aRecommendation.classList.add("a-recommendation")
            aRecommendation.innerHTML = `
                <div class="recommended-fix-top">
                    <div class="recommended-image-wrapper">
                        <a href="/fix/${fix.subcatSlug}/${fix.titleSlug}">
                        <img src="${fix.images_url[0]}"
                            alt="">
                        </a>
                    </div>
                    <div>
                        <div class="recoomended-username-desktop">
                            <i class="fa fa-circle"></i>
                            <small>${fix.username}</small>
                        </div>
                        <a href="/fix/${fix.subcatSlug}/${fix.titleSlug}" >
                        <p class="recommended-fix-title">${fix.title.substr(0, 45)}...
                        </p>
                        </a>
                        <small class="duration-and-rating-trust">
                            <span>
                                <i class="fas fa-clock"></i> <span>${fix.delivery_days} day(s)</span>
                            </span>
                            <span class="trust hide">
                                <i class="fa fa-check orange"></i>
                                <span class="orange">Trusted</span>
                            </span>
                            <span class="fix-rating">
                                <i class="fa fa-star"></i>
                                <span>${average_rating}(${number_of_ratings})</span>
                            </span>
                        </small>
                    </div>
                </div>
                <div class="amount-and-alter">
                    <div class="recommended-mobile">
                        <div>
                            <i class="fa fa-circle"></i>
                            <small>${fix.username}</small>
                        </div>
                        <div class="fix-amount-green">
                            ₦${commafy(fix.price)}
                        </div>
                    </div>
                    <div class="recommended-desktop">
                        <div>
                            <i class="fa fa-check orange"></i>
                            <small class="orange">Trusted</small>
                        </div>
                        <div class="fix-amount-green">
                        ₦${fix.price}
                        </div>
                    </div>
                </div>`
            documentFra.appendChild(aRecommendation)
        }

    })
    recommendHolder.appendChild(documentFra)


})()