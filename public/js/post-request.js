(function () {
    document.querySelectorAll("select").forEach(select => {
        select.style.background = "white"
    })
    const categoriesTag = document.querySelector("#category")
    const pricesTag = document.querySelector("#prices")
    // console.log()
    let theCategories;
    categoriesTag.addEventListener("change", function () {
        // console.log(this.value)
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
    console.log("Thi is meant to be after")
})()