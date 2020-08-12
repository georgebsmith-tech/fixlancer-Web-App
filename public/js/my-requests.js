(async function () {

    const recommendHolder = document.querySelector(".grid-responsive-6")
    console.log(recommendHolder)

    const resp = await fetch("/api/fixes?state=random&count=6")
    const data = await resp.json()
    // console.log(data)
    const documentFra = new DocumentFragment()
    data.forEach((fix, index) => {
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
                                <span>4.5(3)</span>
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