(function () {
    document.querySelector(".message-container").scrollTop = document.querySelector(".message-container").scrollHeight
    let name = document.querySelector("#hidden-username").value
    console.log(name)
    let receiver = document.querySelector("#hidden-receiver").value
    console.log(receiver)
    function newUser(name) {
        socket.emit("new-user", name);
    }


    let socket = io()

    socket.on("new-user", function (user) {
        console.log(user)
    })

    newUser(name)


    const messageInput = document.querySelector("#message")

    const status = document.querySelector(".typing-status");

    messageInput.addEventListener("focus", function (e) {
        socket.emit("typing", { name, receiver })
    });

    messageInput.addEventListener("blur", function (e) {
        socket.emit("stopped-typing", name)
    });

    socket.on("typing-status", function (user) {
        status.classList.remove("hide")
        status.textContent = `${user} is typing`
    });

    socket.on("stopped-typing", function (user) {
        status.classList.add("hide")
    });
    document.querySelector(".send-chat-button").addEventListener("click", (e) => {
        console.log("clicked")
        let message = messageInput.value
        console.log(message)
        // return
        socket.emit("chat", { sender: name, receiver, message })
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
        const check1 = document.createElement("i")
        check1.setAttribute("class", "fa fa-check text-blue")
        const check2 = document.createElement("i")
        check2.setAttribute("class", "fa fa-check text-blue")
        timeDiv.appendChild(check1)
        timeDiv.appendChild(check2)


        // div.classList.add("sender")
        // div.textContent = `Me: ${messageInput.value}`
        document.querySelector(".message-container").appendChild(msgContainer);
        messageInput.value = ""
        document.querySelector(".message-container").scrollTop = document.querySelector(".message-container").scrollHeight

    })
    socket.on("chat", function (data) {
        // console.log(data)
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

})()