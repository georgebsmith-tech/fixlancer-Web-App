(function () {
    const searchBtn = document.querySelector(".search-btn-body")
    searchBtn.addEventListener("click", function () {
        let term = document.querySelector(".search-by-cat").value
        console.log(term)
        fetch(`/api/fixes?state=search&limit=12&skip=7&q=${term}`)
            .then(resp => {
                return resp.json()
            })
            .then(data => {
                console.log(data)
            })
    })
})()