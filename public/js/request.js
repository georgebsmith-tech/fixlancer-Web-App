
(function () {
    const titleInput = document.getElementById("title")
    const priceInput = document.getElementById("price")
    const descriptionInput = document.getElementById("description")
    const deliveryInput = document.getElementById("delivery")
    const acceptTerms = document.getElementById("accept-terms")
    const offerBtn = document.querySelector(".place-offer")
    if (offerBtn) {
        offerBtn.addEventListener("click", function () {

            if (acceptTerms.checked) {
                const body = getBody()
                // console.log(body)
                sendDataToServer(body)
            }
        })

    }


    function sendDataToServer(body) {
        fetch("/api/requests", {
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            },
            method: "PATCH"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
    }

    function getBody() {
        return {
            slug: titleInput.selectedOptions[0].dataset.titleslug,
            image_url: titleInput.selectedOptions[0].dataset.imageurl,
            title: titleInput.value,
            description: descriptionInput.value,
            price: priceInput.value,
            delivery: deliveryInput.value,
            _id: document.getElementById("request-id").value
        }

    }
})()
