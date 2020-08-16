(function () {
    const fixForm = document.querySelector("#fix-form")
    const createFixBtn = document.querySelector(".create-fix-btn")
    const fixTitle = document.querySelector("#fix-title")
    const fixDescr = document.querySelector("#fix-descr")
    const fixDetails = document.querySelector("#fix-details")
    const fixPrice = document.querySelector("#fix-price")
    fixPrice.style.background = "white"

    const fixCategory = document.querySelector("#fix-category")
    const fixSubCategory = document.querySelector("#fix-subcategory")

    fixCategory.style.background = "white"
    fixSubCategory.style.background = "white"

    const fixDelivery = document.querySelector("#fix-delivery")

    fixDelivery.style.background = "white"

    const fixTags = document.querySelector("#fix-tags")
    // console.log(fixTags)
    const fixPhotos = document.querySelectorAll("#photo")

    const fixvideo = document.querySelector("#video")

    const extraDescr = document.querySelectorAll("#extra-descr")

    const extraAmount = document.querySelectorAll("#extra-amount")
    const fixVideo = document.querySelector("#video")


    let subcat = []
    fetch("/api/categories?content=slim&subcat=true")
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            console.log(data)
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
        if (resp.status === 200) {
            window.location.href = "/alert"
        }
        const data = await resp.json()
        console.log(data)

    }
    function getBody() {
        console.log(fixVideo.files)
        const formData = new FormData()

        formData.append("title", fixTitle.value.trim())
        formData.append("description", fixDescr.value.trim())
        formData.append("requirements", fixDetails.value.trim())
        formData.append("video", fixVideo.files[0])
        formData.append("price", fixPrice.value)
        formData.append("category", fixCategory.value)
        formData.append("delivery_days", fixDelivery.value.trim())
        formData.append("tags", fixTags.value)
        formData.append("subcategory", fixSubCategory.value)

        formData.append("extra1_desc", extraDescr[0].value)
        formData.append("extra1_amount", extraAmount[0].value * 1)
        formData.append("extra2_desc", extraDescr[1].value)
        formData.append("extra2_amount", extraAmount[1].value * 1)



        fixPhotos.forEach(img => {
            // console.log(img.files)
            formData.append("photo", img.files[0])
        })
        console.log(formData)
        for (let [key, value] of formData) {
            console.log(key)
            console.log(value)
        }
        return formData
    }


    fixCategory.addEventListener("input", function (e) {
        console.log("cat")
        console.log(fixSubCategory)
        fixSubCategory.parentElement.parentElement.classList.remove("hide")
        uploadSubcategories()
    })


    function uploadSubcategories() {

        const selectedRecord = theCategories.find(record => {
            return record.name === fixCategory.value
        })
        fixSubCategory.innerHTML = '<option value="">Select Subcategory...</option>'
        let documentFragment2 = new DocumentFragment()
        selectedRecord.subcat.forEach(subcat => {
            const option = document.createElement("option")
            option.style.margin = "15px"
            option.textContent = subcat.name
            documentFragment2.appendChild(option)
        })
        fixSubCategory.appendChild(documentFragment2)


    }

    function getData() {


    }
})()