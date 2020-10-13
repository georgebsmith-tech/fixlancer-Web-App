

(function () {
    const sendMessageBTN = document.querySelector(".send-message")
    const messageHolder = document.querySelector("#message")
    const sender = document.querySelector(".sender").value
    const receiver = document.querySelector(".receiver").value
    const orderID = document.querySelector(".order-id").value
    const status = document.querySelectorAll(".typing-status");
    const msgMainContainer = document.querySelector(".message-container")
    msgMainContainer.scrollTop = document.querySelector(".message-container").scrollHeight

    const requirementsDetailed = document.querySelector(".requirements-detailed")
    const requirementsToggle = document.querySelector(".requirements-toggle")
    const secondsHolder = document.getElementById("seconds")
    const minutesHolder = document.getElementById("minutes")
    const hoursHolder = document.getElementById("hours")
    const daysHolder = document.getElementById("days")
    const cancellationModal = document.querySelector(".cancellation-modal")
    const requestCancellationBTN = document.querySelector(".request-cancellation")
    const closeRequestBTN = document.querySelector(".close-request-modal")
    const deliveryModal = document.querySelector(".delivery-modal")
    const deliveryModalBTN = document.querySelector(".request-delivery")
    const closeDeliveryBTN = document.querySelector(".close-delivery-modal")
    const disputeOrderBTN = document.querySelector(".dispute-order")
    const disputeSlideOutContainer = document.querySelector(".dispute-hide")
    const offerExtrasModal = document.querySelector(".offer-extras-modal")
    const requestcancellationConfirmBTN = document.getElementById("request-cancellation")
    const acceptCancellationBTN = document.getElementById("accept-cancellation")



    const getDate = (date) => {
        if (!date)
            return "N/A"
        let months = ["Jan", "Feb", "Mar", "Apr", "MAy", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let newDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        return newDate
    }

    const getDateAndTime = () => {
        let date = new Date()
        let hr = date.getHours() >= 13 ? date.getHours() - 12 : date.getHours()
        let period = date.getHours() >= 12 ? "pm" : "am"
        return getDate(date) + ` ${hr}:${date.getMinutes()}${period}`

    }


    if (acceptCancellationBTN)
        acceptCancellationBTN.addEventListener("click", function () {
            acceptCancellation(this)
                .then(data => {
                    this.parentElement.parentElement.classList.add("hide")
                    const header = "Cancellation Accepted"
                    const notice = "Mutual cancllation of the order was accepted."
                    attachNotice(notice, header)

                })
        })
    async function acceptCancellation(object) {
        // console.log("object")
        // console.log(object)
        // console.log(object.dataset)
        // return


        const response = await fetch("/api/sales/cancellation", {
            method: "put",
            body: JSON.stringify({
                order_id: orderID,
                username: sender,
                to: receiver,
                chatID: object.dataset.chatid
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data
    }
    async function requestCancellation() {
        const body = JSON.stringify({
            order_id: orderID,
            username: sender,
            to: receiver
        })
        const response = await fetch(`/api/sales/cancellation`, {
            method: "post",
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data
    }

    function attachNotice(theNotice, header) {
        const notice = `
            <div class="border-smooth margin10-top margin10-bottom padd10 " style="background-color: #eee;" >
            <div style=" display: grid;grid-template-columns: 40px auto;align-items:center">
            <div class="margin10-right circle border3-dark-red flex-center" style="width: 30px;height:30px;">
                <i class="fa fa-close font18 text-dark-red"></i>
            </div>
            <div>
                <h4 class="bold font13 margin10-bottom">${header}</h4>
               
                    <span class="font11">
                        ${theNotice}
                    </span>
            </div>
        </div>
            <div class="flex-end margin5-top">
                <small>${getDateAndTime()}</small>
            </div>
           
        </div>
            `
        msgMainContainer.insertAdjacentHTML("beforeend", notice)
        msgMainContainer.scrollTop = msgMainContainer.scrollHeight


    }


    function appendRequestTochat(data) {
        const notice = "You have requested a mutual cancellation for this order."
        const header = "Order cancellation"
        attachNotice(notice, header)





    }
    msgMainContainer.scrollTop = msgMainContainer.scrollHeight

    requestcancellationConfirmBTN.addEventListener("click", function () {

        requestCancellation()
            .then(data => {

                cancellationModal.classList.add("hide")
                appendRequestTochat(data)
            })

    })

    const closeOfferExtrasModal = document.querySelector(".close-offer-extra-modal")

    if (closeOfferExtrasModal)
        closeOfferExtrasModal.addEventListener("click", function () {
            offerExtrasModal.classList.add("hide")

        })


    const offerExtrasModalBTN = document.querySelector(".offer-extra")
    if (offerExtrasModalBTN)
        offerExtrasModalBTN.addEventListener("click", function () {
            offerExtrasModal.classList.remove("hide")

        })


    disputeOrderBTN.addEventListener("click", function () {
        console.log("Dispute")
        disputeSlideOutContainer.classList.toggle("dispute-slide-in")
        disputeSlideOutContainer.classList.toggle("dispute-slide-out")
    })



    if (closeDeliveryBTN) {
        closeDeliveryBTN.addEventListener("click", function () {

            deliveryModal.classList.add("hide")
        })
    }



    if (deliveryModalBTN) {
        deliveryModalBTN.addEventListener("click", function () {
            deliveryModal.classList.remove("hide")
        })
    }



    if (closeRequestBTN) {
        closeRequestBTN.addEventListener("click", function () {
            console.log("request")
            cancellationModal.classList.add("hide")
        })
    }



    if (requestCancellationBTN) {
        requestCancellationBTN.addEventListener("click", function () {
            cancellationModal.classList.remove("hide")
        })
    }



    function timeHelperFunction(token, tokenHolder, tokenModifier, maxToken) {
        if (token - 1 === 0) {
            tokenHolder.textContent = maxToken
            if (tokenModifier)
                tokenModifier()

        }
        else if (`${token - 1}`.length === 1) {
            tokenHolder.textContent = `0${token - 1}`

        } else {
            tokenHolder.textContent = token - 1
        }

    }

    function modifyDays() {
        let days = daysHolder.textContent * 1
        timeHelperFunction(days, daysHolder)


    }

    function modifyHours() {
        let hours = hoursHolder.textContent * 1
        timeHelperFunction(hours, hoursHolder, modifyDays, 24)


    }
    function modifyMinutes() {
        let minutes = minutesHolder.textContent * 1
        timeHelperFunction(minutes, minutesHolder, modifyHours, 60)
    }
    let orderTimer = setInterval(() => {
        if (document.querySelector(".timer").value === "false") {
            clearInterval(orderTimer)
            return

        }

        let seconds = secondsHolder.textContent * 1
        timeHelperFunction(seconds, secondsHolder, modifyMinutes, 60)

    }, 1000)

    let flag = true
    if (requirementsToggle) {
        requirementsToggle.addEventListener("click", function () {

            if (flag) {
                this.querySelector(".fa").classList.remove("fa-angle-down")
                this.querySelector(".fa").classList.add("fa-angle-up")
                flag = !flag

            } else {
                this.querySelector(".fa").classList.add("fa-angle-down")
                this.querySelector(".fa").classList.remove("fa-angle-up")
                flag = !flag

            }

            // requirementsDetailed.classList.toggle("hide")
            requirementsDetailed.classList.toggle("font14")
            requirementsDetailed.classList.toggle("padd10")
        })
    }






    sendMessageBTN.addEventListener("click", function () {
        const message = messageHolder.value.trim()

        if (message === "") {
            messageHolder.style.border = "1px solid red"
            document.querySelector(".chat-input-error").classList.remove("hide")
            return
        }
        messageHolder.style.border = "1px solid #ddd"
        document.querySelector(".chat-input-error").classList.add("hide")
        let state;
        if (document.querySelector(".online-status-text").textContent === "Active now") state = "seen"
        else
            state = "sent"
        socket.emit("order-chat", { sender, receiver, message, state, orderID })
        // return
        const msgContainer = document.createElement("div")
        msgContainer.classList.add("flex-end")
        const msgWrapper = document.createElement("div")
        msgWrapper.setAttribute("class", "padd10 message-sent font13")
        msgContainer.appendChild(msgWrapper)
        const div = document.createElement("div")
        msgWrapper.appendChild(div)
        const theMessageDiv = document.createElement("div")
        theMessageDiv.textContent = message
        theMessageDiv.classList.add("padd20-bottom")
        div.appendChild(theMessageDiv)


        // time and reading status
        const timeDiv = document.createElement("div")
        timeDiv.textContent = "just now"
        timeDiv.setAttribute("class", "flex-end font10")
        div.appendChild(timeDiv)

        document.querySelector(".message-container").appendChild(msgContainer);
        messageHolder.value = ""
        msgMainContainer.scrollTop = msgMainContainer.scrollHeight

    })

    socket.on("order-chat", function (data) {
        const msgContainer = document.createElement("div")
        msgContainer.classList.add("flex-start")
        const msgWrapper = document.createElement("div")
        msgWrapper.setAttribute("class", "padd10 message-received font13")
        msgContainer.appendChild(msgWrapper)
        const div = document.createElement("div")
        msgWrapper.appendChild(div)
        const theMessageDiv = document.createElement("div")
        theMessageDiv.textContent = data.message
        theMessageDiv.classList.add("padd20-bottom")
        div.appendChild(theMessageDiv)

        const timeDiv = document.createElement("div")
        timeDiv.textContent = "just now"
        timeDiv.setAttribute("class", "flex-end font10")
        div.appendChild(timeDiv)
        document.querySelector(".message-container").appendChild(msgContainer);
        document.querySelector(".message-container>div:last-child").getElementsByClassName.display = "none"
        document.querySelector(".message-container").scrollTop = document.querySelector(".message-container").scrollHeight
    });

    messageHolder.addEventListener("blur", function (e) {
        socket.emit("order-stopped-typing", sender)
    });

    messageHolder.addEventListener("focus", function (e) {
        console.log("Typing")
        socket.emit("order-typing", { sender, receiver })
    });

    socket.emit("order-new-user", { sender, receiver })

    socket.on("order-typing-status", function (user) {

        status.forEach(obj => {
            obj.classList.remove("invisible")
            obj.innerHTML = `<i class="fa fa-pencil"></i> is typing...`
        })

    });

    socket.on("order-stopped-typing", function (user) {
        status.forEach(obj => {
            obj.classList.add("invisible")
            obj.textContent = `${user} is typing`
        })
    });







})()