(async function () {

    const recommendHolder = document.querySelector(".grid-responsive-6")
    console.log(recommendHolder)
    fetch("/api/requests")
        .then(resp => { })
        .then(data => { })

    const resp = await fetch("/api/fixes?state=random&count=6")
    const data = await resp.json()
    console.log(data)
    const documentFra = new DocumentFragment()
    data.forEach(fix => {
        let ratings = fix.ratings

        console.log(ratings)
        let sum_of_ratings = 0;

        let average_rating
        let number_of_ratings = ratings.length
        if (number_of_ratings !== 0) {

            ratings.forEach(rating => {
                sum_of_ratings += rating * 1
            })
            average_rating = (sum_of_ratings / number_of_ratings).toFixed(1)
            console.log(average_rating)


        }
        // console.log(sum_of_ratings)
        let aRecommendation = document.createElement("div")
        aRecommendation.classList.add("a-recommendation")
        aRecommendation.innerHTML = `
                <div class="recommended-fix-top">
                    <div class="recommended-image-wrapper">
                        <img src="${fix.images_url[0]}"
                            alt="">
                    </div>
                    <div>
                        <div class="recoomended-username-desktop">
                            <i class="fa fa-circle"></i>
                            <small>${fix.username}</small>
                        </div>
                        <p class="recommended-fix-title">${fix.title.substr(0, 45)}...
                        </p>
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
                            ₦${fix.price}
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

    })
    recommendHolder.appendChild(documentFra)


})()