
(function () {
    const searchBtn = document.querySelector(".search-btn-body")
    let searchLoaderHandler = document.querySelector(".search-loader")
    const options = document.querySelectorAll(".option")
    const countStart = document.querySelector(".start")
    const countEnd = document.querySelector(".end")
    const totalCount = document.querySelector(".total-result")
    countStart.innerText, countEnd.innerText


    options.forEach(option => {
        option.addEventListener("click", function () {
            term = document.querySelector(".search-by-cat").value.trim()
            const slug = this.dataset.slug

            fetch(`/api/fixes/section/${slug}?q=${term}&limit=4`)
                .then(resp => {
                    return resp.json()
                })
                .then(data => {
                    console.log(data)
                    initializeCounts(data)
                    renderResult(data)
                })


        })

    })

    function initializeCounts(data) {
        countStart.innerText = 1
        totalCount.innerText = `${data.count} `
        countEnd.innerText = data.data.length

    }

    function changeCounts(data) {
        countStart.innerText = (countStart.innerText) * 1 + 4
        countEnd.innerText = (countEnd.innerText) * 1 + data.data.length
    }

    const nextBtn = document.querySelector(".next-result")
    let term

    async function fetchAndRenderData() {


        term = document.querySelector(".search-by-cat").value.trim()

        searchLoaderHandler.classList.remove("hide")
        const resp = await fetch(`/api/fixes?state=search&limit=4&pg=${this.dataset.pg}&q=${term}`)
        const data = await resp.json()
        changeCounts(data)
        renderResult(data, this.dataset.pg)


    }

    nextBtn.addEventListener("click", fetchAndRenderData)


    searchBtn.addEventListener("click", function () {



        let term = document.querySelector(".search-by-cat").value.trim()
        if (term === "") {
            alert("No na!!!")
            return
        }
        searchLoaderHandler.classList.remove("hide")
        document.querySelector(".showing-category").textContent = term
        console.log(term)
        fetch(`/api/fixes?state=search&limit=4&q=${term}&pg=1`)
            .then(resp => {
                return resp.json()
            })
            .then(data => {
                console.log(data)
                initializeCounts(data)


                renderResult(data, "1")
            })
    })
    let prevBtn;

    function renderResult(data, pres) {
        document.querySelector(".search-fixes").innerHTML = ""
        if (data.data.length == 0) {

            searchLoaderHandler.classList.add("hide")
            document.querySelector(".search-pagination").classList.add("hide")
            document.querySelector(".no-results").classList.remove("hide")
            return
        } else {
            document.querySelector(".no-results").classList.add("hide")
        }



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
            searchLoaderHandler.classList.add("hide")
            document.querySelector(".search-fixes").insertAdjacentHTML("afterbegin", fix)
        })
        if (data.count <= 4) {
            document.querySelector(".search-pagination").classList.add("hide")
            return
        }
        if (pres * 1 > 1) {
            prevBtn = document.querySelector(".previous-result")
            prevBtn.style.visibility = "visible"
            prevBtn.setAttribute("data-pg", `${pres - 1}`)
            prevBtn.addEventListener("click", fetchAndRenderData)
        } else {
            prevBtn.style.visibility = "hidden"
        }
        nextBtn.setAttribute("data-pg", `${pres * 1 + 1}`)
        document.querySelector(".current-page").textContent = `Page ${pres}`
        history.pushState({}, "new page", `/search-fix?term=${term}&pg=${pres}`)
        if (pres * 1 === document.querySelector(".current-page").dataset.maxpage * 1) {
            nextBtn.style.visibility = "hidden"
        } else {
            nextBtn.style.visibility = "visible"
        }
    }
})()