
(function () {
    const titleInput = document.getElementById("title")
    const sellerInSent = document.getElementById("sent-seller")

    const priceInput = document.getElementById("price")
    const descriptionInput = document.getElementById("description")
    const deliveryInput = document.getElementById("delivery")
    const acceptTerms = document.getElementById("accept-terms")
    const offerBtn = document.querySelector(".place-offer")
    const numberOfOffersHolder = document.querySelector(".number-of-offers")
    const chatSentNotice = document.querySelector(".chat-send-notice")


    const messageModal = document.querySelector(".message-modal")
    const messageSellerBtns = document.querySelectorAll(".message-seller")
    const closeMessageBtn = document.querySelector(".close-message")
    const closeAlert = document.querySelector(".closed-alert")
    const closeRequest = document.querySelector(".close-request")
    const sellerSpan = document.querySelector(".seller")
    const sendBtn = document.querySelector(".send")
    const requestSlug = document.getElementById("hidden-request-slug").value
    const buyer = document.getElementById("hidden-request-owner").value
    const messageContainer = document.getElementById("message")
    let seller;

    sendBtn.addEventListener("click", function () {
        const message = messageContainer.value.trim()
        messageContainer.value = ""
        if (message !== "") {
            sendMessage(message)
            messageModal.classList.add("hide")
            sellerInSent.innerText = seller
            chatSentNotice.classList.remove("hide")
            // setTimeout(() => {
            //     let fadeAlert = new Promise((res, rej) => {
            //         try {
            //             chatSentNotice.style.transition = "2.5s"
            //             chatSentNotice.style.opacity = "0"
            //             chatSentNotice.style.height = "0"
            //             res()

            //         } catch{
            //             rej()
            //         }
            //     })
            //     fadeAlert.then(() => {
            //         // chatSentNotice.classList.add("hide")
            //         // chatSentNotice.style.opacity = "1"
            //         // chatSentNotice.style.height = "initial"
            //     }

            //     )

            // }, 5000)

        }

    })


    async function sendMessage(message) {
        const data = {
            to: seller,
            from: buyer,
            message

        }
        const resp = await fetch("/api/chats",
            {
                body: JSON.stringify(data),
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        const outData = await resp.json()
        console.log(outData)

    }



    if (closeRequest)
        closeRequest.addEventListener("click", function () {
            closeAlert.classList.remove("hide")
            this.classList.add("hide")
            fetch(`/api/requests/${requestSlug}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    slug: requestSlug

                })
            })
                .then(resp => {

                })

        })


    closeMessageBtn.addEventListener("click", function () {
        messageModal.classList.add("hide")
    })


    messageSellerBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            messageModal.classList.remove("hide")
            seller = this.dataset.seller
            sellerSpan.innerText = seller

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
