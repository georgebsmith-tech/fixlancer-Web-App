(function () {
    const subcatBtn = document.querySelectorAll(".subcatBtn")
    subcatBtn.forEach(subCat => {
        subCat.addEventListener("click", function () {
            const subCatName = this.innerText
            console.log(this.dataset.subcatslug)
            fetch(`/api/fixes/section/${this.dataset.subcatslug}`)
                .then(resp => {
                    return resp.json()
                })
                .then(data => {
                    console.log(data)
                })
        })
    })
})()