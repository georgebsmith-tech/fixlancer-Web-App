



(function () {
    const sendMessageBTN = document.querySelector(".send-message")
    const messageHolder = document.querySelector("#message")
    const sender = document.querySelector(".sender").value
    const receiver = document.querySelector(".receiver").value
    const orderID = document.querySelector(".order-id").value
    const status = document.querySelectorAll(".typing-status");
    const msgMainContainer = document.querySelector(".message-container")
    msgMainContainer.scrollTop = msgMainContainer.scrollHeight

    const requirementsDetailed = document.querySelector(".requirements-detailed")
    const requirementsToggle = document.querySelector(".requirements-toggle")
    const secondsHolder = document.getElementById("seconds")
    const minutesHolder = document.getElementById("minutes")
    const hoursHolder = document.getElementById("hours")
    const daysHolder = document.getElementById("days")
    const disputeModal = document.querySelector(".confirm-dispute-modal")
    const cancellationModal = document.querySelector(".cancellation-modal")
    const milestoneInput = document.querySelector("#milestone-input")

    const milestoneBTN = document.querySelector(".release-milestone")



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
    const rejectCancellationBTN = document.getElementById("reject-cancellation")
    const messageController = document.querySelector(".message-control")
    const sendextraBTN = document.querySelector(".send-extra-offer")
    const extrasPriceInput = document.querySelector(".extras-price")
    const extrasDaysInput = document.querySelector(".extras-days")
    const extrasHeadingInput = document.querySelector(".extras-heading")
    const sendDisputeBTN = document.querySelector(".send-dispute")
    const disputeMsgInput = document.querySelector("#dispute-message")
    const confirmDispute = document.querySelector(".confirm-dispute")
    const closeDispute = document.querySelector(".close-dispute-modal")
    const milestoneErrors = document.querySelectorAll(".milestone-error")
    let presentMilestoneAmount = document.querySelector(".milestone-present")
    const milestoneSuccess = document.querySelector(".milestone-success")

    const hiddenAtachment = document.querySelector(".attachment")
    const attachBTN = document.querySelector(".attach-btn")
    const fileNameHolder = document.querySelector(".file-name-holder")
    const fileName = document.querySelector(".file-name")



    attachBTN.addEventListener("click", function () {
        hiddenAtachment.click()
    })

    hiddenAtachment.addEventListener("input", function (e) {
        fileName.textContent = this.files[0].name
        fileNameHolder.classList.remove("invisible")
    });









    function isValidPercent(per) {
        if (!per) {
            milestoneErrors[0].classList.remove("invisible")
            milestoneErrors[1].classList.add("invisible")
            milestoneInput.style.borderColor = "red"
            return false

        } else if (per <= 0 || per > 10) {
            milestoneErrors[1].classList.remove("invisible")
            milestoneErrors[0].classList.add("invisible")

            milestoneInput.style.borderColor = "red"
            return false

        } else {
            milestoneErrors[1].classList.add("invisible")
            milestoneErrors[0].classList.add("invisible")

            milestoneInput.style.borderColor = "#ddd"
            return true

        }

    }

    async function releaaseMilestone(per) {
        const body = JSON.stringify({
            percent: per,
            seller: receiver,
            order_id: orderID
        })

        const response = await fetch(`/api/milestones`, {
            method: "post",
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        console.log(data)
        return data

    }

    if (milestoneBTN)
        milestoneBTN.addEventListener("click", function () {
            const milestonePercent = milestoneInput.value.trim() * 1
            const isValid = isValidPercent(milestonePercent)
            if (!isValid)
                return
            releaaseMilestone(milestonePercent)
                .then(data => {
                    presentMilestoneAmount = document.querySelector(".milestone-present")
                    if (!presentMilestoneAmount) {
                        document.querySelector(".no-miles").textContent = ""
                        document.querySelector(".no-miles").insertAdjacentHTML("beforeend", `<i class="fa fa-check text-green"></i>
                        <span>Milestone released:

                            ₦<span class="milestone-present"> ${data.milestone.amount.toFixed(2)}</span>
                           
                        </span>
`)
                    } else {
                        presentMilestoneAmount.textContent = (presentMilestoneAmount.textContent * 1 + data.milestone.amount).toFixed(2)

                    }
                    milestoneInput.value = ""
                    milestoneSuccess.classList.add("fade-notice")
                    const milestonesCount = document.querySelector(".milestonesCount")
                    setTimeout(() => {
                        milestoneSuccess.classList.remove("fade-notice")
                    }, 9000)
                    if (milestonesCount.value >= 3) {
                        document.querySelector(".milestone-form-container").classList.add("hide")

                    } else {
                        milestonesCount.value += 1
                    }


                    // document.querySelector(".go-top").click()


                })
        })

    closeDispute.addEventListener("click", function () {
        disputeModal.classList.add("hide")
    })
    confirmDispute.addEventListener("click", function () {
        const disputeMessage = disputeMsgInput.value.trim()
        sendOrderChat(disputeMessage)

    })
    if (sendDisputeBTN)
        sendDisputeBTN.addEventListener("click", function () {
            disputeModal.classList.remove("hide")



        })


    function sendOrderChat(message) {
        if (document.querySelector(".online-status-text").textContent === "Active now") state = "seen"
        else
            state = "sent"
        socket.emit("order-chat", { sender, receiver, message, state, orderID, type: "dispute" })
        attacheDsiputeNotice()
        attachMessageToPage(message)
        document.querySelector(".dispute-container").classList.add("hide")
        disputeModal.classList.add("hide")
        document.querySelector(".go-top").click()

    }

    function attacheDsiputeNotice() {
        const dispute = `
        <div class="margin20-top margin20-sides">
            <div class="center-text bg-dispute border5-radius padd10 font14 text-orange">
            <i class="fa fa-gavel text-dark-orange"></i>
                <span class="text-dark-orange">
                    Under Dispute
                </span>
            </div>
        </div>`
        msgMainContainer.insertAdjacentHTML("beforeend", dispute)
        msgMainContainer.scrollTop = msgMainContainer.scrollHeight
    }

    function attachMessageToPage(message) {
        const theMessage = `<div class="flex-end margin5-bottom">
        <div class="padd10 border5-radius font13 message-sent">
        <div class="margin10-bottom">
        ${message}
        </div>
        <div class="flex-end">
        <div class="font-small italic font-faint">
        now
        </div>
        </div>

        </div>
        </div>`
        msgMainContainer.insertAdjacentHTML("beforeend", theMessage)
        msgMainContainer.scrollTop = msgMainContainer.scrollHeight


    }




    function getExtrasBody() {
        const extraHeading = extrasHeadingInput.value
        const extrasPrice = extrasPriceInput.value
        const extrasDays = extrasDaysInput.value
        const body = JSON.stringify({
            username: sender,
            to: receiver,
            price: extrasPrice,
            days: extrasDays,
            description: extraHeading,
            order_id: orderID,
            type: "extras"

        })
        return body

    }

    const acceptExtraBTN = document.querySelectorAll(".accept-extra")
    if (acceptExtraBTN)
        acceptExtraBTN.forEach(button => {
            button.addEventListener("click", function () {
                location.href = `/dashboard/pay-for-extra?oid=${orderID}&eid=${button.dataset.extraid}`
            })

        })


    function showExtraChat(data) {
        data = data.chat

        const notice = `<div class="bg-">
        <h3 class="bold font15">Extras</h3>
     <div class="bg-white padd10 padd20-left margin10-bottom border5-radius border3-left-light-blue">
         <div class="font14">
             <div class="margin5-bottom">${data.content.description}</div>
             <div class="flex-between">
                 <div>
                     <span>+ ${data.content.days} days</span>
                     <span>|</span>
                     <span>₦${data.content.price}</span>

                 </div>
                 <div>
                    
                 </div>
                
             </div>
             
         </div>

     </div>
 </div>`
        msgMainContainer.insertAdjacentHTML("beforeend", notice)
        msgMainContainer.scrollTop = msgMainContainer.scrollHeight





    }

    async function sendextra(body) {
        const response = await fetch(`/api/orderchats`, {
            method: "post",
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data


    }

    if (sendextraBTN)
        sendextraBTN.addEventListener("click", function () {
            const extraHeading = extrasHeadingInput.value.trim()
            const extrasPrice = extrasPriceInput.value.trim()
            const extrasDays = extrasDaysInput.value
            if (!extraHeading || !extrasPrice || extrasDays === "-1")
                return
            const body = getExtrasBody()
            sendextra(body)
                .then(data => {
                    showExtraChat(data)
                    offerExtrasModal.classList.add("hide")

                })



        })

    if (rejectCancellationBTN) {
        rejectCancellationBTN.addEventListener("click", function () {
            rejectCancellation(this)
                .then(data => {
                    this.parentElement.parentElement.classList.add("hide")
                    const header = "Cancellation Rejected"
                    const notice = "Mutual cancllation of the order was rejected."
                    requestCancellationBTN.parentElement.classList.remove("hide")

                    attachNotice(notice, header)

                })

        })
    }






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

                    if (document.querySelector(".milestone-form-container"))
                        document.querySelector(".milestone-form-container").classList.add("hide")
                    document.querySelector(".dispute-container").classList.add("hide")
                    document.querySelector(".timer-container").classList.add("hide")
                    messageController.classList.add("hide")
                    disputeOrderBTN.classList.add("hide")
                    if (deliveryModalBTN)
                        deliveryModalBTN.classList.add("hide")
                    attachNotice(notice, header)

                })
        })
    async function acceptCancellation(object) {

        const response = await fetch("/api/sales/cancellation", {
            method: "put",
            body: JSON.stringify({
                order_id: orderID,
                username: sender,
                to: receiver,
                state: "accept",
                chatID: object.dataset.chatid
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data
    }

    async function rejectCancellation(object) {


        const response = await fetch("/api/sales/cancellation", {
            method: "put",
            body: JSON.stringify({
                order_id: orderID,
                username: sender,
                to: receiver,
                state: "reject",
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

        let signeDiv;
        if (header === "Cancellation Rejected") {
            signeDiv = `<div class="margin10-right  flex-center">
            <i class="fa fa-ban font33 text-dark-red"></i>
            </div>`
        } else {
            signeDiv = `<div class="margin10-right circle border3-dark-red flex-center" style="width: 30px;height:30px;">
            <i class="fa fa-close font18 text-dark-red"></i>
        </div>`
        }

        const notice = `
            <div class="border-smooth margin10-top margin10-bottom padd10 " style="background-color: #eee;" >
            <div style=" display: grid;grid-template-columns: 40px auto;align-items:center">
            ${signeDiv}
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
                requestCancellationBTN.parentElement.classList.add("hide")
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

    if (disputeOrderBTN)
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




    if (sendMessageBTN)

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
            theMessageDiv.classList.add("margin10-bottom")
            div.appendChild(theMessageDiv)


            // time and reading status
            const timeDiv = document.createElement("div")
            timeDiv.textContent = "just now"
            timeDiv.setAttribute("class", "italic font-faint font-small")
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
        theMessageDiv.classList.add("margin10-bottom")
        div.appendChild(theMessageDiv)

        const timeDiv = document.createElement("div")
        timeDiv.textContent = "just now"
        timeDiv.setAttribute("class", "flex-end font-small italic font-faint")
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