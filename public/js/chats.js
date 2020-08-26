(function () {
    const modal = document.querySelector(".modal")
    const closeModalBtn = document.querySelector(".modal .fa-close")
    const sendChatBtn = document.querySelector(".send-chat-btn")
    const chatMessageInput = document.querySelector(".chat-message")
    const receiver = document.querySelector("#receiver").value
    const sender = document.querySelector("#sender").value
    const contactSellerBtns = document.querySelectorAll(".contact-seller-btn");

    (async function () {
        contactSellerBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                modal.classList.remove("hide")
            })
        })

    })()
    console.log("after")

    closeModalBtn.addEventListener("click", closeModal)
    function closeModal() {
        modal.classList.add("hide")
    }

    sendChatBtn.addEventListener("click", function () {
        sendMessage()
    })


    async function sendMessage() {
        const message = chatMessageInput.value.trim()
        console.log(receiver)
        console.log(sender)
        const body = JSON.stringify({
            to: receiver,
            from: sender,
            message

        })
        const resp = await fetch("/api/chats",
            {
                body,
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        if (resp.status === 201) {
            const data = await resp.json()
            console.log(data)
            closeModal()
            document.querySelector(".chat-send-notice").classList.remove("hide")
        } else {
            const data = await resp.json()
            console.log(data)
        }


    }




})()