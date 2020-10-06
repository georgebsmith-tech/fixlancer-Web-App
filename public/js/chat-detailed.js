(function () {

    const userIcon = document.querySelector(".user-icon")
    userIcon.style.backgroundColor = document.querySelector("#hidden-receiver-color").value
    const msgMainContainer = document.querySelector(".message-container")
    msgMainContainer.scrollTop = document.querySelector(".message-container").scrollHeight
    let name = document.querySelector("#hidden-username").value
    console.log(name)
    let receiver = document.querySelector("#hidden-receiver").value
    console.log(receiver)
    function newUser(name) {
        socket.emit("new-user", { name, receiver });
    }

    socket.on("new-user", function (user) {
        console.log(user)
    })
    socket.emit("chat-active", { user: name, active: true, receiver })

    socket.on("message-read", function (status) {
        const divs = msgMainContainer.querySelectorAll(".message-sent .flex-end .unread")
        divs.forEach(i => {
            i.classList.add("text-blue")
            const check1 = document.createElement("i")
            check1.setAttribute("class", "fa fa-check text-blue")
            i.parentElement.appendChild(check1)

        })
    })
    newUser(name)
    socket.on("user-offline", function (user) {
        console.log("offline user:" + user)
        if (receiver === user) {
            console.log("YESSSSSSSSSS")
            changeStatus("Away", "#f27415")
        } else {
            console.log("NOOOOOOOOOOOOOO")
        }
    })




    const messageInput = document.querySelector("#message")

    const status = document.querySelectorAll(".typing-status");

    messageInput.addEventListener("focus", function (e) {
        socket.emit("typing", { name, receiver })
    });

    messageInput.addEventListener("blur", function (e) {
        socket.emit("stopped-typing", name)
    });

    socket.on("typing-status", function (user) {
        status.forEach(obj => {
            obj.classList.remove("invisible")
            obj.innerHTML = `<i class="fa fa-pencil"></i> is typing...`
        })

    });
    function changeStatus(state, color) {
        document.querySelector(".online-status-icon").style.color = color
        document.querySelector(".online-status-text").textContent = state
        console.log(document.querySelector(".online-status-icon"))
        console.log(document.querySelector(".online-status-text"))
    }

    socket.on("user-online", function (user) {
        if (user === receiver) {
            changeStatus("Active now", "#89E130")
            console.log("They're same")

        } else {
            console.log("No, they're not same")
        }


    })

    socket.on("stopped-typing", function (user) {
        status.forEach(obj => {
            obj.classList.add("invisible")
            obj.textContent = `${user} is typing`
        })
    });
    document.querySelector(".send-chat-button").addEventListener("click", (e) => {


        let message = messageInput.value
        if (message === "") {
            messageInput.style.border = "1px solid red"
            document.querySelector(".chat-input-error").classList.remove("hide")
            return
        }
        messageInput.style.border = "1px solid #ddd"
        document.querySelector(".chat-input-error").classList.add("hide")

        // return
        let state;
        if (document.querySelector(".online-status-text").textContent === "Active now") state = "seen"
        else
            state = "sent"
        socket.emit("chat", { sender: name, receiver, message, state })
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
        messageInput.value = ""
        msgMainContainer.scrollTop = msgMainContainer.scrollHeight

    })
    socket.on("chat", function (data) {
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

    socket.on("message-sent", function (data) {
        const divs = msgMainContainer.querySelectorAll(".message-sent .flex-end")
        if (data.status === "seen") {
            const check1 = document.createElement("i")
            check1.setAttribute("class", "fa fa-check text-blue")
            const check2 = document.createElement("i")
            check2.setAttribute("class", "fa fa-check text-blue")
            divs[divs.length - 1].appendChild(check1)
            divs[divs.length - 1].appendChild(check2)
        } else if (data.status === "sent") {
            const check1 = document.createElement("i")
            check1.setAttribute("class", "fa fa-check unread")
            divs[divs.length - 1].appendChild(check1)
        }


    })

    window.addEventListener("focus", function () {
        console.log("focussed!!")
        socket.emit("chat-active", { user: name, active: true, receiver })
    })
    window.addEventListener("blur", function () {
        socket.emit("chat-active", { user: name, active: false, receiver })
        console.log("blur!!")
    })

})()