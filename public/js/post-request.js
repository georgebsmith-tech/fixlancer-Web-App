(function () {
    document.querySelectorAll("select").forEach(select => {
        select.style.background = "white"
    })
    const categoriesTag = document.querySelector("#category")
    const pricesTag = document.querySelector("#prices")
    pricesTag.style.display = "none"
    // console.log()
    let theCategories;
    categoriesTag.addEventListener("change", function () {
        // const option = document.createElement("option")
        // option.style.margin = "15px"
        // option.textContent = "Select Price..."
        pricesTag.style.display = "block"
        pricesTag.innerHTML = '<option value="">Select Price...</option>'
        const thecat = theCategories.find(rec => {
            return rec.name === this.value
        })
        let documentFragment2 = new DocumentFragment()
        thecat.prices.forEach(price => {
            const option = document.createElement("option")
            option.style.margin = "15px"
            option.textContent = "₦" + price
            documentFragment2.appendChild(option)
        })
        pricesTag.appendChild(documentFragment2)

    })
    const categories = []
    fetch("/api/categories?content=slim")
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            console.log(data)
            theCategories = data.data
            let documentFragment1 = new DocumentFragment()
            data.data.forEach(record => {
                // categories.push(record.name)
                const option = document.createElement("option")
                option.style.margin = "15px"
                option.textContent = record.name
                documentFragment1.appendChild(option)
            })
            categoriesTag.appendChild(documentFragment1)
            // console.log(categories)
        })

    const submitPostBtn = document.querySelector(".submit-post-request")
    const titleInput = document.querySelector("#post-title")
    const descriptionInput = document.querySelector("#post-descr")
    const deliveryInput = document.querySelector("#delivery")

    submitPostBtn.addEventListener("click", function (e) {
        e.preventDefault()
        const body = makeBody()
        sendPost(body)


    })
    function makeBody() {
        const description = descriptionInput.value
        const title = titleInput.value
        const category = categoriesTag.value
        const price = pricesTag.value.substr(1)
        const delivery = deliveryInput.value
        const data = {
            title,
            description,
            price,
            category,
            delivery
        }
        return data
    }

    function sendPost(body) {
        fetch("/api/requests",
            {
                method: "post",
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': "application/json"
                }
            })
            .then(resp => {
                return resp.json()
            })
            .then(data => {
                console.log(data)
                window.location.href = "/dashboard/my-requests?notice=new"
            })
    }



})()