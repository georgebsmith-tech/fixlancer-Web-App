(function () {

    const alertForm = document.querySelector("#alert")
    // console.log(alertForm)

    let documentFragment1 = new DocumentFragment()

    fetch("/api/categories?content=slim")
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            // console.log(data)
            theCategories = data.data
            data.data.forEach(record => {
                // categories.push(record.name)
                const div = document.createElement("div")
                const input = document.createElement("input")
                input.setAttribute("class", "alert-check")
                const label = document.createElement("label")
                label.textContent = record.name
                input.setAttribute("type", "checkbox")
                input.value = record.name
                div.appendChild(input)
                div.appendChild(label)
                documentFragment1.appendChild(div)
            })
            alertForm.appendChild(documentFragment1)
            const btn = document.createElement("button")
            btn.textContent = "Save"
            btn.setAttribute("class", "alert-btn")
            alertForm.appendChild(btn)
            // console.log(categories)
            const categories = document.querySelectorAll(".alert-check")
            // console.log(categories)
            categories.forEach(check => {
                check.addEventListener("input", function () {
                    console.log(this.value)
                    let checked = 0
                    categories.forEach(cate => {
                        if (cate.checked) {
                            checked++
                        }

                    })
                })
            })


            const alertBtn = document.querySelector(".alert-btn")
            alertBtn.addEventListener("click", function (e) {
                e.preventDefault()
                console.log("worked")
                location.href = "/dashboard"
            })
        })


})()