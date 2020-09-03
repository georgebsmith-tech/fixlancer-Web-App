(function () {
    const subcatBtn = document.querySelectorAll(".subcatBtn")


    function renderResult(data) {
        data.data.forEach(aFix => {



            let fix = `<div class="fix-card">
                            <div class="grid-2-12-card">
                                <a href="/fix/${aFix.subcatSlug}/${aFix.titleSlug}">
                                    <div class="fix-image-wrapper">
                                        <img src="${aFix.images_url[0]}" alt="">
                                    </div>
                                </a>
                                <div class="fix-username-and-presence desktop padding-sides" style="padding-bottom:10px;">
                                    <i class="fa fa-circle"></i>
                                    <span style="font-weight: bold;"> ${aFix.username}</span>

                                </div>
                                <div>
                                    <a href="/fix/${aFix.subcatSlug}/${aFix.titleSlug}"
                                        class="anchor-hover-blue-underline fix-title block">
                                        ${aFix.title.toLowerCase().substr(0, 40)}...
                                    </a>
                                    <div class="duration-and-rating-trust">
                                        <i class="fas fa-clock"></i>
                                        <span>${aFix.delivery_days} day(s)</span>

                                    </div>

                                </div>
                            </div>

                            <div class="amount-and-user">
                                <div class="duration-and-rating-trust desktop" style="padding-bottom:10px">
                                    <i class="fas fa-clock"></i>
                                    <span>${aFix.delivery_days} day(s)</span>

                                </div>
                                <div class="fix-username-and-presence mobile" style="padding-bottom:10px;">
                                    <i class="fa fa-circle"></i>
                                    <span style="font-weight: bold;">${aFix.username}</span>

                                </div>
                                <div class="fix-amount-green">
                                    ₦${aFix.price}
                                </div>
                            </div>

                </div>`
            // searchLoaderHandler.classList.add("hide")
            document.querySelector(".search-fixes").insertAdjacentHTML("afterbegin", fix)
        })
    }
    subcatBtn.forEach(subCat => {
        subCat.addEventListener("click", function () {

            subcatBtn.forEach(btn => {
                if (btn.innerText === this.innerText) {
                    btn.classList.add("bg-white")
                    // btn.classList.add("bold")
                } else {
                    btn.classList.remove("bg-white")
                    // btn.classList.remove("bold")
                }
            })
            const subCatName = this.innerText
            document.querySelector(".showing-cat").innerText = `${subCatName}`
            const searchFixesContainer = document.querySelector(".search-fixes")
            searchFixesContainer.innerHTML = ""
            console.log(this.dataset.subcatslug)
            fetch(`/api/fixes/section/${this.dataset.subcatslug}`)
                .then(resp => {
                    return resp.json()
                })
                .then(data => {
                    console.log(data)
                    if (data.data.length === 0) {
                        document.querySelector(".no-result").classList.remove("hide")
                    } else {
                        document.querySelector(".no-result").classList.add("hide")
                        renderResult(data)

                    }
                })
        })
    })
})()