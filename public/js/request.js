
(function () {
    const titleInput = document.getElementById("title")
    const priceInput = document.getElementById("price")
    const descriptionInput = document.getElementById("description")
    const deliveryInput = document.getElementById("delivery")
    const acceptTerms = document.getElementById("accept-terms")
    const offerBtn = document.querySelector(".place-offer")
    const numberOfOffersHolder = document.querySelector(".number-of-offers")
    const messageModal = document.querySelector(".message-modal")
    const messageSellerBtns = document.querySelectorAll(".message-seller")
    const closeMessageBtn = document.querySelector(".close-message")
    closeMessageBtn.addEventListener("click", function () {
        messageModal.classList.add("hide")
    })


    messageSellerBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            messageModal.classList.remove("hide")

        })
    })





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
                numberOfOffersHolder.innerText = ` ${parseInt(numberOfOffersHolder.innerText) + 1} offers`

                renderOffer(data)
            })
    }

    const holder = document.querySelector(".holder")

    function renderOffer(data) {
        let offer = data.offers.slice(-1)[0]
        console.log(offer)
        holder.innerHTML = ""

        let item = `<div class="font16 card-grid border-bottom">
        <div>
            <div>
                <img src="${offer.image_url}" alt="">
            </div>
        </div>
        <div>
            <div class="flex margin10-top">
                <span class="user-avatar">${offer.username[0].toUpperCase()}</span>
                <a href="#" class="text-link-with-hover font18"
                    style="margin-left: 4px;">${offer.username}</a>
            </div>
            <div class="margin25-top" style="line-height:1.5;">
                I${offer.description}
            </div>
            <div class="margin20-top font25 bold">
                ₦${offer.price}
            </div>
            <div class="flex margin10-top">
                <div class="margin40-right">
                    <i class="fa fa-star "></i>
                    <span class="font13 text-yellow">3.4(4)</span>
                </div>
                <div>
                    <i class="fas fa-clock text-green" style="font-size: 1.3rem;"></i>
                    <span class="font13">${offer.delivery} days</span>
                </div>
            </div>
            <div class="margin20-top">
                <div>
                    <a href="#" class="font15 button-green block">Edit Offer</a>
                </div>
            </div>
        </div>
    </div>`
        holder.insertAdjacentHTML("afterbegin", item)


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
