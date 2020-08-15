(function () {
    const fixForm = document.querySelector("#fix-form")
    const createFixBtn = document.querySelector(".create-fix-btn")
    const fixTitle = document.querySelector("#fix-title")
    const fixDescr = document.querySelector("#fix-descr")
    const fixDetails = document.querySelector("#fix-details")
    const fixPrice = document.querySelector("#fix-price")
    fixPrice.style.background = "white"

    const fixCategory = document.querySelector("#fix-category")
    fixCategory.style.background = "white"

    const fixDelivery = document.querySelector("#fix-delivery")
    fixDelivery.style.background = "white"

    const fixTags = document.querySelector("#fix-tags")
    // console.log(fixTags)
    const fixPhotos = document.querySelectorAll("#photo")

    const fixvideo = document.querySelector("#video")

    const extraDescr = document.querySelectorAll("#extra-descr")

    const extraAmount = document.querySelectorAll("#extra-amount")


    fetch("/api/categories?content=slim")
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            // console.log(data)
            theCategories = data.data
            let documentFragment1 = new DocumentFragment()
            data.data.forEach(record => {
                // categories.push(record.name)
                const option = document.createElement("option")
                option.style.margin = "15px"
                option.textContent = record.name
                documentFragment1.appendChild(option)
            })
            fixCategory.appendChild(documentFragment1)
            // console.log(categories)
        })





    createFixBtn.addEventListener("click", function (e) {
        e.preventDefault()
        console.log(fixForm)
        const formBody = getBody()
        sendBody(formBody)


    })



    async function sendBody(body) {
        const resp = await fetch("/api/fixes",
            {
                method: "post",
                body
            })
        const data = await resp.json()
        console.log(data)
    }
    function getBody() {
        const formData = new FormData()

        formData.append("title", fixTitle.value.trim())
        formData.append("description", fixDescr.value.trim())
        formData.append("requirements", fixDetails.value.trim())
        formData.append("price", fixPrice.value)
        formData.append("category", fixCategory.value)
        formData.append("delivery_days", fixDelivery.value.trim())
        formData.append("tags", fixTags.value.split(","))



        fixPhotos.forEach(img => {
            // console.log(img.files)
            formData.append("photo", img.files[0])
        })
        // console.log(formData)
        // for (let [key, value] of formData) {
        //     console.log(key)
        //     console.log(value)
        // }
        return formData
    }

    function getData() {

        const data = {
            title: fixTitle.value.trim(),
            description: fixDescr.value.trim(),
            requirements: fixDetails.value.trim(),
            price: fixPrice.value.substr(1),
            category: fixCategory.value,
            delivery_days: fixDelivery.value.trim(),
            tags: fixTags.split(","),

        }
    }
})()